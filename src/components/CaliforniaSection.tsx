/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import regionsData from '../data/regions.json';
import { getRegionCalendar, getRegionFires } from '../utils/regionData';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import type { RegionId } from '../App';

interface FireEvent {
  id: string;
  name: string;
  year: number;
  startDate: string;
  peakDate: string;
  endDate: string;
  durationDays?: number;
  totalFrpMw?: number;
  cellDays?: number;
  lat?: number;
  lon?: number;
  satellites: string[];
}

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  simpleView: boolean;
}

export function CaliforniaSection({ selectedRegion, onSelectRegion, simpleView }: Props) {
  const regionCal = getRegionCalendar(selectedRegion);
  const fires: FireEvent[] = getRegionFires(selectedRegion);

  // Default to ca-2020-0094 in California so the user immediately sees its full Bento breakdown, or first fire in region
  const defaultFire =
    fires.find((f) => f.id === 'ca-2020-0094') || fires[0];

  const [selectedYear, setSelectedYear] = useState<number>(
    defaultFire ? defaultFire.year : regionCal.endYear
  );
  const [selectedFireId, setSelectedFireId] = useState<string>(
    defaultFire ? defaultFire.id : ''
  );
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    sensor: string;
    dayOfYear: number;
  } | null>(null);

  useEffect(() => {
    if (fires.length > 0) {
      const preferred = fires.find((f) => f.id === 'ca-2020-0094') || fires[0];
      setSelectedFireId(preferred.id);
      setSelectedYear(preferred.year);
    }
  }, [selectedRegion]);

  const selectedFire = fires.find((f) => f.id === selectedFireId) || fires[0];

  const currentYearData =
    regionCal.years.find((y: any) => y.year === selectedYear) ||
    regionCal.years[regionCal.years.length - 1];

  const handleSelectFire = (fire: FireEvent) => {
    setSelectedFireId(fire.id);
    setSelectedYear(fire.year);
  };

  const getCellColor = (count: number) => {
    if (count === 0) return '#1A1A1E';
    if (count < 20) return '#4A1508';
    if (count < 80) return '#8A2410';
    if (count < 250) return '#B31B00';
    if (count < 600) return '#FC5000';
    if (count < 1200) return '#FFB020';
    return '#FFF3C4';
  };

  const isFireDay = (dateStr: string) => {
    if (!selectedFire) return false;
    const current = new Date(dateStr).getTime();
    const start = new Date(selectedFire.startDate).getTime();
    const end = new Date(selectedFire.endDate).getTime();
    return current >= start && current <= end;
  };

  // Derive quick-select years directly from the loaded calendar/fires JSON
  const quickYears: number[] = Array.from(
    new Set(
      fires
        .slice(0, 12)
        .map((f) => f.year)
        .filter((yr) => yr >= regionCal.startYear && yr <= regionCal.endYear)
    )
  )
    .sort((a, b) => a - b)
    .slice(0, 7);

  const formatCoordLabel = (fire: FireEvent) => {
    if (fire.lat === undefined || fire.lon === undefined) return '';
    const ns = fire.lat >= 0 ? 'N' : 'S';
    const ew = fire.lon >= 0 ? 'E' : 'W';
    return `${Math.abs(fire.lat).toFixed(2)}°${ns}, ${Math.abs(fire.lon).toFixed(2)}°${ew}`;
  };

  const parseFireCode = (id: string) => {
    const parts = id.toUpperCase().split('-');
    return {
      regionPrefix: parts[0] || 'FIRE',
      yearPart: parts[1] || '',
      eventNumber: parts[2] || '',
    };
  };

  return (
    <section
      id="california"
      className="w-full py-16 sm:py-20 px-4 sm:px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
        <h2
          className={`font-headline leading-[0.94] text-[#F2EFE9] uppercase transition-all duration-200 ${
            simpleView
              ? 'text-[clamp(28px,4.2vw,48px)]'
              : 'text-[clamp(38px,5.8vw,68px)]'
          }`}
        >
          {regionCal.region} DAILY FIRE ARCHIVE.
        </h2>

        {/* Region Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B]">
          {regionsData.regions.filter((r: any) => r.isReady).map((r: any) => (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r.id as RegionId)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono-numbers uppercase transition-all cursor-pointer ${
                r.id === selectedRegion
                  ? 'bg-[#FC5000] text-white font-bold'
                  : 'text-[#8A8A93] hover:text-[#F2EFE9]'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Required Plain-English Line directly under technical headline */}
      <PlainWordsLine
        simpleView={simpleView}
        text="Every fire we detected, shown day by day."
      />

      <p className="text-[14px] sm:text-[15px] font-sans font-medium text-[#8A8A93] mb-6">
        {regionCal.endYear - regionCal.startYear + 1} years of daily satellite fire{' '}
        <JargonTooltip term="Detection">
          <span className="text-[#F2EFE9]">detections</span>
        </JargonTooltip>
        , {regionCal.startYear} to {regionCal.endYear}.
      </p>

      {/* Compact Main Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Daily Calendar Heatmap + Selected Fire Plain-English Bento Breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Calendar Card */}
          <div className="bg-[#131316] p-4 sm:p-6 rounded-[28px] border border-dotted border-[#26262B]">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-dotted border-[#26262B]">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-numbers text-[24px] font-bold text-[#F2EFE9]">
                  {selectedYear}
                </span>
                <span className="text-[11px] font-mono-numbers text-[#3FD0C9] px-2.5 py-0.5 rounded-full bg-[#3FD0C9]/10 border border-[#3FD0C9]/20 uppercase">
                  {currentYearData.sensor}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1 bg-[#0A0A0C] p-1 rounded-full border border-dotted border-[#26262B] text-[11px] font-mono-numbers">
                {quickYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-[#FC5000] text-white font-bold'
                        : 'text-[#8A8A93] hover:text-[#F2EFE9]'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <span className="text-[11px] font-mono-numbers text-[#8A8A93]">
                {regionCal.startYear}
              </span>
              <input
                type="range"
                min={regionCal.startYear}
                max={regionCal.endYear}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="flex-1 accent-[#FC5000] cursor-pointer"
              />
              <span className="text-[11px] font-mono-numbers text-[#8A8A93]">
                {regionCal.endYear}
              </span>
            </div>

            <div className="w-full mb-4">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(11px,1fr))] sm:grid-cols-26 md:grid-cols-31 gap-1 p-3 bg-[#0A0A0C] rounded-[16px] border border-dotted border-[#26262B]">
                {currentYearData.days.map((day: any) => {
                  const isSelectedFireActive = isFireDay(day.date);
                  return (
                    <div
                      key={day.dayOfYear}
                      onMouseEnter={() => setHoveredDay(day)}
                      className="aspect-square rounded-[2px] transition-transform hover:scale-125 cursor-pointer"
                      style={{
                        backgroundColor: getCellColor(day.count),
                        outline: isSelectedFireActive ? '2px solid #FC5000' : 'none',
                      }}
                      title={`${day.date}: ${day.count.toLocaleString()} detections`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-numbers text-[#8A8A93]">
              <div className="flex items-center gap-1.5">
                <span>Low</span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1A1A1E] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#8A2410] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#B31B00] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FC5000] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FFF3C4] inline-block"></span>
                <span>High</span>
                <span className="ml-2 text-[#9A8F85]">
                  (Orange outline = selected fire active days)
                </span>
              </div>

              <div className="text-[#F2EFE9]">
                {hoveredDay ? (
                  <span>
                    {hoveredDay.date}:{' '}
                    <strong className="text-[#FC5000]">
                      {hoveredDay.count.toLocaleString()}
                    </strong>{' '}
                    detections
                  </span>
                ) : (
                  <span>
                    Annual total: {currentYearData.annualCount.toLocaleString()} detections
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Selected Fire Explained in Plain Words — Clean Bento Grid Format */}
          {selectedFire && (() => {
            const codeParts = parseFireCode(selectedFire.id);
            const coordStr = formatCoordLabel(selectedFire);
            return (
              <div className="bg-[#131316] p-4 sm:p-5 rounded-[24px] border border-dotted border-[#26262B]">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-dotted border-[#26262B]">
                  <div>
                    <span className="text-[10px] font-mono-numbers uppercase text-[#FC5000] font-bold block mb-0.5">
                      Selected Fire Record — Plain-English Breakdown
                    </span>
                    <h3 className="font-headline text-[22px] sm:text-[26px] text-[#F2EFE9] uppercase leading-none">
                      FIRE {selectedFire.id.toUpperCase()}{' '}
                      {coordStr ? `(${coordStr})` : ''} — {selectedFire.name.split(' (')[0]}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono-numbers font-bold bg-[#FC5000] text-white">
                    {selectedFire.year}
                  </span>
                </div>

                {/* 4-Cell Compact Bento Grid for the Selected Fire */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {/* Cell 1: What the Fire ID Means */}
                  <div className="bg-[#0A0A0C] p-3 rounded-[14px] border border-dotted border-[#26262B]">
                    <div className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] mb-1">
                      Fire Code Meaning
                    </div>
                    <div className="font-mono-numbers text-[14px] font-bold text-[#F2EFE9] mb-1">
                      {selectedFire.id.toUpperCase()}
                    </div>
                    <p className="text-[11px] font-sans text-[#9A8F85] leading-snug">
                      <strong className="text-[#F2EFE9]">{codeParts.regionPrefix}</strong> = {regionCal.region} basin,{' '}
                      <strong className="text-[#F2EFE9]">{codeParts.yearPart}</strong> = year spotted,{' '}
                      <strong className="text-[#F2EFE9]">#{codeParts.eventNumber}</strong> = tracked event number in that year.
                    </p>
                  </div>

                  {/* Cell 2: What the Coordinates Mean */}
                  <div className="bg-[#0A0A0C] p-3 rounded-[14px] border border-dotted border-[#26262B]">
                    <div className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] mb-1">
                      GPS Location (Lat, Lon)
                    </div>
                    <div className="font-mono-numbers text-[14px] font-bold text-[#3FD0C9] mb-1">
                      {coordStr}
                    </div>
                    <p className="text-[11px] font-sans text-[#9A8F85] leading-snug">
                      Exact center spot on Earth ({selectedFire.lat !== undefined && selectedFire.lat >= 0 ? 'North' : 'South'} of the equator, {selectedFire.lon !== undefined && selectedFire.lon >= 0 ? 'East' : 'West'} of Greenwich) where satellites locked onto the fire.
                    </p>
                  </div>

                  {/* Cell 3: Burn Timeline & Duration */}
                  <div className="bg-[#0A0A0C] p-3 rounded-[14px] border border-dotted border-[#26262B]">
                    <div className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] mb-1">
                      How Long It Burned
                    </div>
                    <div className="font-mono-numbers text-[14px] font-bold text-[#FC5000] mb-1">
                      {selectedFire.durationDays} Days Active
                    </div>
                    <div className="text-[11px] font-sans text-[#9A8F85] space-y-0.5 leading-snug">
                      <div>Start: <span className="text-[#F2EFE9]">{selectedFire.startDate}</span></div>
                      <div>Peak heat: <span className="text-[#FC5000] font-semibold">{selectedFire.peakDate}</span></div>
                      <div>End: <span className="text-[#F2EFE9]">{selectedFire.endDate}</span></div>
                    </div>
                  </div>

                  {/* Cell 4: Heat Energy & Satellites */}
                  <div className="bg-[#0A0A0C] p-3 rounded-[14px] border border-dotted border-[#26262B]">
                    <div className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] mb-1">
                      Heat Energy & Cameras
                    </div>
                    <div className="font-mono-numbers text-[14px] font-bold text-[#F2EFE9] mb-1">
                      {selectedFire.totalFrpMw !== undefined
                        ? `${Math.round(selectedFire.totalFrpMw).toLocaleString()} MW`
                        : ''}
                    </div>
                    <p className="text-[11px] font-sans text-[#9A8F85] leading-snug mb-1.5">
                      Spotted across <strong className="text-[#F2EFE9]">{selectedFire.cellDays?.toLocaleString()}</strong> grid-cell days by:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedFire.satellites.map((sat) => (
                        <span
                          key={sat}
                          className="px-1.5 py-0.5 rounded text-[9.5px] font-mono-numbers bg-[#131316] text-[#3FD0C9] border border-[#26262B]"
                        >
                          {sat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Column: Compact Bento List of All Tracked Fires in Region */}
        <div className="lg:col-span-4 bg-[#131316] p-4 sm:p-5 rounded-[28px] border border-dotted border-[#26262B]">
          <div className="pb-3 mb-3 border-b border-dotted border-[#26262B] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono-numbers uppercase text-[#F2EFE9] font-bold block">
                Tracked Fires in {regionCal.region} ({fires.length})
              </span>
              <span className="text-[11px] font-sans text-[#9A8F85]">
                Click any fire code below to inspect its GPS coordinates and daily heat footprint.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[540px] overflow-y-auto pr-1">
            {fires.map((fire) => {
              const isSelected = fire.id === selectedFire?.id;
              const coordLabel = formatCoordLabel(fire);
              const cleanTitle = fire.name.split(' (')[0];
              return (
                <button
                  key={fire.id}
                  onClick={() => handleSelectFire(fire)}
                  className={`w-full text-left p-2.5 rounded-[14px] transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0A0A0C] border-[#FC5000]'
                      : 'bg-[#0A0A0C]/60 border-dotted border-[#26262B] hover:border-[#8A8A93]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono-numbers text-[11px] font-bold text-[#FC5000] uppercase">
                      FIRE {fire.id.toUpperCase()}
                    </span>
                    <span className="font-mono-numbers text-[11px] text-[#F2EFE9] bg-[#131316] px-2 py-0.5 rounded-full border border-[#26262B]">
                      {fire.year}
                    </span>
                  </div>

                  <div className="font-sans font-semibold text-[13px] text-[#F2EFE9] flex items-center justify-between gap-2">
                    <span className="truncate">{cleanTitle}</span>
                    <span className="font-mono-numbers text-[10px] text-[#3FD0C9] flex-shrink-0">
                      ({coordLabel})
                    </span>
                  </div>

                  <div className="mt-1.5 pt-1.5 border-t border-dotted border-[#26262B] flex items-center justify-between text-[10px] font-mono-numbers text-[#9A8F85]">
                    <span>{fire.durationDays} days active</span>
                    <span>Peak: {fire.peakDate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
