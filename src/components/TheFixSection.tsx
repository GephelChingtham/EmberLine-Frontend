/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import trendData from '../data/trend.json';
import regionsData from '../data/regions.json';
import { getRegionTrend } from '../utils/regionData';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import type { RegionId } from '../App';

type Mode = 'both' | 'raw' | 'fixed';

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  simpleView: boolean;
}

export function TheFixSection({ selectedRegion, onSelectRegion, simpleView }: Props) {
  const [mode, setMode] = useState<Mode>('both');

  const regionBlock = getRegionTrend(selectedRegion);
  const timeline: { year: number; raw: number; fixed: number; sensor: string }[] =
    regionBlock.timeline;

  const jumpYear = trendData.jumpYear;
  const defaultJumpIdx = Math.max(
    0,
    timeline.findIndex((d) => d.year === jumpYear)
  );
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number>(defaultJumpIdx);

  const width = 1000;
  const height = 290;
  const padding = { top: 28, right: 36, bottom: 38, left: 65 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const lastYear = timeline[timeline.length - 1]?.year || jumpYear;

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

  const hoveredItem = points[hoveredYearIndex] || points[defaultJumpIdx] || points[0];
  const delta = Math.round((hoveredItem.raw - hoveredItem.fixed) * 100) / 100;

  return (
    <section
      id="the-fix"
      className="w-full py-16 sm:py-20 px-4 sm:px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2
            className={`font-headline leading-[0.94] text-[#F2EFE9] uppercase transition-all duration-200 ${
              simpleView
                ? 'text-[clamp(28px,4.2vw,48px)]'
                : 'text-[clamp(38px,5.8vw,68px)]'
            }`}
          >
            ONE FAIR FIRE RECORD.
          </h2>

          {/* Required Plain-English Line directly under technical headline */}
          <PlainWordsLine
            simpleView={simpleView}
            text="Raw is the original count. Fixed adjusts it so both satellites are judged fairly."
          />

          <p className="text-[14px] sm:text-[15px] font-sans font-medium text-[#8A8A93]">
            In <strong className="text-[#F2EFE9]">{regionBlock.regionName}</strong>,{' '}
            <JargonTooltip term="Harmonization">
              <span className="text-[#F2EFE9]">harmonization</span>
            </JargonTooltip>{' '}
            removes the{' '}
            <JargonTooltip term="2012 artifact jump">
              <span className="text-[#F2EFE9]">{jumpYear} artifact jump</span>
            </JargonTooltip>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B]">
            <button
              onClick={() => setMode('raw')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
                mode === 'raw'
                  ? 'bg-[#6E6E78] text-white'
                  : 'text-[#8A8A93] hover:text-[#F2EFE9]'
              }`}
            >
              Raw (original)
            </button>

            <button
              onClick={() => setMode('fixed')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
                mode === 'fixed'
                  ? 'bg-[#FC5000] text-white'
                  : 'text-[#8A8A93] hover:text-[#F2EFE9]'
              }`}
            >
              Fixed (fair)
            </button>

            <button
              onClick={() => setMode('both')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
                mode === 'both'
                  ? 'bg-[#FC5000] text-white'
                  : 'text-[#8A8A93] hover:text-[#F2EFE9]'
              }`}
            >
              Overlay
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="bg-[#131316] p-4 sm:p-6 rounded-[28px] relative mt-5 border border-dotted border-[#26262B]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-dotted border-[#26262B] text-[11px] sm:text-[12px] font-mono-numbers">
          <div className="flex flex-wrap items-center gap-5">
            {(mode === 'raw' || mode === 'both') && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-[#6E6E78]"></span>
                <JargonTooltip term="Raw">
                  <span className="text-[#6E6E78] font-bold">RAW SENSOR RECORD</span>
                </JargonTooltip>
              </div>
            )}
            {(mode === 'fixed' || mode === 'both') && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-[#FC5000]"></span>
                <JargonTooltip term="Fixed">
                  <span className="text-[#FC5000] font-bold">EMBERLINE HARMONIZED (FIXED)</span>
                </JargonTooltip>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {regionsData.regions.filter((r: any) => r.isReady).map((r: any) => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id as RegionId)}
                className={`px-2.5 py-1 rounded-full text-[11px] uppercase cursor-pointer transition-colors ${
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

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[640px] select-none"
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
                    x={padding.left - 12}
                    y={y + 4}
                    fill="#8A8A93"
                    fontSize="11"
                    textAnchor="end"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {val.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {points.map((p) => {
              if (p.year % 4 !== 0 && p.year !== jumpYear && p.year !== lastYear) return null;
              return (
                <g key={p.year}>
                  <line
                    x1={p.x}
                    y1={padding.top}
                    x2={p.x}
                    y2={padding.top + innerH}
                    stroke={p.year === jumpYear ? '#FC5000' : '#26262B'}
                    strokeWidth="1"
                    strokeDasharray={p.year === jumpYear ? 'none' : '2 2'}
                    opacity={p.year === jumpYear ? 0.7 : 0.4}
                  />
                  <text
                    x={p.x}
                    y={padding.top + innerH + 22}
                    fill={p.year === jumpYear ? '#FC5000' : '#8A8A93'}
                    fontSize="11"
                    fontWeight={p.year === jumpYear ? 'bold' : 'normal'}
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
                strokeWidth={mode === 'raw' ? '3' : '2'}
              />
            )}

            {(mode === 'fixed' || mode === 'both') && (
              <path
                d={fixedPath}
                fill="none"
                stroke="#FC5000"
                strokeWidth={mode === 'fixed' ? '3.5' : '2.5'}
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
                opacity="0.8"
              />
            )}

            {points.map((p, i) => (
              <g
                key={p.year}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredYearIndex(i)}
              >
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

        {/* Compact, Plain-English 4-Cell Bento Breakdown for Raw, Fixed, and Delta */}
        <div className="mt-4 pt-4 border-t border-dotted border-[#26262B] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Cell 1: Year & Sensor */}
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono-numbers uppercase text-[#9A8F85]">
                Inspected Year
              </span>
              <span className="text-[10px] font-mono-numbers text-[#3FD0C9] px-2 py-0.5 rounded-full bg-[#131316] border border-[#26262B]">
                {hoveredItem.sensor}
              </span>
            </div>
            <div className="font-mono-numbers text-[24px] font-bold text-[#F2EFE9] my-1">
              {hoveredItem.year}
            </div>
            <p className="text-[11px] font-sans text-[#9A8F85] leading-snug">
              Hover or tap any point on the chart above to compare that year’s numbers.
            </p>
          </div>

          {/* Cell 2: Raw */}
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
            <div className="text-[10px] font-mono-numbers uppercase text-[#8A8A93]">
              <JargonTooltip term="Raw">
                <span>Raw (Unadjusted Count)</span>
              </JargonTooltip>
            </div>
            <div className="font-mono-numbers text-[22px] font-bold text-[#6E6E78] my-1">
              {hoveredItem.raw.toLocaleString()}
            </div>
            <p className="text-[11px] font-sans text-[#9A8F85] leading-snug">
              Original fire <JargonTooltip term="Detection">detections</JargonTooltip> straight from the satellite before fixing for camera sharpness.
            </p>
          </div>

          {/* Cell 3: Fixed */}
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
            <div className="text-[10px] font-mono-numbers uppercase text-[#FC5000]">
              <JargonTooltip term="Fixed">
                <span>Fixed (Fair Count)</span>
              </JargonTooltip>
            </div>
            <div className="font-mono-numbers text-[22px] font-bold text-[#FC5000] my-1">
              {hoveredItem.fixed.toLocaleString()}
            </div>
            <p className="text-[11px] font-sans text-[#9A8F85] leading-snug">
              Adjusted fire count after putting both old (<JargonTooltip term="MODIS">MODIS</JargonTooltip>) and new (<JargonTooltip term="VIIRS">VIIRS</JargonTooltip>) cameras on the same fair scale.
            </p>
          </div>

          {/* Cell 4: Delta (Plain-English Elaboration) */}
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-numbers uppercase text-[#F2EFE9] font-bold">
                Delta (Raw − Fixed)
              </span>
              <span className="text-[10px] font-mono-numbers text-[#9A8F85]">
                Camera Adjustment
              </span>
            </div>
            <div className="font-mono-numbers text-[22px] font-bold text-[#F2EFE9] my-1">
              {delta > 0
                ? `-${delta.toLocaleString()}`
                : delta === 0
                ? '0'
                : `+${Math.abs(delta).toLocaleString()}`}
            </div>
            <p className="text-[11px] font-sans text-[#9A8F85] leading-snug">
              In simple words: we subtracted <strong className="text-[#F2EFE9]">{delta.toLocaleString()}</strong> extra heat spots in {hoveredItem.year} so the sharper camera doesn’t create a fake spike.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
