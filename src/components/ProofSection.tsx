/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import regionsData from '../data/regions.json';
import trendData from '../data/trend.json';
import { getRegionValidation, getRegionMeta } from '../utils/regionData';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import type { RegionId } from '../App';

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  simpleView: boolean;
}

export function ProofSection({ selectedRegion, onSelectRegion, simpleView }: Props) {
  const regionVal = getRegionValidation(selectedRegion);
  const activeRegionObj = getRegionMeta(selectedRegion);

  const jumpBefore = regionVal.jumpBeforeFix;
  const jumpAfter = regionVal.jumpAfterFix;
  const burnedAreaShare =
    regionVal.burnedAreaMatchScore !== null && regionVal.burnedAreaMatchScore !== undefined
      ? `${regionVal.burnedAreaMatchScore}%`
      : regionVal.burnedAreaStatus || 'Validation pending';

  const pendingRegions = regionsData.regions.filter(
    (r: any) => r.status === 'pending' || !r.isReady
  );

  return (
    <section
      id="proof"
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
          BEFORE AND AFTER THE FIX.
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
        text="We’re checking our fix against real burned-area maps. Not finished yet."
      />

      <p className="text-[14px] sm:text-[15px] font-sans font-medium text-[#8A8A93] mb-6">
        Measuring the{' '}
        <JargonTooltip term="2012 artifact jump">
          <span className="text-[#F2EFE9]">{trendData.jumpYear} artifact jump</span>
        </JargonTooltip>{' '}
        in <strong className="text-[#F2EFE9]">{activeRegionObj.fullName || activeRegionObj.name}</strong>.
      </p>

      {/* Compact 3-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#131316] p-5 sm:p-6 rounded-[24px] border border-dotted border-[#26262B] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] block mb-2">
              <JargonTooltip term="Raw">
                <span>Raw Sensor Jump</span>
              </JargonTooltip>
            </span>
            <div className="font-mono-numbers text-[clamp(34px,4.8vw,54px)] font-bold text-[#6E6E78] leading-none tracking-tight mb-4">
              {jumpBefore}
            </div>
          </div>
          <div className="pt-3 border-t border-dotted border-[#26262B]">
            <div className="text-[13px] font-sans font-semibold text-[#F2EFE9]">
              Jump before
            </div>
            <p className="text-[12px] font-sans text-[#9A8F85] mt-1">
              How much fire counts appeared to jump in {trendData.jumpYear} before our fix.
            </p>
          </div>
        </div>

        <div className="bg-[#131316] p-5 sm:p-6 rounded-[24px] border border-dotted border-[#26262B] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono-numbers uppercase text-[#FC5000] block mb-2">
              <JargonTooltip term="Fixed">
                <span>Fixed (Harmonized) Jump</span>
              </JargonTooltip>
            </span>
            <div className="font-mono-numbers text-[clamp(34px,4.8vw,54px)] font-bold text-[#FC5000] leading-none tracking-tight mb-4">
              {jumpAfter}
            </div>
          </div>
          <div className="pt-3 border-t border-dotted border-[#26262B]">
            <div className="text-[13px] font-sans font-semibold text-[#F2EFE9]">
              Jump after
            </div>
            <p className="text-[12px] font-sans text-[#9A8F85] mt-1">
              The change after adjusting for the sharper <JargonTooltip term="VIIRS">VIIRS</JargonTooltip> camera.
            </p>
          </div>
        </div>

        <div className="bg-[#131316] p-5 sm:p-6 rounded-[24px] border border-dotted border-[#26262B] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono-numbers uppercase text-[#9A8F85] block mb-2">
              Ground-Truth Check
            </span>
            <div className="font-mono-numbers text-[clamp(24px,3.2vw,36px)] font-bold text-[#F2EFE9] leading-tight tracking-tight mb-4">
              {burnedAreaShare}
            </div>
          </div>
          <div className="pt-3 border-t border-dotted border-[#26262B]">
            <div className="text-[13px] font-sans font-semibold text-[#F2EFE9]">
              Matches burned area
            </div>
            <p className="text-[12px] font-sans text-[#9A8F85] mt-1">
              Comparison against mapped burn scars on the ground ({burnedAreaShare}).
            </p>
          </div>
        </div>
      </div>

      {/* Pending Regions Card showing "Coming soon." */}
      {pendingRegions.length > 0 && (
        <div className="bg-[#131316] p-4 rounded-[20px] border border-dotted border-[#26262B] mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono-numbers uppercase text-[#8A8A93]">
              Regions with status pending ({pendingRegions.map((r: any) => r.fullName || r.name).join(', ')}):
            </span>
            <span className="text-[11px] font-mono-numbers uppercase px-2 py-0.5 rounded bg-[#0A0A0C] text-[#9A8F85] border border-[#26262B]">
              {pendingRegions[0].badge}
            </span>
          </div>
          <PlainWordsLine
            simpleView={simpleView}
            text="Coming soon."
            className="!my-0"
          />
        </div>
      )}

      <div className="text-[11px] font-mono-numbers text-[#8A8A93]">
        Harmonized NASA FIRMS multi-sensor telemetry · Ground-truth perimeter audit in progress.
      </div>
    </section>
  );
}
