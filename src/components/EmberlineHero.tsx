/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Globe3D, GlobeMarker } from '@/components/ui/3d-globe';
import { SampleBadge } from './SampleBadge';
import { JargonTooltip } from './JargonTooltip';

interface EmberlineHeroProps {
  onExploreClick: () => void;
  onMethodClick: () => void;
  onCaliforniaClick: () => void;
  onProofClick: () => void;
}

// Halftone satellite dots: Big = MODIS 1km (#FC5000 / #B31B00), Small = VIIRS 375m (#FFB020 / #3FD0C9)
const halftoneSatelliteMarkers: (GlobeMarker & { isCalifornia?: boolean })[] = [
  // California cluster (Sierra Nevada, Butte/Dixie, Central Valley, SoCal)
  {
    lat: 39.865,
    lng: -121.235,
    label: "California: VIIRS 375m Detection",
    sensorType: 'VIIRS',
    color: '#FFB020',
    isCalifornia: true,
  },
  {
    lat: 37.865,
    lng: -119.538,
    label: "California (Sierra Nevada): Active Glow",
    sensorType: 'VIIRS',
    color: '#FC5000',
    isGlowing: true,
    isCalifornia: true,
  },
  {
    lat: 36.7783,
    lng: -119.4179,
    label: "California (Central Valley): MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
    isCalifornia: true,
  },
  {
    lat: 34.2,
    lng: -118.1,
    label: "Southern California: MODIS 1km Detection",
    sensorType: 'MODIS',
    color: '#FC5000',
    isCalifornia: true,
  },
  // Global reference fire basins
  {
    lat: -5.421,
    lng: -56.882,
    label: "Amazon Basin: MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
  },
  {
    lat: -12.21,
    lng: -55.45,
    label: "Amazon: VIIRS 375m Pixel",
    sensorType: 'VIIRS',
    color: '#FFB020',
  },
  {
    lat: 38.2,
    lng: 23.7,
    label: "Mediterranean: VIIRS 375m Detection",
    sensorType: 'VIIRS',
    color: '#FFB020',
  },
  {
    lat: -33.712,
    lng: 150.311,
    label: "Australia: MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
  },
  {
    lat: -28.5,
    lng: 152.1,
    label: "Australia: VIIRS 375m Detection",
    sensorType: 'VIIRS',
    color: '#FFB020',
  },
  {
    lat: 62.035,
    lng: 129.732,
    label: "Siberia Taiga: MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
  },
  {
    lat: 53.5461,
    lng: -113.4938,
    label: "Canada Boreal: VIIRS 375m Detection",
    sensorType: 'VIIRS',
    color: '#FFB020',
  },
  {
    lat: -8.8,
    lng: 24.5,
    label: "Central Africa: MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
  },
];

