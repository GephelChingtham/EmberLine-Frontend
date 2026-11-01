/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import trendData from '../data/trend.json';
import regionsData from '../data/regions.json';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import type { RegionId } from '../App';

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  simpleView?: boolean;
}

export function TheProblemSection({
  selectedRegion,
  onSelectRegion,
  simpleView = false,
}: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    raw: number;
    sensor: string;
  } | null>(null);

  const width = 1000;
  const height = 320;
  const padding = { top: 36, right: 28, bottom: 42, left: 72 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const regionBlock =
    (trendData as any).byRegion?.[selectedRegion] || {
      regionName: 'California',
      timeline: trendData.timeline,
    };
  const timeline: { year: number; raw: number; fixed: number; sensor: string }[] =
    regionBlock.timeline;

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

  const jumpPoint = points.find((p) => p.year === trendData.jumpYear);
  const activePoint = hoveredPoint || jumpPoint || points[0];

  return (
    <section
      id="the-problem"
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
            THE FALSE 2012 JUMP.
          </h2>
          <PlainWordsLine
            text="A sharper satellite joined in 2012 and spotted small fires the old one missed."
            simpleView={simpleView}
          />
        </div>

        {/* Region Switcher (horizontally scrollable on mobile) */}
        <div className="flex items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B] overflow-x-auto no-scrollbar max-w-full">
          {regionsData.regions
            .filter((r: any) => r.isReady)
            .map((r: any) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRegion(r.id as RegionId);
                  setHoveredPoint(null);
                }}
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

      <div className="text-[14px] sm:text-[15px] font-sans text-[#8A8A93] mb-6 flex items-center gap-1.5 flex-wrap">
        <span>
          <JargonTooltip term="Raw">
            <span className="text-[#F2EFE9]">Raw</span>
          </JargonTooltip>{' '}
          fire counts in <strong className="text-[#F2EFE9]">{regionBlock.regionName}</strong> spiked in {trendData.jumpYear}—an{' '}
          <JargonTooltip term="2012 artifact jump">
            <span className="text-[#F2EFE9]">2012 artifact jump</span>
          </JargonTooltip>{' '}
          from adding the sharper camera.
        </span>
      </div>

      <div className="bg-[#131316] p-4 sm:p-7 rounded-[24px] sm:rounded-[36px] border border-dotted border-[#26262B] relative">
        <div className="w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none touch-pan-y"
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

            <path d={pathD} fill="none" stroke="#6E6E78" strokeWidth="3" />

            {jumpPoint && (
              <g>
                <circle
                  cx={jumpPoint.x}
                  cy={jumpPoint.y}
                  r="18"
                  fill="none"
                  stroke="#FC5000"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <circle cx={jumpPoint.x} cy={jumpPoint.y} r="6.5" fill="#FC5000" />

                <g
                  transform={`translate(${Math.min(
                    Math.max(jumpPoint.x - 115, padding.left),
                    width - padding.right - 230
                  )}, ${Math.max(jumpPoint.y - 58, 4)})`}
                >
                  <rect
                    width="230"
                    height="44"
                    rx="10"
                    fill="#0A0A0C"
                    stroke="#FC5000"
                    strokeWidth="1.5"
                  />
                  <text
                    x="115"
                    y="19"
                    fill="#FC5000"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    2012: SHARPER CAMERA JOINS
                  </text>
                  <text
                    x="115"
                    y="34"
                    fill="#9A8F85"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="DM Sans, sans-serif"
                  >
                    VIIRS (375m) joined MODIS (1km)
                  </text>
                </g>
              </g>
            )}

            {points.map((p) => {
              const isSelected = activePoint?.year === p.year;
              return (
                <g
                  key={p.year}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onClick={() => setHoveredPoint(p)}
                >
                  <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.year === 2012 || isSelected ? 6.5 : 4}
                    fill={
                      p.year === 2012
                        ? '#FC5000'
                        : isSelected
                        ? '#F2EFE9'
                        : '#6E6E78'
                    }
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 pt-4 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-3 text-[12px] sm:text-[13px] font-mono-numbers">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[#F2EFE9] font-bold px-2.5 py-0.5 rounded-md bg-[#0A0A0C] border border-[#26262B]">
              {activePoint.year}
            </span>
            <span className="text-[#FC5000] font-bold text-[15px]">
              {activePoint.raw.toLocaleString()}
            </span>
            <span className="text-[#8A8A93] flex items-center gap-1.5 flex-wrap">
              <JargonTooltip term="Raw">
                <span>raw detections</span>
              </JargonTooltip>
              <span className="text-[#9A8F85]">({activePoint.sensor})</span>
            </span>
          </div>

          <div className="text-[11px] sm:text-[12px] text-[#9A8F85] font-sans">
            Tap or hover any year dot to inspect
          </div>
        </div>
      </div>
    </section>
  );
}
