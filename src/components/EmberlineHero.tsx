/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Globe3D, GlobeMarker } from '@/components/ui/3d-globe';
import { JargonTooltip } from './JargonTooltip';
import regionsData from '../data/regions.json';
import type { RegionId } from '../App';

interface EmberlineHeroProps {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  activeRegionName: string;
  onExploreClick: () => void;
  onMethodClick: () => void;
  onCaliforniaClick: () => void;
  onProofClick: () => void;
}

const halftoneSatelliteMarkers: (GlobeMarker & { regionId?: RegionId })[] = [
  {
    lat: 21.75,
    lng: 83.0,
    label: "India (Central/East): MODIS 1km & VIIRS 375m",
    sensorType: 'VIIRS',
    color: '#FC5000',
    isGlowing: true,
    regionId: 'india',
  },

  {
    lat: 39.865,
    lng: -121.235,
    label: "California: VIIRS 375m Detection",
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'california_west_us',
  },
  {
    lat: 37.865,
    lng: -119.538,
    label: "California (Sierra Nevada): Active Glow",
    sensorType: 'VIIRS',
    color: '#FC5000',
    isGlowing: true,
    regionId: 'california_west_us',
  },
  {
    lat: 36.7783,
    lng: -119.4179,
    label: "California (Central Valley): MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'california_west_us',
  },
  {
    lat: 34.2,
    lng: -118.1,
    label: "Southern California: MODIS 1km Detection",
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'california_west_us',
  },
  {
    lat: -5.421,
    lng: -56.882,
    label: "Amazon Basin: MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'amazon',
  },
  {
    lat: -12.21,
    lng: -55.45,
    label: "Amazon: VIIRS 375m Pixel",
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'amazon',
  },
  {
    lat: -33.712,
    lng: 150.311,
    label: "Australia: MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'australia',
  },
  {
    lat: -28.5,
    lng: 152.1,
    label: "Australia: VIIRS 375m Detection",
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'australia',
  },
  {
    lat: 53.5461,
    lng: -113.4938,
    label: "Canada Boreal: VIIRS 375m Detection",
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'canada_boreal',
  },
  {
    lat: 58.2,
    lng: -115.0,
    label: "Canada Boreal: MODIS 1km Grid",
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'canada_boreal',
  },
];

export function EmberlineHero({
  selectedRegion,
  onSelectRegion,
  activeRegionName,
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
    if (match?.regionId) {
      onSelectRegion(match.regionId);
      onCaliforniaClick();
    } else {
      onExploreClick();
    }
  };

  return (
    <section className="w-full pt-6 pb-28 px-6 max-w-[1400px] mx-auto">
      {/* Top Nav */}
      <header className="flex flex-wrap items-center justify-between gap-4 py-4 mb-16 border-b border-dotted border-[#26262B]">
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
            {activeRegionName}
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

        {/* Live Region Switcher Pill */}
        <div className="flex items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B]">
          {regionsData.regions.filter((r: any) => r.isReady).map((r: any) => {
            const active = r.id === selectedRegion;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id as RegionId)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono-numbers uppercase tracking-wider transition-all cursor-pointer ${
                  active
                    ? 'bg-[#FC5000] text-white font-bold'
                    : 'text-[#8A8A93] hover:text-[#F2EFE9]'
                }`}
              >
                {r.name}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="font-headline text-[clamp(48px,8.5vw,96px)] leading-[0.92] tracking-[0.015em] text-[#F2EFE9] uppercase">
              20 YEARS OF WILDFIRES.
            </h1>
            <h1 className="font-headline text-[clamp(48px,8.5vw,96px)] leading-[0.92] tracking-[0.015em] text-[#FC5000] uppercase">
              ONE TIMELINE.
            </h1>
          </div>

          <p className="text-[16px] font-sans font-medium text-[#8A8A93] mb-8">
            Two satellites, one fair fire record across 4 global fire basins.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreClick}
              className="bg-[#FC5000] text-white hover:bg-[#e04700] text-[14px] font-sans font-semibold uppercase tracking-[0.04em] py-3.5 px-8 rounded-full transition-colors cursor-pointer"
            >
              Explore the Fix
            </button>
          </div>
        </div>

        {/* Right Column: Globe */}
        <div className="lg:col-span-6">
          <div className="bg-[#131316] rounded-[40px] p-6 sm:p-7 relative flex flex-col items-center">
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
