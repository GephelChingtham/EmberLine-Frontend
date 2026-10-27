/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Globe3D, GlobeMarker } from '@/components/ui/3d-globe';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import regionsData from '../data/regions.json';
import trendData from '../data/trend.json';
import firesData from '../data/fires.json';
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

  const readyRegions = useMemo(
    () => regionsData.regions.filter((r: any) => r.isReady),
    []
  );
  const pendingRegions = useMemo(
    () => regionsData.regions.filter((r: any) => r.status === 'pending' || !r.isReady),
    []
  );

  // Derive globe markers directly from loaded JSON data (regions.json & fires.json)
  const halftoneSatelliteMarkers: (GlobeMarker & { regionId?: RegionId })[] = useMemo(() => {
    const markers: (GlobeMarker & { regionId?: RegionId })[] = [];
    const byRegion = (firesData as any).byRegion || {};

    readyRegions.forEach((reg: any) => {
      const regionFires = byRegion[reg.id] || [];
      if (regionFires.length > 0) {
        const firstFire = regionFires[0];
        const secondFire = regionFires[Math.min(1, regionFires.length - 1)];
        markers.push({
          lat: firstFire.lat,
          lng: firstFire.lon,
          label: `${reg.name}: ${firstFire.name}`,
          sensorType: 'VIIRS',
          color: '#FC5000',
          isGlowing: true,
          regionId: reg.id as RegionId,
        });
        if (secondFire && secondFire.id !== firstFire.id) {
          markers.push({
            lat: secondFire.lat,
            lng: secondFire.lon,
            label: `${reg.name}: ${secondFire.name}`,
            sensorType: 'MODIS',
            color: '#FFB020',
            regionId: reg.id as RegionId,
          });
        }
      } else if (Array.isArray(reg.center)) {
        markers.push({
          lat: reg.center[1],
          lng: reg.center[0],
          label: `${reg.fullName || reg.name}`,
          sensorType: 'VIIRS',
          color: '#FC5000',
          isGlowing: true,
          regionId: reg.id as RegionId,
        });
      }
    });

    return markers;
  }, [readyRegions]);

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

  const totalYears = trendData.timeline.length;

  return (
    <section className="w-full pt-4 sm:pt-6 pb-16 sm:pb-20 px-4 sm:px-6 max-w-[1400px] mx-auto">
      {/* Top Nav */}
      <header className="flex flex-wrap items-center justify-between gap-3 py-3.5 mb-10 sm:mb-14 border-b border-dotted border-[#26262B]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="font-headline text-[24px] sm:text-[26px] tracking-[0.04em] text-[#F2EFE9] leading-none uppercase">
            Emberline
          </span>
        </div>

        {/* Center Nav Pills */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-[#131316] px-3 py-1.5 rounded-full border border-dotted border-[#26262B] text-[12px] sm:text-[13px] font-sans font-medium text-[#8A8A93]">
          <button
            onClick={onMethodClick}
            className="px-2.5 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            The Problem
          </button>
          <button
            onClick={onExploreClick}
            className="px-2.5 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            The Fix
          </button>
          <button
            onClick={onCaliforniaClick}
            className="px-2.5 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            {activeRegionName}
          </button>
          <button
            onClick={onProofClick}
            className="px-2.5 py-1 rounded-full text-[#F2EFE9] hover:bg-[#1E1E24] hover:text-white transition-colors cursor-pointer"
          >
            Proof
          </button>
        </nav>

        {/* Right Controls: Simple View Toggle + Live Region Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Small "Simple view" toggle in header (Off by default) */}
          <button
            type="button"
            onClick={onToggleSimpleView}
            aria-pressed={simpleView}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono-numbers uppercase tracking-wider border transition-all cursor-pointer ${
              simpleView
                ? 'bg-[#FC5000] text-white border-[#FC5000] font-bold'
                : 'bg-[#131316] text-[#9A8F85] border-dotted border-[#26262B] hover:text-[#F2EFE9]'
            }`}
          >
            <span>Simple view: {simpleView ? 'On' : 'Off'}</span>
          </button>

          {/* Live Region Switcher Pill */}
          <div className="flex flex-wrap items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B]">
            {readyRegions.map((r: any) => {
              const active = r.id === selectedRegion;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRegion(r.id as RegionId)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono-numbers uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FC5000] text-white font-bold'
                      : 'text-[#8A8A93] hover:text-[#F2EFE9]'
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
            {pendingRegions.map((r: any) => (
              <span
                key={r.id}
                title={`${r.fullName || r.name}: In plain words: Coming soon.`}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono-numbers uppercase tracking-wider text-[#9A8F85]/60 border border-dotted border-[#26262B] cursor-not-allowed flex items-center gap-1"
              >
                <span>{r.name}</span>
                <span className="text-[9px] text-[#9A8F85] normal-case font-sans">
                  (Coming soon.)
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="mb-2">
            <h1
              className={`font-headline leading-[0.92] tracking-[0.015em] text-[#F2EFE9] uppercase transition-all duration-200 ${
                simpleView
                  ? 'text-[clamp(34px,5.2vw,60px)]'
                  : 'text-[clamp(44px,7.8vw,92px)]'
              }`}
            >
              {totalYears} YEARS OF WILDFIRES.
            </h1>
            <h1
              className={`font-headline leading-[0.92] tracking-[0.015em] text-[#FC5000] uppercase transition-all duration-200 ${
                simpleView
                  ? 'text-[clamp(34px,5.2vw,60px)]'
                  : 'text-[clamp(44px,7.8vw,92px)]'
              }`}
            >
              ONE TIMELINE.
            </h1>
          </div>

          {/* Required Plain-English Line directly under technical headline */}
          <PlainWordsLine
            simpleView={simpleView}
            text="Satellites made it look like fires jumped in 2012. They didn’t. The camera got better."
          />

          <div className="text-[15px] font-sans font-medium text-[#8A8A93] mb-6 leading-relaxed flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>Cross-sensor</span>
            <JargonTooltip term="Harmonization">
              <span className="text-[#F2EFE9]">harmonization</span>
            </JargonTooltip>
            <span>merging</span>
            <JargonTooltip term="MODIS">
              <span className="text-[#F2EFE9]">MODIS</span>
            </JargonTooltip>
            <span>and</span>
            <JargonTooltip term="VIIRS">
              <span className="text-[#F2EFE9]">VIIRS</span>
            </JargonTooltip>
            <span>fire</span>
            <JargonTooltip term="Detection">
              <span className="text-[#F2EFE9]">detection</span>
            </JargonTooltip>
            <span>records across {readyRegions.length} active global fire basins, removing the</span>
            <JargonTooltip term="2012 artifact jump">
              <span className="text-[#F2EFE9]">{trendData.jumpYear} artifact jump</span>
            </JargonTooltip>
            <span>Between</span>
            <JargonTooltip term="Raw">
              <span className="text-[#F2EFE9]">Raw</span>
            </JargonTooltip>
            <span>and</span>
            <JargonTooltip term="Fixed">
              <span className="text-[#F2EFE9]">Fixed</span>
            </JargonTooltip>
            <span>counts.</span>
          </div>

          {/* Pending region status line */}
          <div className="mb-6 p-3 rounded-[16px] bg-[#131316] border border-dotted border-[#26262B] inline-flex flex-wrap items-center gap-2 text-[12px]">
            <span className="font-mono-numbers uppercase text-[#8A8A93] text-[10px]">
              Regions with status pending:
            </span>
            <span className="font-sans text-[#9A8F85]">
              <strong className="text-[#9A8F85] font-mono-numbers text-[10px] uppercase mr-1">
                In plain words:
              </strong>
              Coming soon.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreClick}
              className="bg-[#FC5000] text-white hover:bg-[#e04700] text-[13px] sm:text-[14px] font-sans font-semibold uppercase tracking-[0.04em] py-3 px-7 rounded-full transition-colors cursor-pointer"
            >
              Explore the Fix
            </button>
          </div>
        </div>

        {/* Right Column: Globe */}
        <div className="lg:col-span-6">
          <div className="bg-[#131316] rounded-[32px] p-4 sm:p-6 relative flex flex-col items-center border border-dotted border-[#26262B]">
            <div className="w-full h-[300px] sm:h-[380px] relative flex items-center justify-center">
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
                    {hoveredMarker.sensorType}
                  </span>
                  <span className="text-[11px] font-sans font-medium text-[#F2EFE9]">
                    {hoveredMarker.label}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full pt-3 mt-2 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-[12px] font-mono-numbers text-[#8A8A93] z-10">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FC5000] inline-block"></span>
                  <span className="text-[#F2EFE9] flex items-center gap-1">
                    Big dots:
                    <JargonTooltip term="MODIS">
                      <span className="font-semibold text-white">MODIS</span>
                    </JargonTooltip>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB020] inline-block"></span>
                  <span className="text-[#F2EFE9] flex items-center gap-1">
                    Small dots:
                    <JargonTooltip term="VIIRS">
                      <span className="font-semibold text-white">VIIRS</span>
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
