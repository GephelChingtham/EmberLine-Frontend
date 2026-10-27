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

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  simpleView: boolean;
}

export function TheProblemSection({ selectedRegion, onSelectRegion, simpleView }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    raw: number;
    fixed: number;
    sensor: string;
  } | null>(null);

  const width = 1000;
  const height = 280;
  const padding = { top: 28, right: 36, bottom: 36, left: 65 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const regionBlock = getRegionTrend(selectedRegion);
  const timeline: { year: number; raw: number; fixed: number; sensor: string }[] =
    regionBlock.timeline;

  const jumpYear = trendData.jumpYear;
  const lastYear = timeline[timeline.length - 1]?.year || jumpYear;

  const peakRaw = Math.max(...timeline.map((d) => d.raw), 1000);
  const maxRaw = Math.ceil((peakRaw * 1.1) / 1000) * 1000;

  const points = timeline.map((d, i) => {
    const x = padding.left + (i / (timeline.length - 1)) * innerW;
    const clampedRaw = Math.min(d.raw, maxRaw);
    const y = padding.top + innerH - (clampedRaw / maxRaw) * innerH;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const jumpPoint = points.find((p) => p.year === jumpYear) || points[0];
  const prevPoint = points.find((p) => p.year === jumpYear - 1) || points[0];
  const activePoint = hoveredPoint || jumpPoint;

  return (
    <section
      id="the-problem"
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
          THE FALSE {jumpYear} JUMP.
        </h2>

        {/* Region Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B]">
          {regionsData.regions.filter((r: any) => r.isReady).map((r: any) => (
            <button
              key={r.id}
              onClick={() => {
                onSelectRegion(r.id as RegionId);
                setHoveredPoint(null);
              }}
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
        text="A sharper satellite joined in 2012 and spotted small fires the old one missed."
      />

      <div className="text-[14px] sm:text-[15px] font-sans font-medium text-[#8A8A93] mb-6 flex items-center gap-1.5 flex-wrap">
        <span>
          <JargonTooltip term="Raw">
            <span className="text-[#F2EFE9]">Raw</span>
          </JargonTooltip>{' '}
          <JargonTooltip term="Detection">
            <span className="text-[#F2EFE9]">detection</span>
          </JargonTooltip>{' '}
          counts in <strong className="text-[#F2EFE9]">{regionBlock.regionName}</strong> show a{' '}
          <JargonTooltip term="2012 artifact jump">
            <span className="text-[#FC5000]">{jumpYear} artifact jump</span>
          </JargonTooltip>{' '}
          when{' '}
          <JargonTooltip term="VIIRS">
            <span className="text-[#F2EFE9]">VIIRS</span>
          </JargonTooltip>{' '}
          joined{' '}
          <JargonTooltip term="MODIS">
            <span className="text-[#F2EFE9]">MODIS</span>
          </JargonTooltip>
          .
        </span>
      </div>

      <div className="bg-[#131316] p-4 sm:p-6 rounded-[28px] relative border border-dotted border-[#26262B]">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[640px] select-none"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + innerH * (1 - ratio);
              const val = Math.round(ratio * maxRaw);
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

            <path d={pathD} fill="none" stroke="#6E6E78" strokeWidth="2.5" />

            {jumpPoint && (
              <g>
                <circle
                  cx={jumpPoint.x}
                  cy={jumpPoint.y}
                  r="16"
                  fill="none"
                  stroke="#FC5000"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <circle cx={jumpPoint.x} cy={jumpPoint.y} r="5.5" fill="#FC5000" />

                <g transform={`translate(${jumpPoint.x - 110}, ${Math.max(jumpPoint.y - 52, 4)})`}>
                  <rect
                    width="220"
                    height="40"
                    rx="10"
                    fill="#0A0A0C"
                    stroke="#FC5000"
                    strokeWidth="1.5"
                  />
                  <text
                    x="110"
                    y="17"
                    fill="#FC5000"
                    fontSize="10.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {jumpYear}: SHARPER SATELLITE JOINS
                  </text>
                  <text
                    x="110"
                    y="31"
                    fill="#9A8F85"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="DM Sans, sans-serif"
                  >
                    VIIRS joined MODIS
                  </text>
                </g>
              </g>
            )}

            {points.map((p) => (
              <circle
                key={p.year}
                cx={p.x}
                cy={p.y}
                r={p.year === jumpYear ? 5.5 : 4}
                fill={p.year === jumpYear ? '#FC5000' : '#6E6E78'}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>

        {/* Compact Bento Grid Footer inside The Problem Card */}
        <div className="mt-4 pt-4 border-t border-dotted border-[#26262B] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B]">
            <div className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] mb-1">
              Selected Year ({activePoint.year})
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-numbers text-[20px] font-bold text-[#FC5000]">
                {activePoint.raw.toLocaleString()}
              </span>
              <JargonTooltip term="Raw">
                <span className="text-[11px] font-mono-numbers text-[#8A8A93]">
                  Raw detections
                </span>
              </JargonTooltip>
            </div>
            <p className="text-[11px] font-sans text-[#9A8F85] mt-1">
              Unadjusted heat spots counted by {activePoint.sensor}.
            </p>
          </div>

          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B]">
            <div className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] mb-1">
              Before vs {jumpYear} Camera Upgrade
            </div>
            <div className="font-mono-numbers text-[15px] font-bold text-[#F2EFE9]">
              {prevPoint.year}: {prevPoint.raw.toLocaleString()} → {jumpPoint.year}:{' '}
              <span className="text-[#FC5000]">{jumpPoint.raw.toLocaleString()}</span>
            </div>
            <p className="text-[11px] font-sans text-[#9A8F85] mt-1">
              The sudden jump happened right when the sharper camera turned on.
            </p>
          </div>

          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B]">
            <div className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] mb-1">
              Why This Matters
            </div>
            <div className="text-[13px] font-sans font-semibold text-[#F2EFE9]">
              <JargonTooltip term="2012 artifact jump">
                <span>2012 artifact jump</span>
              </JargonTooltip>
            </div>
            <p className="text-[11px] font-sans text-[#9A8F85] mt-1">
              Using raw numbers makes it look like fires exploded in {jumpYear}, even when they didn’t.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
