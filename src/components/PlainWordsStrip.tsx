/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import trendData from '../data/trend.json';
import { getRegionTrend, getRegionFires } from '../utils/regionData';
import { JargonTooltip } from './JargonTooltip';
import type { RegionId } from '../App';

interface PlainWordsStripProps {
  selectedRegion: RegionId;
  simpleView: boolean;
  onToggleSimpleView: () => void;
}

export function PlainWordsStrip({
  selectedRegion,
  simpleView,
  onToggleSimpleView,
}: PlainWordsStripProps) {
  const regionBlock = getRegionTrend(selectedRegion);

  const jumpYearEntry =
    regionBlock.timeline.find((d: any) => d.year === trendData.jumpYear) ||
    regionBlock.timeline[0];

  const jumpYearDelta =
    Math.round((jumpYearEntry.raw - jumpYearEntry.fixed) * 100) / 100;

  // Find CA-2020-0094 specifically if in California, or the first fire in the selected region (e.g. MY-2002-0012 in Malaysia)
  const regionFires = getRegionFires(selectedRegion);
  const sampleFire =
    regionFires.find((f: any) => f.id === 'ca-2020-0094') || regionFires[0];

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 pb-12">
      <div
        className={`bg-[#131316] rounded-[24px] p-4 sm:p-6 border transition-all ${
          simpleView
            ? 'border-[#FC5000] bg-[#131316]'
            : 'border-dotted border-[#26262B]'
        }`}
      >
        {/* Top Bar: Clear Label That This Is The Simplified Breakdown For Normal People */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b border-dotted border-[#26262B]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-numbers uppercase text-[#FC5000] tracking-widest font-bold">
                For Normal People — Simple Guide (No Science Jargon)
              </span>
            </div>
            <p className="text-[13px] font-sans text-[#9A8F85] mt-0.5">
              <span className="font-mono-numbers uppercase text-[10px] font-semibold mr-1.5">
                In plain words:
              </span>
              What all the satellite terms, numbers, and fire codes on this page actually mean.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleSimpleView}
            className={`px-3 py-1 rounded-full text-[11px] font-mono-numbers uppercase tracking-wider border transition-colors cursor-pointer ${
              simpleView
                ? 'bg-[#FC5000] text-white border-[#FC5000] font-bold'
                : 'bg-[#0A0A0C] text-[#9A8F85] border-[#26262B] hover:text-[#F2EFE9]'
            }`}
          >
            {simpleView ? 'Simple View Active' : 'Turn On Simple View'}
          </button>
        </div>

        {/* Compact 4-Card Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Why 2012 Jumped */}
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono-numbers uppercase text-[#FC5000] font-bold">
                  1. The Camera Upgrade
                </span>
                <span className="text-[10px] font-mono-numbers text-[#9A8F85]">
                  {trendData.jumpYear}
                </span>
              </div>
              <div className="text-[13px] font-sans font-semibold text-[#F2EFE9] mb-1">
                <JargonTooltip term="MODIS">MODIS</JargonTooltip> vs{' '}
                <JargonTooltip term="VIIRS">VIIRS</JargonTooltip>
              </div>
              <p className="text-[12px] font-sans text-[#9A8F85] leading-relaxed">
                NASA’s older satellite (<strong className="text-[#F2EFE9]">MODIS</strong>) had a blurrier camera. In{' '}
                <strong className="text-[#F2EFE9]">{trendData.jumpYear}</strong>, a sharper satellite (<strong className="text-[#F2EFE9]">VIIRS</strong>) launched with{' '}
                <strong className="text-[#F2EFE9]">{trendData.sensorPixelAreaRatio}</strong>. It spotted small fires the old camera missed.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-dotted border-[#26262B] text-[11px] font-mono-numbers text-[#9A8F85]">
              Result: A fake spike (<JargonTooltip term="2012 artifact jump">2012 artifact jump</JargonTooltip>)
            </div>
          </div>

          {/* Card 2: Raw vs Fixed */}
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono-numbers uppercase text-[#FC5000] font-bold">
                  2. Raw vs Fixed
                </span>
                <span className="text-[10px] font-mono-numbers text-[#9A8F85]">
                  {regionBlock.regionName} ({jumpYearEntry.year})
                </span>
              </div>
              <div className="text-[13px] font-sans font-semibold text-[#F2EFE9] mb-1">
                <JargonTooltip term="Raw">Raw</JargonTooltip> vs{' '}
                <JargonTooltip term="Fixed">Fixed</JargonTooltip> Counts
              </div>
              <p className="text-[12px] font-sans text-[#9A8F85] leading-relaxed">
                <strong className="text-[#F2EFE9]">Raw</strong> is the unedited count straight from the satellites.{' '}
                <strong className="text-[#FC5000]">Fixed</strong> is the fair count after we adjust the sharper camera so every year is measured the same way.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-dotted border-[#26262B] flex items-center justify-between text-[11px] font-mono-numbers">
              <span className="text-[#8A8A93]">
                Raw: <strong className="text-[#F2EFE9]">{jumpYearEntry.raw.toLocaleString()}</strong>
              </span>
              <span className="text-[#FC5000]">
                Fixed: <strong>{jumpYearEntry.fixed.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* Card 3: What Delta Means */}
          <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono-numbers uppercase text-[#FC5000] font-bold">
                  3. What “Delta” Means
                </span>
                <span className="text-[10px] font-mono-numbers text-[#9A8F85]">
                  Raw − Fixed
                </span>
              </div>
              <div className="text-[13px] font-sans font-semibold text-[#F2EFE9] mb-1">
                Delta = The Camera Gap
              </div>
              <p className="text-[12px] font-sans text-[#9A8F85] leading-relaxed">
                <strong className="text-[#F2EFE9]">Delta</strong> simply means the difference between <strong className="text-[#F2EFE9]">Raw</strong> and <strong className="text-[#FC5000]">Fixed</strong>. It shows how many extra heat spots were subtracted so the new camera doesn’t unfairly inflate the trend.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-dotted border-[#26262B] flex items-center justify-between text-[11px] font-mono-numbers">
              <span className="text-[#9A8F85]">In {jumpYearEntry.year}:</span>
              <span className="text-[#F2EFE9] font-bold">
                -{jumpYearDelta.toLocaleString()} adjusted
              </span>
            </div>
          </div>

          {/* Card 4: How to read FIRE CA-2020-0094 (39.94°N, 123.01°W) */}
          {sampleFire && (
            <div className="bg-[#0A0A0C] p-3.5 rounded-[16px] border border-dotted border-[#26262B] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono-numbers uppercase text-[#3FD0C9] font-bold">
                    4. How to Read a Fire Code
                  </span>
                  <span className="text-[10px] font-mono-numbers text-[#9A8F85]">
                    {sampleFire.id.toUpperCase()}
                  </span>
                </div>
                <div className="text-[12px] font-mono-numbers font-bold text-[#F2EFE9] mb-1 truncate">
                  FIRE {sampleFire.id.toUpperCase()} ({Math.abs(sampleFire.lat).toFixed(2)}°{sampleFire.lat >= 0 ? 'N' : 'S'}, {Math.abs(sampleFire.lon).toFixed(2)}°{sampleFire.lon >= 0 ? 'E' : 'W'})
                </div>
                <p className="text-[12px] font-sans text-[#9A8F85] leading-relaxed">
                  <strong className="text-[#F2EFE9]">{sampleFire.id.toUpperCase()}</strong> is the region code + year (<strong className="text-[#F2EFE9]">{sampleFire.year}</strong>) + fire number. The numbers in parentheses are exact GPS coordinates on Earth where satellites tracked it for <strong className="text-[#F2EFE9]">{sampleFire.durationDays} days</strong>.
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-dotted border-[#26262B] flex items-center justify-between text-[11px] font-mono-numbers text-[#3FD0C9]">
                <span className="truncate">{sampleFire.name.split(' (')[0]}</span>
                <span>{sampleFire.cellDays.toLocaleString()} grid-days</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
