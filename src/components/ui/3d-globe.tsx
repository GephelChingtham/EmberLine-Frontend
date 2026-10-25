"use client";
import React, { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
  lat: number;
  lng: number;
  src?: string;
  label?: string;
  size?: number;
  sensorType?: 'MODIS' | 'VIIRS' | 'GROUND';
  color?: string;
  isGlowing?: boolean;
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Globe base color (used as fallback or tint) */
  globeColor?: string;
  /** URL to the Earth texture map */
  textureUrl?: string;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness (higher = more diffuse, default 3) */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** Auto rotate speed (0 = disabled) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
  /** Initial rotation */
  initialRotation?: { x: number; y: number };
  /** Marker default size */
  markerSize?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show on-screen zoom buttons (+/-/reset) */
  showZoomControls?: boolean;
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: GlobeMarker) => void;
  /** Callback when a marker is hovered */
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker Component (Pure WebGL Meshes - Zero React 19 HTML Unmount Errors)
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({
  marker,
  radius,
  onClick,
  onHover,
}: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const groupRef = useRef<THREE.Group>(null);
  const dotMeshRef = useRef<THREE.Mesh>(null);
  const pulseMeshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Position flush on the globe surface
  const surfacePosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.003);
  }, [marker.lat, marker.lng, radius]);

  // Surface normal for orienting the minimal ring tangent to the globe
  const normal = useMemo(() => surfacePosition.clone().normalize(), [surfacePosition]);

  const surfaceQuaternion = useMemo(() => {
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return quat;
  }, [normal]);

  useFrame(() => {
    if (!groupRef.current) return;

    const worldNormal = normal.clone();
    if (groupRef.current.parent) {
      const parentQuat = new THREE.Quaternion();
      groupRef.current.parent.getWorldQuaternion(parentQuat);
      worldNormal.applyQuaternion(parentQuat);
    }
    const cameraDir = camera.position.clone().normalize();
    const dot = worldNormal.dot(cameraDir);

    setIsVisible(dot > -0.1);

    // Compensate for perspective zoom so dots & ping never blow up when zoomed in
    const surfaceDist = Math.max(0.4, camera.position.length() - radius);
    const baseSurfaceDist = radius * 2.4;
    const zoomScale = THREE.MathUtils.clamp(surfaceDist / baseSurfaceDist, 0.16, 1.0);

    if (dotMeshRef.current) {
      const hoverBoost = hovered ? 1.15 : 1.0;
      const s = zoomScale * hoverBoost;
      dotMeshRef.current.scale.set(s, s, s);
    }

    // Minimal, slow hairline ring pulse scaled by zoom
    if (marker.isGlowing && pulseMeshRef.current) {
      const t = (performance.now() * 0.0005) % 1;
      const scale = (1 + t * 0.35) * zoomScale;
      pulseMeshRef.current.scale.set(scale, scale, 1);
      const mat = pulseMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (1 - t) * 0.28;
      }
    }
  });

  const handlePointerEnter = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(marker);
  }, [marker, onHover]);

  const handlePointerLeave = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(false);
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClick?.(marker);
  }, [marker, onClick]);

  const isModis = marker.sensorType === 'MODIS';
  // Tiny halftone dots: Big dot = MODIS (1 km), Small dot = VIIRS (375 m)
  const dotRadius = isModis ? 0.018 : 0.010;
  const dotColor = marker.color || (isModis ? '#FC5000' : '#FFB020');

  return (
    <group ref={groupRef} visible={isVisible}>
      {/* Single tiny halftone dot on surface */}
      <mesh
        ref={dotMeshRef}
        position={surfacePosition}
        onPointerOver={handlePointerEnter}
        onPointerOut={handlePointerLeave}
        onClick={handleClick}
      >
        <sphereGeometry args={[dotRadius, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : dotColor} />
      </mesh>

      {/* Single minimal hairline pulse ring */}
      {marker.isGlowing && (
        <mesh
          ref={pulseMeshRef}
          position={surfacePosition}
          quaternion={surfaceQuaternion}
        >
          <ringGeometry args={[0.013, 0.0155, 32]} />
          <meshBasicMaterial
            color="#FC5000"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ============================================================================
// Rotating Globe with Markers
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load Earth textures
  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl,
    config.bumpMapUrl,
  ]);

  // Configure textures
  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 8;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 4;
    }
  }, [earthTexture, bumpTexture]);

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 64, 64);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  return (
    <group ref={groupRef}>
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Wireframe overlay */}
      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* Markers - rotated synchronously with globe */}
      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          defaultSize={config.markerSize}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Atmosphere Component
