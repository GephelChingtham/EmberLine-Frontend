/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import trendData from '../data/trend.json';
import { SampleBadge } from './SampleBadge';
import { JargonTooltip } from './JargonTooltip';

type Mode = 'both' | 'raw' | 'fixed';

export function TheFixSection() {
  const [mode, setMode] = useState<Mode>('both');
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number>(12); // Default to 2012

  const width = 1000;
  const height = 340;
  const padding = { top: 30, right: 40, bottom: 45, left: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const timeline = trendData.timeline;
  // Identical shared axis max across Raw and Fixed, balanced so fixed line is not squashed
  const axisMax = 28000;

  const points = timeline.map((d, i) => {
    const x = padding.left + (i / (timeline.length - 1)) * innerW;
    const clampedRaw = Math.min(d.raw, axisMax);
    const clampedFixed = Math.min(d.fixed, axisMax);
    const yRaw = padding.top + innerH - (clampedRaw / axisMax) * innerH;
    const yFixed = padding.top + innerH - (clampedFixed / axisMax) * innerH;
    return { ...d, x, yRaw, yFixed, isOutlier: d.raw > axisMax };
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

  const hoveredItem = points[hoveredYearIndex] || points[12];
  const delta = hoveredItem.raw - hoveredItem.fixed;

  return (
    <section id="the-fix" className="w-full py-28 px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]">
      
      {/* Header with 6-word headline & toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-headline text-[clamp(40px,6vw,72px)] leading-[0.94] text-[#F2EFE9] uppercase">
              ONE FAIR FIRE RECORD.
            </h2>
            {trendData.sample && <SampleBadge />}
          </div>
          <p className="text-[16px] font-sans font-medium text-[#8A8A93]">
            The artificial 2012 jump disappears.
          </p>
        </div>

        {/* The Big Raw / Fixed Toggle */}
        <div className="flex items-center gap-1.5 bg-[#131316] p-1.5 rounded-full border border-dotted border-[#26262B]">
          <button
            onClick={() => setMode('raw')}
            className={`px-4 sm:px-5 py-2 rounded-full text-[13px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'raw'
                ? 'bg-[#6E6E78] text-white'
                : 'text-[#8A8A93] hover:text-[#F2EFE9]'
            }`}
          >
            Raw (original)
          </button>

          <button
            onClick={() => setMode('fixed')}
            className={`px-4 sm:px-5 py-2 rounded-full text-[13px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'fixed'
                ? 'bg-[#FC5000] text-white'
                : 'text-[#8A8A93] hover:text-[#F2EFE9]'
            }`}
          >
            Fixed (fair)
          </button>

          <button
            onClick={() => setMode('both')}
            className={`px-4 sm:px-5 py-2 rounded-full text-[13px] font-mono-numbers tracking-wider font-semibold transition-all cursor-pointer ${
              mode === 'both'
                ? 'bg-[#FC5000] text-white'
                : 'text-[#8A8A93] hover:text-[#F2EFE9]'
            }`}
          >
            Overlay
          </button>
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="bg-[#131316] p-6 sm:p-8 rounded-[40px] relative mt-8">
        
        {/* Visual Line Legend */}
        <div className="flex items-center gap-6 pb-4 mb-4 border-b border-dotted border-[#26262B] text-[12px] font-mono-numbers">
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
                <span className="text-[#FC5000] font-bold">EMBERLINE HARMONIZED</span>
              </JargonTooltip>
            </div>
          )}
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[700px] select-none"
          >
            {/* Horizontal Gridlines */}
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

            {/* Shaded Delta Zone when mode is 'both' */}
            {mode === 'both' && (
              <path
                d={deltaAreaPath}
                fill="#FC5000"
                fillOpacity="0.08"
              />
            )}

            {/* Raw Path */}
            {(mode === 'raw' || mode === 'both') && (
              <path
                d={rawPath}
                fill="none"
                stroke="#6E6E78"
                strokeWidth={mode === 'raw' ? '3' : '2'}
              />
            )}

            {/* Fixed Path */}
            {(mode === 'fixed' || mode === 'both') && (
              <path
                d={fixedPath}
                fill="none"
                stroke="#FC5000"
                strokeWidth={mode === 'fixed' ? '3.5' : '2.5'}
              />
            )}

            {/* Vertical Scrubber Cursor Line */}
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

            {/* Interactive Dots */}
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

        {/* Exactly ONE Stat Card: Selected Year's Raw vs Fixed comparison */}
        <div className="mt-6 pt-5 border-t border-dotted border-[#26262B]">
          <div className="bg-[#0A0A0C] p-4 sm:p-5 rounded-[20px] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono-numbers text-[26px] font-bold text-[#F2EFE9]">
                {hoveredItem.year}
              </span>
              <span className="text-[12px] font-mono-numbers text-[#8A8A93] px-2.5 py-0.5 rounded-full bg-[#131316] border border-[#26262B]">
                {hoveredItem.sensor}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-mono-numbers text-[13px]">
              <div>
                <span className="text-[#8A8A93] text-[11px] block uppercase">
                  <JargonTooltip term="Raw">
                    <span>Raw</span>
                  </JargonTooltip>
                </span>
                <span className="text-[20px] font-bold text-[#6E6E78]">
                  {hoveredItem.raw.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[#FC5000] text-[11px] block uppercase">
                  <JargonTooltip term="Fixed">
                    <span>Fixed</span>
                  </JargonTooltip>
                </span>
                <span className="text-[20px] font-bold text-[#FC5000]">
                  {hoveredItem.fixed.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[#8A8A93] text-[11px] block uppercase">Delta</span>
                <span className="text-[20px] font-bold text-[#F2EFE9]">
                  {delta > 0 ? `-${delta.toLocaleString()}` : delta === 0 ? '0' : `+${Math.abs(delta).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
