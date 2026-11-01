/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import calendarData from '../data/calendar.json';
import firesData from '../data/fires.json';
import regionsData from '../data/regions.json';
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
  simpleView?: boolean;
}

function parseFireDisplay(fire: FireEvent) {
  const match = fire.name.match(/^(.*?)\s*\(([^)]+)\)$/);
  const rawTitle = match ? match[1].trim() : fire.name;
  const coords = match ? match[2].trim() : '';
  const isCodeName = /^Fire\s+[A-Z]{2}-\d{4}-\d+/i.test(rawTitle);

  return {
    title: rawTitle,
    coords,
    isCodeName,
  };
}

export function CaliforniaSection({
  selectedRegion,
  onSelectRegion,
  simpleView = false,
}: Props) {
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [selectedFireId, setSelectedFireId] = useState<string>('');
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    sensor: string;
    dayOfYear: number;
  } | null>(null);

  const regionCal =
    (calendarData as any).byRegion?.[selectedRegion] || calendarData;
  const fires: FireEvent[] =
    (firesData as any).byRegion?.[selectedRegion] || firesData.fires;

  useEffect(() => {
    if (fires.length > 0) {
      setSelectedFireId(fires[0].id);
      setSelectedYear(fires[0].year);
      setHoveredDay(null);
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

  const parsedSelected = selectedFire ? parseFireDisplay(selectedFire) : null;

  return (
    <section
      id="california"
      className="w-full py-14 sm:py-24 px-4 sm:px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2
            className={`font-headline leading-[0.94] text-[#F2EFE9] uppercase transition-all ${
              simpleView
                ? 'text-[clamp(28px,4.5vw,48px)]'
                : 'text-[clamp(36px,6vw,68px)]'
            }`}
          >
            {regionCal.region} DAILY FIRE ARCHIVE.
          </h2>
          <PlainWordsLine
            text="Every fire we detected, shown day by day."
            simpleView={simpleView}
          />
        </div>

        {/* Region Switcher */}
        <div className="flex items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B] overflow-x-auto no-scrollbar max-w-full">
          {regionsData.regions
            .filter((r: any) => r.isReady)
            .map((r: any) => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id as RegionId)}
                className={`min-h-[34px] px-3 py-1 rounded-full text-[11px] font-mono-numbers uppercase transition-all cursor-pointer flex-shrink-0 ${
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

      <p className="text-[14px] sm:text-[15px] font-sans text-[#8A8A93] mb-6">
        {regionCal.endYear - regionCal.startYear + 1} years of daily satellite fire{' '}
        <JargonTooltip term="Detection">
          <span className="text-[#F2EFE9]">detections</span>
        </JargonTooltip>{' '}
        ({regionCal.startYear}–{regionCal.endYear}). Each square below is one day of the year.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Daily Heatmap Calendar */}
        <div className="lg:col-span-7 bg-[#131316] p-4 sm:p-7 rounded-[24px] sm:rounded-[32px] border border-dotted border-[#26262B]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-dotted border-[#26262B]">
            <div className="flex items-center gap-2.5">
              <span className="font-mono-numbers text-[24px] sm:text-[28px] font-bold text-[#F2EFE9] leading-none">
                {selectedYear}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono-numbers text-[#3FD0C9] px-2.5 py-0.5 rounded-full bg-[#3FD0C9]/10 border border-[#3FD0C9]/20 uppercase">
                {currentYearData.sensor}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#0A0A0C] p-1 rounded-full border border-[#26262B] text-[11px] font-mono-numbers overflow-x-auto no-scrollbar max-w-full">
              {[2003, 2007, 2012, 2015, 2018, 2020, 2021, 2024].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`min-h-[28px] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
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

          {/* Year Range Slider */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-[11px] font-mono-numbers text-[#8A8A93]">
              {regionCal.startYear}
            </span>
            <input
              type="range"
              min={regionCal.startYear}
              max={regionCal.endYear}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Select archive year"
              className="flex-1 accent-[#FC5000] cursor-pointer h-1.5 bg-[#26262B] rounded-lg"
            />
            <span className="text-[11px] font-mono-numbers text-[#8A8A93]">
              {regionCal.endYear}
            </span>
          </div>

          {/* 365-Day Grid */}
          <div className="w-full mb-5">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(11px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(13px,1fr))] gap-1 sm:gap-1.5 p-3 bg-[#0A0A0C] rounded-[18px] border border-[#26262B]/60">
              {currentYearData.days.map((day: any) => {
                const isSelectedFireActive = isFireDay(day.date);
                return (
                  <div
                    key={day.dayOfYear}
                    onMouseEnter={() => setHoveredDay(day)}
                    onClick={() => setHoveredDay(day)}
                    className="aspect-square rounded-[2px] transition-transform hover:scale-125 cursor-pointer"
                    style={{
                      backgroundColor: getCellColor(day.count),
                      outline: isSelectedFireActive ? '1.5px solid #FC5000' : 'none',
                    }}
                    title={`${day.date}: ${day.count.toLocaleString()} detections`}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend & Daily Readout */}
          <div className="pt-3.5 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-numbers text-[#8A8A93]">
            <div className="flex items-center gap-1.5">
              <span>Quiet</span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1A1A1E] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#8A2410] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#B31B00] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FC5000] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FFF3C4] inline-block" />
              <span>Intense</span>
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
                  {selectedYear} total:{' '}
                  <strong className="text-[#F2EFE9]">
                    {currentYearData.annualCount.toLocaleString()}
                  </strong>{' '}
                  detections
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Compact Bento Fire Inspector + Fire Selector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Selected Fire Bento Card */}
          {selectedFire && parsedSelected && (
            <div className="bg-[#131316] p-4 sm:p-5 rounded-[24px] border border-[#26262B]">
              <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-dotted border-[#26262B]">
                <div>
                  <span className="text-[10px] font-mono-numbers uppercase text-[#FC5000] tracking-wider block mb-0.5">
                    Selected Fire Event · {selectedFire.year}
                  </span>
                  <h3 className="font-headline text-[22px] sm:text-[26px] text-[#F2EFE9] uppercase leading-tight">
                    {parsedSelected.title}
                  </h3>
                  {parsedSelected.isCodeName && (
                    <p className="text-[11px] font-sans text-[#9A8F85] mt-0.5">
                      Code = Region + Year + Fire number tracked by satellite
                    </p>
                  )}
                </div>
                <span className="font-mono-numbers text-[11px] px-2.5 py-1 rounded-full bg-[#0A0A0C] border border-[#26262B] text-[#8A8A93] uppercase flex-shrink-0">
                  ID: {selectedFire.id.toUpperCase()}
                </span>
              </div>

              {/* Compact 2x2 Bento Grid for Fire Details */}
              <div className="grid grid-cols-2 gap-2.5 mb-3 font-mono-numbers text-[12px]">
                <div className="p-2.5 bg-[#0A0A0C] rounded-[12px] border border-[#26262B]/60">
                  <span className="text-[10px] text-[#8A8A93] uppercase block mb-0.5">
                    First Spotted
                  </span>
                  <span className="text-[#F2EFE9] font-medium">
                    {selectedFire.startDate}
                  </span>
                </div>

                <div className="p-2.5 bg-[#0A0A0C] rounded-[12px] border border-[#26262B]/60">
                  <span className="text-[10px] text-[#FC5000] uppercase block mb-0.5">
                    Peak Heat Day
                  </span>
                  <span className="text-[#FC5000] font-bold">
                    {selectedFire.peakDate}
                  </span>
                </div>

                <div className="p-2.5 bg-[#0A0A0C] rounded-[12px] border border-[#26262B]/60">
                  <span className="text-[10px] text-[#8A8A93] uppercase block mb-0.5">
                    Last Spotted
                  </span>
                  <span className="text-[#F2EFE9] font-medium">
                    {selectedFire.endDate}
                  </span>
                </div>

                <div className="p-2.5 bg-[#0A0A0C] rounded-[12px] border border-[#26262B]/60">
                  <span className="text-[10px] text-[#8A8A93] uppercase block mb-0.5">
                    GPS Location
                  </span>
                  <span className="text-[#F2EFE9] font-medium">
                    {parsedSelected.coords || 'Satellite grid'}
                  </span>
                </div>
              </div>

              {/* Duration + Satellites Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dotted border-[#26262B] text-[11px]">
                {selectedFire.durationDays !== undefined && (
                  <span className="font-sans text-[#9A8F85]">
                    Burned for{' '}
                    <strong className="text-[#F2EFE9] font-mono-numbers">
                      {selectedFire.durationDays} days
                    </strong>
                  </span>
                )}
                <div className="flex flex-wrap gap-1">
                  {selectedFire.satellites.map((sat) => (
                    <span
                      key={sat}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono-numbers bg-[#0A0A0C] text-[#3FD0C9] border border-[#26262B]"
                    >
                      {sat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scrollable List of Top Fires */}
          <div className="bg-[#131316] p-4 sm:p-5 rounded-[24px] border border-dotted border-[#26262B]">
            <div className="pb-2.5 mb-2.5 border-b border-dotted border-[#26262B] flex items-center justify-between text-[11px] font-mono-numbers uppercase text-[#8A8A93]">
              <span>Largest Tracked Fires ({fires.length})</span>
              <span className="text-[10px] text-[#9A8F85] normal-case font-sans">
                Tap to highlight on calendar
              </span>
            </div>

            <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
              {fires.map((fire) => {
                const isSelected = fire.id === selectedFire?.id;
                const parsed = parseFireDisplay(fire);
                return (
                  <button
                    key={fire.id}
                    onClick={() => handleSelectFire(fire)}
                    className={`w-full text-left px-3 py-2.5 rounded-[12px] transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#0A0A0C] border border-[#FC5000]'
                        : 'bg-[#18181D] hover:bg-[#1E1E24] border border-transparent'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-sans font-medium text-[13px] text-[#F2EFE9] truncate">
                        {parsed.title}
                      </div>
                      <div className="text-[11px] font-mono-numbers text-[#8A8A93] truncate">
                        {parsed.coords}
                        {fire.durationDays ? ` · ${fire.durationDays}d` : ''}
                      </div>
                    </div>
                    <span className="font-mono-numbers text-[12px] font-bold text-[#FC5000] flex-shrink-0">
                      {fire.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
