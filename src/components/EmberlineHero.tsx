/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Globe3D, GlobeMarker } from '@/components/ui/3d-globe';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import regionsData from '../data/regions.json';
import trendData from '../data/trend.json';
import type { RegionId } from '../App';

interface EmberlineHeroProps {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  activeRegionName: string;
  simpleView: boolean;
  onToggleSimpleView: () => void;
  onExploreClick: () => void;
  onMethodClick: () => void;
  onCaliforniaClick: () => void;
  onProofClick: () => void;
}

const halftoneSatelliteMarkers: (GlobeMarker & { regionId?: RegionId })[] = [
  {
    lat: 4.15,
    lng: 109.5,
    label: 'Malaysia: MODIS 1km & VIIRS 375m',
    sensorType: 'VIIRS',
    color: '#FC5000',
    isGlowing: true,
    regionId: 'malaysia',
  },
  {
    lat: 21.75,
    lng: 83.0,
    label: 'India: MODIS 1km & VIIRS 375m',
    sensorType: 'VIIRS',
    color: '#FC5000',
    isGlowing: true,
    regionId: 'india',
  },
  {
    lat: 39.865,
    lng: -121.235,
    label: 'California: VIIRS 375m Detection',
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'california_west_us',
  },
  {
    lat: 37.865,
    lng: -119.538,
    label: 'California (Sierra Nevada): Active Glow',
    sensorType: 'VIIRS',
    color: '#FC5000',
    isGlowing: true,
    regionId: 'california_west_us',
  },
  {
    lat: 36.7783,
    lng: -119.4179,
    label: 'California (Central Valley): MODIS 1km Grid',
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'california_west_us',
  },
  {
    lat: -5.421,
    lng: -56.882,
    label: 'Amazon Basin: MODIS 1km Grid',
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'amazon',
  },
  {
    lat: -12.21,
    lng: -55.45,
    label: 'Amazon: VIIRS 375m Pixel',
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'amazon',
  },
  {
    lat: -33.712,
    lng: 150.311,
    label: 'Australia: MODIS 1km Grid',
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'australia',
  },
  {
    lat: -28.5,
    lng: 152.1,
    label: 'Australia: VIIRS 375m Detection',
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'australia',
  },
  {
    lat: 53.5461,
    lng: -113.4938,
    label: 'Canada Boreal: VIIRS 375m Detection',
    sensorType: 'VIIRS',
    color: '#FFB020',
    regionId: 'canada_boreal',
  },
  {
    lat: 58.2,
    lng: -115.0,
    label: 'Canada Boreal: MODIS 1km Grid',
    sensorType: 'MODIS',
    color: '#FC5000',
    regionId: 'canada_boreal',
  },
];

