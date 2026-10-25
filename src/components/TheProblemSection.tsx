/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import trendData from '../data/trend.json';
import { SampleBadge } from './SampleBadge';
import { JargonTooltip } from './JargonTooltip';

export function TheProblemSection() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    raw: number;
    sensor: string;
    isJump?: boolean;
  } | null>(null);

  // Chart coordinate calculations
  const width = 1000;
  const height = 320;
  const padding = { top: 30, right: 40, bottom: 40, left: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const timeline = trendData.timeline;
  // Scaled ceiling so the 2012 jump is dramatic and prominent
  const maxRaw = 28000;

  const points = timeline.map((d, i) => {
    const x = padding.left + (i / (timeline.length - 1)) * innerW;
    const clampedRaw = Math.min(d.raw, maxRaw);
    const y = padding.top + innerH - (clampedRaw / maxRaw) * innerH;
    return { ...d, x, y, isCapped: d.raw > maxRaw };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // 2012 point
  const jumpPoint = points.find((p) => p.year === trendData.jumpYear);

  return (
    <section id="the-problem" className="w-full py-28 px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]">
      
      {/* Header with 6-word headline & SAMPLE DATA badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h2 className="font-headline text-[clamp(40px,6vw,72px)] leading-[0.94] text-[#F2EFE9] uppercase">
          THE FALSE 2012 JUMP.
        </h2>
        {trendData.sample && <SampleBadge />}
      </div>

      {/* One-line statement with JargonTooltip */}
      <div className="text-[16px] font-sans font-medium text-[#8A8A93] mb-10 flex items-center gap-1.5 flex-wrap">
        <span>
          <JargonTooltip term="Raw">
            <span className="text-[#F2EFE9]">Raw</span>
          </JargonTooltip>
          {' '}counts jumped in 2012. The satellite changed, not the fires.
        </span>
      </div>

      {/* Raw Trend Line Card with 2012 Jump Circled */}
      <div className="bg-[#131316] p-6 sm:p-8 rounded-[40px] relative">
        
        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[700px] select-none"
          >
            {/* Horizontal Gridlines */}
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

            {/* Vertical Year Markers */}
            {points.map((p) => {
              if (p.year % 4 !== 0 && p.year !== 2012 && p.year !== 2024) return null;
              return (
                <g key={p.year}>
                  <line
                    x1={p.x}
                    y1={padding.top}
                    x2={p.x}
                    y2={padding.top + innerH}
                    stroke={p.year === 2012 ? "#FC5000" : "#26262B"}
                    strokeWidth="1"
                    strokeDasharray={p.year === 2012 ? "none" : "2 2"}
                    opacity={p.year === 2012 ? 0.7 : 0.4}
                  />
                  <text
                    x={p.x}
                    y={padding.top + innerH + 24}
                    fill={p.year === 2012 ? "#FC5000" : "#8A8A93"}
                    fontSize="11"
                    fontWeight={p.year === 2012 ? "bold" : "normal"}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {p.year}
                  </text>
                </g>
              );
            })}

            {/* Raw Trend Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#6E6E78"
              strokeWidth="2.5"
            />

            {/* 2012 Jump Callout & Circle: renamed to "2012: sharper satellite joins" */}
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
                <circle
                  cx={jumpPoint.x}
                  cy={jumpPoint.y}
                  r="6"
                  fill="#FC5000"
                />

                {/* Callout box above 2012 */}
                <g transform={`translate(${jumpPoint.x - 110}, ${jumpPoint.y - 56})`}>
                  <rect
                    width="220"
                    height="42"
                    rx="10"
                    fill="#0A0A0C"
                    stroke="#FC5000"
                    strokeWidth="1.5"
                  />
                  <text
                    x="110"
                    y="18"
                    fill="#FC5000"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    2012: SHARPER SATELLITE JOINS
                  </text>
                  <text
                    x="110"
                    y="32"
                    fill="#8A8A93"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="DM Sans, sans-serif"
                  >
                    VIIRS (375m) joined MODIS (1km)
                  </text>
                </g>
              </g>
            )}

            {/* Interactive Data Dots */}
            {points.map((p) => (
              <circle
                key={p.year}
                cx={p.x}
                cy={p.y}
                r={p.year === 2012 ? 6 : 4}
                fill={p.year === 2012 ? "#FC5000" : "#6E6E78"}
                className="cursor-pointer hover:r-6 transition-all"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>

        {/* Selected point readout with Jargon Tooltips */}
        <div className="mt-4 pt-4 border-t border-dotted border-[#26262B] flex flex-wrap items-center justify-between gap-4 text-[12px] font-mono-numbers">
          <div className="flex items-center gap-3">
            <span className="text-[#8A8A93]">
              {hoveredPoint ? hoveredPoint.year : '2012'}:
            </span>
            <span className="text-[#FC5000] font-bold">
              {hoveredPoint ? hoveredPoint.raw.toLocaleString() : jumpPoint?.raw.toLocaleString()}
            </span>
            <span className="text-[#8A8A93] flex items-center gap-1">
              <JargonTooltip term="Raw">
                <span>raw detections</span>
              </JargonTooltip>
              <span>({hoveredPoint ? hoveredPoint.sensor : 'VIIRS + MODIS'})</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#8A8A93]">
            <JargonTooltip term="Artifact jump">
              <span>Artifact jump</span>
            </JargonTooltip>
          </div>
        </div>

      </div>

    </section>
  );
}
