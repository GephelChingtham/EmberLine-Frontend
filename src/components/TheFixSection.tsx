/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import trendData from '../data/trend.json';
import regionsData from '../data/regions.json';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import type { RegionId } from '../App';

type Mode = 'both' | 'raw' | 'fixed';

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  simpleView?: boolean;
}

export function TheFixSection({
  selectedRegion,
  onSelectRegion,
  simpleView = false,
}: Props) {
  const [mode, setMode] = useState<Mode>('both');
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number>(12);

  const width = 1000;
  const height = 340;
  const padding = { top: 30, right: 28, bottom: 45, left: 72 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const regionBlock =
    (trendData as any).byRegion?.[selectedRegion] || {
      regionName: 'California',
      timeline: trendData.timeline,
    };
  const timeline: { year: number; raw: number; fixed: number; sensor: string }[] =
    regionBlock.timeline;

  const peakVal = Math.max(...timeline.map((d) => Math.max(d.raw, d.fixed)), 1000);
  const axisMax = Math.ceil((peakVal * 1.1) / 1000) * 1000;

  const points = timeline.map((d, i) => {
    const x = padding.left + (i / (timeline.length - 1)) * innerW;
    const clampedRaw = Math.min(d.raw, axisMax);
    const clampedFixed = Math.min(d.fixed, axisMax);
    const yRaw = padding.top + innerH - (clampedRaw / axisMax) * innerH;
    const yFixed = padding.top + innerH - (clampedFixed / axisMax) * innerH;
    return { ...d, x, yRaw, yFixed };
  });

  const rawPath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.yRaw}` : `${acc} L ${p.x} ${p.yRaw}`;
  }, '');

  const fixedPath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.yFixed}` : `${acc} L ${p.x} ${p.yFixed}`;
  }, '');

  const deltaAreaPath =
    points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.yRaw}` : `${acc} L ${p.x} ${p.yRaw}`;
    }, '') +
    points
      .slice()
      .reverse()
      .reduce((acc, p) => {
        return `${acc} L ${p.x} ${p.yFixed}`;
      }, '') +
    ' Z';

  const hoveredItem = points[hoveredYearIndex] || points[12] || points[0];
  const delta = Math.round((hoveredItem.raw - hoveredItem.fixed) * 100) / 100;

  return (
    <section
      id="the-fix"
      className="w-full py-14 sm:py-24 px-4 sm:px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6">
        <div>
          <h2
            className={`font-headline leading-[0.94] text-[#F2EFE9] uppercase transition-all ${
              simpleView
                ? 'text-[clamp(28px,4.5vw,48px)]'
                : 'text-[clamp(36px,6vw,68px)]'
            }`}
          >
            ONE FAIR FIRE RECORD.
          </h2>
          <PlainWordsLine
            text="Raw is the original count. Fixed adjusts it so both satellites are judged fairly."
            simpleView={simpleView}
          />
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B] self-start md:self-auto">
          <button
            onClick={() => setMode('raw')}
            className={`min-h-[36px] px-3.5 sm:px-4 py-1.5 rounded-full text-[12px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'raw'
                ? 'bg-[#6E6E78] text-white'
                : 'text-[#8A8A93] hover:text-[#F2EFE9]'
            }`}
          >
            Raw
          </button>

          <button
            onClick={() => setMode('fixed')}
            className={`min-h-[36px] px-3.5 sm:px-4 py-1.5 rounded-full text-[12px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'fixed'
                ? 'bg-[#FC5000] text-white'
                : 'text-[#8A8A93] hover:text-[#F2EFE9]'
            }`}
          >
            Fixed
          </button>

          <button
            onClick={() => setMode('both')}
            className={`min-h-[36px] px-3.5 sm:px-4 py-1.5 rounded-full text-[12px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'both'
                ? 'bg-[#FC5000] text-white'
                : 'text-[#8A8A93] hover:text-[#F2EFE9]'
            }`}
          >
            Compare Both
          </button>
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="bg-[#131316] p-4 sm:p-7 rounded-[24px] sm:rounded-[36px] border border-dotted border-[#26262B] relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-dotted border-[#26262B] text-[12px] font-mono-numbers">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {(mode === 'raw' || mode === 'both') && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-[#6E6E78]" />
                <JargonTooltip term="Raw">
                  <span className="text-[#8A8A93] font-bold">RAW (UNADJUSTED)</span>
                </JargonTooltip>
              </div>
            )}
            {(mode === 'fixed' || mode === 'both') && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-[#FC5000]" />
                <JargonTooltip term="Fixed">
                  <span className="text-[#FC5000] font-bold">FIXED (HARMONIZED)</span>
                </JargonTooltip>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
            {regionsData.regions
              .filter((r: any) => r.isReady)
              .map((r: any) => (
                <button
                  key={r.id}
                  onClick={() => onSelectRegion(r.id as RegionId)}
                  className={`min-h-[32px] px-2.5 py-1 rounded-full text-[11px] uppercase cursor-pointer transition-colors flex-shrink-0 ${
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

        <div className="w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none touch-pan-y"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + innerH * (1 - ratio);
              const val = Math.round(ratio * axisMax);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#26262B"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    fill="#8A8A93"
                    fontSize="13"
                    textAnchor="end"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {val.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {points.map((p) => {
              if (p.year % 4 !== 0 && p.year !== 2012 && p.year !== 2024) return null;
              return (
                <g key={p.year}>
                  <line
                    x1={p.x}
                    y1={padding.top}
                    x2={p.x}
                    y2={padding.top + innerH}
                    stroke={p.year === 2012 ? '#FC5000' : '#26262B'}
                    strokeWidth={p.year === 2012 ? '1.5' : '1'}
                    strokeDasharray={p.year === 2012 ? 'none' : '2 2'}
                    opacity={p.year === 2012 ? 0.75 : 0.4}
                  />
                  <text
                    x={p.x}
                    y={padding.top + innerH + 26}
                    fill={p.year === 2012 ? '#FC5000' : '#8A8A93'}
                    fontSize="13"
                    fontWeight={p.year === 2012 ? 'bold' : 'normal'}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {p.year}
                  </text>
                </g>
              );
            })}

            {mode === 'both' && (
              <path d={deltaAreaPath} fill="#FC5000" fillOpacity="0.08" />
            )}

            {(mode === 'raw' || mode === 'both') && (
              <path
                d={rawPath}
                fill="none"
                stroke="#6E6E78"
                strokeWidth={mode === 'raw' ? '3' : '2.2'}
              />
            )}

            {(mode === 'fixed' || mode === 'both') && (
              <path
                d={fixedPath}
                fill="none"
                stroke="#FC5000"
                strokeWidth={mode === 'fixed' ? '3.5' : '2.8'}
              />
            )}

            {hoveredItem && (
              <line
                x1={hoveredItem.x}
                y1={padding.top}
                x2={hoveredItem.x}
                y2={padding.top + innerH}
                stroke="#F2EFE9"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.7"
              />
            )}

            {points.map((p, i) => (
              <g
                key={p.year}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredYearIndex(i)}
                onClick={() => setHoveredYearIndex(i)}
              >
                <rect
                  x={p.x - innerW / points.length / 2}
                  y={padding.top}
                  width={innerW / points.length}
                  height={innerH}
                  fill="transparent"
                />
                {(mode === 'raw' || mode === 'both') && (
                  <circle
                    cx={p.x}
                    cy={p.yRaw}
                    r={hoveredYearIndex === i ? 6 : 3.5}
                    fill="#6E6E78"
                  />
                )}
                {(mode === 'fixed' || mode === 'both') && (
                  <circle
                    cx={p.x}
                    cy={p.yFixed}
                    r={hoveredYearIndex === i ? 6.5 : 4}
                    fill="#FC5000"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Year Scrubber Slider for Easy Mobile Inspection */}
        <div className="mt-4 flex items-center gap-3 px-1">
          <span className="text-[11px] font-mono-numbers text-[#8A8A93]">
            {points[0]?.year}
          </span>
          <input
            type="range"
            min={0}
            max={points.length - 1}
            value={hoveredYearIndex}
            onChange={(e) => setHoveredYearIndex(Number(e.target.value))}
            aria-label="Inspect year on timeline"
            className="flex-1 accent-[#FC5000] cursor-pointer h-1.5 bg-[#26262B] rounded-lg"
          />
          <span className="text-[11px] font-mono-numbers text-[#8A8A93]">
            {points[points.length - 1]?.year}
          </span>
        </div>

        {/* Compact Year Comparison Bento Strip */}
        <div className="mt-4 pt-4 border-t border-dotted border-[#26262B]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0A0A0C] p-3.5 sm:p-4 rounded-[18px] border border-[#26262B]/60">
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-mono-numbers uppercase text-[#8A8A93] mb-0.5">
                Selected Year
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-numbers text-[22px] sm:text-[24px] font-bold text-[#F2EFE9] leading-none">
                  {hoveredItem.year}
                </span>
                <span className="text-[10px] font-mono-numbers text-[#3FD0C9] px-2 py-0.5 rounded-full bg-[#3FD0C9]/10 border border-[#3FD0C9]/20">
                  {hoveredItem.sensor}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[#8A8A93] text-[10px] font-mono-numbers block uppercase mb-0.5">
                <JargonTooltip term="Raw">
                  <span>Raw (Original)</span>
                </JargonTooltip>
              </span>
              <span className="font-mono-numbers text-[18px] sm:text-[20px] font-bold text-[#8A8A93] leading-none">
                {hoveredItem.raw.toLocaleString()}
              </span>
              <span className="block text-[11px] text-[#9A8F85] font-sans mt-0.5">
                Unadjusted count
              </span>
            </div>

            <div>
              <span className="text-[#FC5000] text-[10px] font-mono-numbers block uppercase mb-0.5">
                <JargonTooltip term="Fixed">
                  <span>Fixed (Fair)</span>
                </JargonTooltip>
              </span>
              <span className="font-mono-numbers text-[18px] sm:text-[20px] font-bold text-[#FC5000] leading-none">
                {hoveredItem.fixed.toLocaleString()}
              </span>
              <span className="block text-[11px] text-[#9A8F85] font-sans mt-0.5">
                Camera-adjusted
              </span>
            </div>

            <div>
              <span className="text-[#8A8A93] text-[10px] font-mono-numbers block uppercase mb-0.5">
                <JargonTooltip term="Delta">
                  <span>Delta (Difference)</span>
                </JargonTooltip>
              </span>
              <span className="font-mono-numbers text-[18px] sm:text-[20px] font-bold text-[#F2EFE9] leading-none">
                {delta > 0
                  ? `-${delta.toLocaleString()}`
                  : delta === 0
                  ? '0'
                  : `+${Math.abs(delta).toLocaleString()}`}
              </span>
              <span className="block text-[11px] text-[#9A8F85] font-sans mt-0.5">
                Camera spike removed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