export function EmberlineHero({
  onExploreClick,
  onMethodClick,
  onCaliforniaClick,
  onProofClick,
}: EmberlineHeroProps) {
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);

  const handleMarkerClick = (marker: GlobeMarker) => {
    const match = halftoneSatelliteMarkers.find(
      (m) => m.lat === marker.lat && m.lng === marker.lng
    );
    if (match?.isCalifornia) {
      onCaliforniaClick();
    } else {
      onExploreClick();
    }
  };

  return (
    <section className="w-full pt-6 pb-28 px-6 max-w-[1400px] mx-auto">
      
      {/* Top Nav: Basalt pill nav with dotted dividers, no duplicate Explore button */}
      <header className="flex items-center justify-between gap-4 py-4 mb-16 border-b border-dotted border-[#26262B]">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-[10px] h-[10px] rounded-full bg-[#FC5000]" aria-hidden="true"></div>
          <span className="font-headline text-[26px] tracking-[0.04em] text-[#F2EFE9] leading-none uppercase">
            Emberline
          </span>
        </div>

        {/* Center Nav Pills */}
        <nav className="flex items-center gap-1.5 bg-[#131316] px-4 py-2 rounded-full border border-dotted border-[#26262B] text-[13px] font-sans font-medium text-[#8A8A93]">
          <button
            onClick={onMethodClick}
            className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            The Problem
          </button>
          <span className="text-[#26262B]">·</span>
          <button
            onClick={onExploreClick}
            className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            The Fix
          </button>
          <span className="text-[#26262B]">·</span>
          <button
            onClick={onCaliforniaClick}
            className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            California
          </button>
          <span className="text-[#26262B]">·</span>
          <button
            onClick={onProofClick}
            className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            Proof
          </button>
          <span className="text-[#26262B]">·</span>
          <a
            href="https://github.com/mehrunisha1011/emberline"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-full text-[#8A8A93] hover:text-[#F2EFE9] hover:bg-[#1E1E24] transition-colors cursor-pointer"
          >
            GitHub
          </a>
        </nav>

        {/* Subtle Sample Badge in Nav */}
        <div className="hidden sm:block">
          <SampleBadge />
        </div>

      </header>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Column: Headline (<= 6 words), One-line subtitle, One button */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          {/* Headline: <= 6 words ("20 YEARS OF WILDFIRES. ONE TIMELINE.") */}
          <div className="mb-6">
            <h1 className="font-headline text-[clamp(48px,8.5vw,96px)] leading-[0.92] tracking-[0.015em] text-[#F2EFE9] uppercase">
              20 YEARS OF WILDFIRES.
            </h1>
            <h1 className="font-headline text-[clamp(48px,8.5vw,96px)] leading-[0.92] tracking-[0.015em] text-[#FC5000] uppercase">
              ONE TIMELINE.
            </h1>
          </div>

          {/* Subtitle: Exactly one line */}
          <p className="text-[16px] font-sans font-medium text-[#8A8A93] mb-8">
            Two satellites, one fair fire record.
          </p>

          {/* Exactly one button */}
          <div>
            <button
              onClick={onExploreClick}
              className="bg-[#FC5000] text-white hover:bg-[#e04700] text-[14px] font-sans font-semibold uppercase tracking-[0.04em] py-3.5 px-8 rounded-full transition-colors cursor-pointer"
            >
              Explore the Fix
            </button>
          </div>

        </div>

        {/* Right Column: Globe + Dot Legend only */}
        <div className="lg:col-span-6">
          <div className="bg-[#131316] rounded-[40px] p-6 sm:p-7 relative flex flex-col items-center">
            
            {/* 3D Halftone Globe Canvas */}
            <div className="w-full h-[380px] sm:h-[440px] relative flex items-center justify-center">
              <Globe3D
                markers={halftoneSatelliteMarkers}
                showZoomControls={true}
                config={{
                  radius: 2.15,
                  bumpScale: 0.05,
                  autoRotateSpeed: 0.35,
                  enableZoom: true,
                  minDistance: 3.2,
                  maxDistance: 12.0,
                  enablePan: false,
                  showAtmosphere: false,
                  showWireframe: false,
                  backgroundColor: null,
                }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onMarkerClick={handleMarkerClick}
                onMarkerHover={setHoveredMarker}
              />

              {/* Minimal Hover Detail Pill */}
              {hoveredMarker && (
                <div className="absolute bottom-3 left-3 bg-[#0A0A0C]/90 border border-dotted border-[#26262B] px-3 py-1.5 rounded-full pointer-events-none z-20 backdrop-blur-md flex items-center gap-2">
                  <span className="font-mono-numbers text-[10px] uppercase font-bold text-[#FC5000]">
                    {hoveredMarker.sensorType === 'MODIS' ? 'MODIS 1km' : 'VIIRS 375m'}
                  </span>
                  <span className="text-[#26262B]">·</span>
                  <span className="text-[11px] font-sans font-medium text-[#F2EFE9]">
                    {hoveredMarker.label}
                  </span>
                </div>
              )}
            </div>

            {/* Sensor Pixel Halftone Legend (kept as the only needed globe explanation) */}
            <div className="w-full pt-4 mt-2 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-4 text-[12px] font-mono-numbers text-[#8A8A93] z-10">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FC5000] inline-block"></span>
                  <span className="text-[#F2EFE9] flex items-center gap-1">
                    Big dots:
                    <JargonTooltip term="MODIS">
                      <span className="font-semibold text-white">MODIS (1 km)</span>
                    </JargonTooltip>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB020] inline-block"></span>
                  <span className="text-[#F2EFE9] flex items-center gap-1">
                    Small dots:
                    <JargonTooltip term="VIIRS">
                      <span className="font-semibold text-white">VIIRS (375 m)</span>
                    </JargonTooltip>
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-[#8A8A93]">
                about 7× smaller pixel area
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
