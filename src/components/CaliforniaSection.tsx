/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import calendarData from '../data/calendar.json';
import firesData from '../data/fires.json';
import { SampleBadge } from './SampleBadge';

interface FireEvent {
  id: string;
  name: string;
  year: number;
  startDate: string;
  peakDate: string;
  endDate: string;
  satellites: string[];
}

export function CaliforniaSection() {
  const [selectedYear, setSelectedYear] = useState<number>(2021); // Default to Dixie Fire year
  const [selectedFireId, setSelectedFireId] = useState<string>('ca-2021-0713');
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    sensor: string;
    dayOfYear: number;
  } | null>(null);

  const fires: FireEvent[] = firesData.fires;
  const selectedFire = fires.find((f) => f.id === selectedFireId) || fires[0];

  const currentYearData =
    calendarData.years.find((y) => y.year === selectedYear) ||
    calendarData.years[calendarData.years.length - 1];

  const handleSelectFire = (fire: FireEvent) => {
    setSelectedFireId(fire.id);
    setSelectedYear(fire.year);
  };

  // Color ramp based on fire count: #B31B00 -> #FC5000 -> #FFB020 -> #FFF3C4
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

  return (
    <section id="california" className="w-full py-28 px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]">
      
      {/* Header with 6-word headline & SAMPLE DATA badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h2 className="font-headline text-[clamp(40px,6vw,72px)] leading-[0.94] text-[#F2EFE9] uppercase">
          CALIFORNIA DAILY FIRE ARCHIVE.
        </h2>
        {(calendarData.sample || firesData.sample) && <SampleBadge />}
      </div>

      {/* One-line statement */}
      <p className="text-[16px] font-sans font-medium text-[#8A8A93] mb-10">
        25 years of daily satellite fire detections, 2000 to now.
      </p>

      {/* Main Grid: Calendar Heatmap + Fire List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Calendar Heatmap */}
        <div className="lg:col-span-8 bg-[#131316] p-6 sm:p-8 rounded-[40px]">
          
          {/* Year Header & Quick Year Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-dotted border-[#26262B]">
            <div className="flex items-center gap-3">
              <span className="font-mono-numbers text-[28px] font-bold text-[#F2EFE9]">
                {selectedYear}
              </span>
              <span className="text-[11px] font-mono-numbers text-[#3FD0C9] px-2.5 py-0.5 rounded-full bg-[#3FD0C9]/10 border border-[#3FD0C9]/20 uppercase">
                {currentYearData.sensor}
              </span>
            </div>

            {/* Quick Year Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0A0A0C] p-1.5 rounded-full border border-dotted border-[#26262B] text-[12px] font-mono-numbers">
              {[2003, 2009, 2013, 2017, 2018, 2020, 2021, 2024].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
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
          <div className="mb-6 flex items-center gap-4">
            <span className="text-[11px] font-mono-numbers text-[#8A8A93]">2000</span>
            <input
              type="range"
              min={calendarData.startYear}
              max={calendarData.endYear}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="flex-1 accent-[#FC5000] cursor-pointer"
            />
            <span className="text-[11px] font-mono-numbers text-[#8A8A93]">2024</span>
          </div>

          {/* Daily Calendar Heatmap Matrix */}
          <div className="w-full mb-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] sm:grid-cols-26 md:grid-cols-31 gap-1.5 p-3 bg-[#0A0A0C] rounded-[20px]">
              {currentYearData.days.map((day) => {
                const isSelectedFireActive = isFireDay(day.date);
                return (
                  <div
                    key={day.dayOfYear}
                    onMouseEnter={() => setHoveredDay(day)}
                    className="aspect-square rounded-[3px] transition-transform hover:scale-125 cursor-pointer"
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

          {/* Color ramp and active hovered readout */}
          <div className="pt-4 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono-numbers text-[#8A8A93]">
            <div className="flex items-center gap-1.5">
              <span>Low</span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1A1A1E] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#8A2410] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#B31B00] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FC5000] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FFF3C4] inline-block"></span>
              <span>High</span>
            </div>

            <div className="text-[#F2EFE9]">
              {hoveredDay ? (
                <span>
                  {hoveredDay.date}: <strong className="text-[#FC5000]">{hoveredDay.count.toLocaleString()}</strong> detections
                </span>
              ) : (
                <span>Annual total: {currentYearData.annualCount.toLocaleString()} detections</span>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Fire List & Fire Detail Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Notable fires list (matched by date) */}
          <div className="bg-[#131316] p-6 rounded-[32px]">
            <div className="pb-3 mb-3 border-b border-dotted border-[#26262B] text-[11px] font-mono-numbers uppercase text-[#8A8A93]">
              Notable fires (matched by date)
            </div>

            <div className="space-y-1.5">
              {fires.map((fire) => {
                const isSelected = fire.id === selectedFireId;
                return (
                  <button
                    key={fire.id}
                    onClick={() => handleSelectFire(fire)}
                    className={`w-full text-left p-3 rounded-[14px] transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0A0A0C] border border-[#FC5000]'
                        : 'bg-[#18181D] hover:bg-[#1E1E24]'
                    }`}
                  >
                    <div>
                      <div className="font-sans font-medium text-[14px] text-[#F2EFE9]">
                        {fire.name}
                      </div>
                      <div className="text-[10px] font-mono-numbers text-[#8A8A93]">
                        {fire.id}
                      </div>
                    </div>
                    <span className="font-mono-numbers text-[12px] font-bold text-[#FC5000]">
                      {fire.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Fire Detail: Start, Peak, End, Satellites and nothing else */}
          {selectedFire && (
            <div className="bg-[#131316] p-6 rounded-[32px]">
              
              <div className="pb-3 mb-4 border-b border-dotted border-[#26262B] flex items-center justify-between">
                <div>
                  <h3 className="font-headline text-[24px] text-[#F2EFE9] uppercase leading-none">
                    {selectedFire.name}
                  </h3>
                  <span className="text-[10px] font-mono-numbers text-[#8A8A93]">
                    {selectedFire.id}
                  </span>
                </div>
                <span className="font-mono-numbers text-[12px] font-bold text-[#FC5000]">
                  {selectedFire.year}
                </span>
              </div>

              {/* Start, Peak, End */}
              <div className="space-y-2 mb-4 font-mono-numbers text-[12px]">
                <div className="flex items-center justify-between p-2.5 bg-[#0A0A0C] rounded-[10px]">
                  <span className="text-[#8A8A93] uppercase">Start</span>
                  <span className="text-[#F2EFE9]">{selectedFire.startDate}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#0A0A0C] rounded-[10px]">
                  <span className="text-[#8A8A93] uppercase">Peak</span>
                  <span className="text-[#FC5000] font-bold">{selectedFire.peakDate}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#0A0A0C] rounded-[10px]">
                  <span className="text-[#8A8A93] uppercase">End</span>
                  <span className="text-[#F2EFE9]">{selectedFire.endDate}</span>
                </div>
              </div>

              {/* Satellites */}
              <div>
                <span className="text-[10px] font-mono-numbers uppercase text-[#8A8A93] block mb-2">
                  Satellites
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFire.satellites.map((sat) => (
                    <span
                      key={sat}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-numbers bg-[#0A0A0C] text-[#3FD0C9]"
                    >
                      {sat}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}