// ============================================================================

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  controlsRef: React.RefObject<any>;
  targetDistanceRef: React.MutableRefObject<number | null>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({
  markers,
  config,
  controlsRef,
  targetDistanceRef,
  onMarkerClick,
  onMarkerHover,
}: SceneProps) {
  const { camera } = useThree();

  React.useEffect(() => {
    // Face North America & California at initial load
    const dist = config.radius * 3.4;
    camera.position.set(-0.45 * dist, 0.45 * dist, 0.77 * dist);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  useFrame(() => {
    if (targetDistanceRef.current !== null && controlsRef.current) {
      const target = (controlsRef.current.target as THREE.Vector3) || new THREE.Vector3(0, 0, 0);
      const offset = camera.position.clone().sub(target);
      const currentDist = offset.length();
      const desiredDist = THREE.MathUtils.clamp(
        targetDistanceRef.current,
        config.minDistance,
        config.maxDistance,
      );

      if (Math.abs(currentDist - desiredDist) < 0.01) {
        offset.setLength(desiredDist);
        camera.position.copy(target).add(offset);
        targetDistanceRef.current = null;
      } else {
        const nextDist = THREE.MathUtils.lerp(currentDist, desiredDist, 0.22);
        offset.setLength(nextDist);
        camera.position.copy(target).add(offset);
      }
      controlsRef.current.update();
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      {/* Rotating Globe with Native Halftone Markers */}
      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
      />

      {/* Atmosphere */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={config.enablePan}
        enableZoom={false}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: "#14110F",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: "#3FD0C9",
  atmosphereIntensity: 10,
  atmosphereBlur: 3.5,
  bumpScale: 2,
  autoRotateSpeed: 0.35,
  enableZoom: true,
  enablePan: false,
  minDistance: 3.2,
  maxDistance: 12,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.06,
  showWireframe: false,
  wireframeColor: "#3FD0C9",
  ambientIntensity: 0.75,
  pointLightIntensity: 1.8,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  showZoomControls = true,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );
  const controlsRef = useRef<any>(null);
  const targetDistanceRef = useRef<number | null>(null);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlsRef.current?.object) {
      const cam = controlsRef.current.object as THREE.Camera;
      const target = (controlsRef.current.target as THREE.Vector3) || new THREE.Vector3(0, 0, 0);
      const baseDist = targetDistanceRef.current ?? cam.position.distanceTo(target);
      // Zoom IN: bring camera closer to the globe
      targetDistanceRef.current = Math.max(
        mergedConfig.minDistance,
        baseDist * 0.8,
      );
    }
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlsRef.current?.object) {
      const cam = controlsRef.current.object as THREE.Camera;
      const target = (controlsRef.current.target as THREE.Vector3) || new THREE.Vector3(0, 0, 0);
      const baseDist = targetDistanceRef.current ?? cam.position.distanceTo(target);
      // Zoom OUT: move camera farther from the globe
      targetDistanceRef.current = Math.min(
        mergedConfig.maxDistance,
        baseDist * 1.25,
      );
    }
  };

  return (
    <div className={cn("relative h-[500px] w-full select-none", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.5],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={null}>
          <Scene
            markers={markers}
            config={mergedConfig}
            controlsRef={controlsRef}
            targetDistanceRef={targetDistanceRef}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        </Suspense>
      </Canvas>

      {/* Zoom controls: + to zoom in, - to zoom out */}
      {showZoomControls && mergedConfig.enableZoom && (
        <div
          className="absolute top-4 right-4 z-20 flex flex-col items-center bg-[#131316]/90 backdrop-blur-md px-1 py-1 rounded-full border border-dotted border-[#26262B]"
          aria-label="Globe zoom controls"
        >
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom in"
            aria-label="Zoom in"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#F2EFE9] hover:text-[#FC5000] hover:bg-[#1E1E24] text-[16px] font-mono leading-none transition-colors cursor-pointer"
          >
            +
          </button>
          <div className="w-3 h-px bg-[#26262B] my-0.5" />
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom out"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#F2EFE9] hover:text-[#FC5000] hover:bg-[#1E1E24] text-[16px] font-mono leading-none transition-colors cursor-pointer"
          >
            −
          </button>
        </div>
      )}
    </div>
  );
}

export default Globe3D;