export function EmberlineHero({
  selectedRegion,
  onSelectRegion,
  activeRegionName,
  simpleView,
  onToggleSimpleView,
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
    <section className="w-full pt-4 pb-14 sm:pb-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
      {/* Top Minimal Header */}
      <header className="flex flex-col gap-3 pb-4 mb-10 sm:mb-16 border-b border-dotted border-[#26262B]">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FC5000]" aria-hidden="true" />
            <span className="font-headline text-[24px] sm:text-[26px] tracking-[0.04em] text-[#F2EFE9] leading-none uppercase">
              Emberline
            </span>
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#131316] px-3 py-1.5 rounded-full border border-dotted border-[#26262B] text-[13px] font-sans font-medium text-[#8A8A93]">
            <button
              onClick={onMethodClick}
              className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] transition-colors cursor-pointer"
            >
              The Problem
            </button>
            <button
              onClick={onExploreClick}
              className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] transition-colors cursor-pointer"
            >
              The Fix
            </button>
            <button
              onClick={onCaliforniaClick}
              className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] transition-colors cursor-pointer"
            >
              {activeRegionName}
            </button>
            <button
              onClick={onProofClick}
              className="px-3 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] transition-colors cursor-pointer"
            >
              Proof
            </button>
          </nav>

          {/* Simple View Toggle */}
          <button
            type="button"
            onClick={onToggleSimpleView}
            aria-pressed={simpleView}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-[12px] font-mono-numbers uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 ${
              simpleView
                ? 'bg-[#FC5000] text-white border-[#FC5000] font-bold'
                : 'bg-[#131316] text-[#9A8F85] border-[#26262B] hover:text-[#F2EFE9]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                simpleView ? 'bg-white' : 'bg-[#9A8F85]'
              }`}
            />
            <span>Simple view {simpleView ? 'On' : 'Off'}</span>
          </button>
        </div>

        {/* Region Bar + Mobile Quick Nav */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-0.5">
            <span className="text-[11px] font-mono-numbers uppercase text-[#8A8A93] mr-1 flex-shrink-0">
              Region:
            </span>
            {regionsData.regions.map((r: any) => {
              const active = r.id === selectedRegion;
              const isReady = r.isReady;
              return (
                <button
                  key={r.id}
                  onClick={() => isReady && onSelectRegion(r.id as RegionId)}
                  disabled={!isReady}
                  title={!isReady ? 'Coming soon.' : r.fullName}
                  className={`min-h-[34px] px-3 py-1 rounded-full text-[11px] font-mono-numbers uppercase tracking-wider transition-all flex-shrink-0 ${
                    active
                      ? 'bg-[#FC5000] text-white font-bold cursor-pointer'
                      : isReady
                      ? 'bg-[#131316] text-[#8A8A93] hover:text-[#F2EFE9] border border-[#26262B]/70 cursor-pointer'
                      : 'bg-[#131316]/40 text-[#8A8A93]/40 cursor-not-allowed'
                  }`}
                >
                  {r.name}
                  {!isReady && <span className="ml-1 text-[9px]">(Coming soon.)</span>}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="mb-4">
            <h1
              className={`font-headline leading-[0.92] tracking-[0.015em] text-[#F2EFE9] uppercase transition-all ${
                simpleView
                  ? 'text-[clamp(34px,6vw,64px)]'
                  : 'text-[clamp(44px,8vw,92px)]'
              }`}
            >
              20 YEARS OF WILDFIRES.
            </h1>
            <h1
              className={`font-headline leading-[0.92] tracking-[0.015em] text-[#FC5000] uppercase transition-all ${
                simpleView
                  ? 'text-[clamp(34px,6vw,64px)]'
                  : 'text-[clamp(44px,8vw,92px)]'
              }`}
            >
              ONE TIMELINE.
            </h1>

            <PlainWordsLine
              text="Satellites made it look like fires jumped in 2012. They didn’t. The camera got better."
              simpleView={simpleView}
              className="mt-3"
            />
          </div>

          <p className="text-[14px] sm:text-[16px] font-sans text-[#8A8A93] mb-7 leading-relaxed max-w-xl">
            Merging NASA’s{' '}
            <JargonTooltip term="MODIS">
              <span className="text-[#F2EFE9]">MODIS</span>
            </JargonTooltip>{' '}
            and{' '}
            <JargonTooltip term="VIIRS">
              <span className="text-[#F2EFE9]">VIIRS</span>
            </JargonTooltip>{' '}
            <JargonTooltip term="Detection">
              <span className="text-[#F2EFE9]">detections</span>
            </JargonTooltip>{' '}
            into one continuous record across {regionsData.regions.filter((r: any) => r.isReady).length} global fire regions.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreClick}
              className="min-h-[44px] bg-[#FC5000] text-white hover:bg-[#e04700] text-[13px] sm:text-[14px] font-sans font-semibold uppercase tracking-[0.04em] py-3 px-7 rounded-full transition-colors cursor-pointer"
            >
              Explore the Fix
            </button>
            <button
              onClick={onMethodClick}
              className="min-h-[44px] bg-[#131316] text-[#F2EFE9] hover:bg-[#1E1E24] border border-[#26262B] text-[13px] sm:text-[14px] font-sans font-medium py-3 px-6 rounded-full transition-colors cursor-pointer"
            >
              See the 2012 Jump
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Globe */}
        <div className="lg:col-span-6">
          <div className="bg-[#131316] rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 border border-dotted border-[#26262B] relative flex flex-col items-center">
            <div className="w-full h-[280px] sm:h-[380px] relative flex items-center justify-center">
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
                <div className="absolute bottom-2 left-2 right-2 sm:right-auto bg-[#0A0A0C]/95 border border-[#26262B] px-3 py-1.5 rounded-full pointer-events-none z-20 flex items-center gap-2 truncate">
                  <span className="font-mono-numbers text-[10px] uppercase font-bold text-[#FC5000] flex-shrink-0">
                    {hoveredMarker.sensorType === 'MODIS' ? 'MODIS 1km' : 'VIIRS 375m'}
                  </span>
                  <span className="text-[11px] font-sans font-medium text-[#F2EFE9] truncate">
                    {hoveredMarker.label}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full pt-3.5 mt-2 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-[12px] font-mono-numbers text-[#8A8A93] z-10">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FC5000] inline-block" />
                  <span className="text-[#F2EFE9] flex items-center gap-1">
                    Older:
                    <JargonTooltip term="MODIS">
                      <span className="font-semibold text-white">MODIS (1 km)</span>
                    </JargonTooltip>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFB020] inline-block" />
                  <span className="text-[#F2EFE9] flex items-center gap-1">
                    Newer:
                    <JargonTooltip term="VIIRS">
                      <span className="font-semibold text-white">VIIRS (375 m)</span>
                    </JargonTooltip>
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-[#9A8F85]">
                {trendData.sensorPixelAreaRatio}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
