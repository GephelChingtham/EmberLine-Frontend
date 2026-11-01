/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import validationData from '../data/validation.json';
import regionsData from '../data/regions.json';
import { JargonTooltip, PlainWordsLine } from './JargonTooltip';
import type { RegionId } from '../App';

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
  simpleView?: boolean;
}

export function ProofSection({
  selectedRegion,
  onSelectRegion,
  simpleView = false,
}: Props) {
  const regionVal =
    (validationData as any).byRegion?.[selectedRegion] || validationData;
  const activeRegionObj =
    regionsData.regions.find((r) => r.id === selectedRegion) ||
    regionsData.regions[0];

  const jumpBefore = regionVal.jumpBeforeFix;
  const jumpAfter = regionVal.jumpAfterFix;
  const burnedAreaShare =
    regionVal.burnedAreaMatchScore !== null &&
    regionVal.burnedAreaMatchScore !== undefined
      ? `${regionVal.burnedAreaMatchScore}%`
      : regionVal.burnedAreaStatus || 'Validation pending';

  return (
    <section
      id="proof"
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
            BEFORE AND AFTER THE FIX.
          </h2>
          <PlainWordsLine
            text="We’re checking our fix against real burned-area maps. Not finished yet."
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

      <p className="text-[14px] sm:text-[15px] font-sans text-[#8A8A93] mb-8">
        Measuring the 2012 camera shift in{' '}
        <strong className="text-[#F2EFE9]">
          {activeRegionObj.fullName || activeRegionObj.name}
        </strong>
        .
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-[#131316] p-6 sm:p-7 rounded-[24px] sm:rounded-[32px] border border-dotted border-[#26262B] flex flex-col justify-between">
          <div className="font-mono-numbers text-[clamp(36px,5.5vw,60px)] font-bold text-[#6E6E78] leading-none tracking-tight mb-5">
            {jumpBefore}
          </div>
          <div className="pt-3.5 border-t border-dotted border-[#26262B]">
            <div className="text-[14px] font-sans font-semibold text-[#F2EFE9] flex items-center gap-1.5">
              <JargonTooltip term="Raw">
                <span>Jump before fix</span>
              </JargonTooltip>
            </div>
            <p className="text-[12px] font-sans text-[#9A8F85] mt-1">
              How much raw fire counts jumped after the sharper 2012 satellite joined.
            </p>
          </div>
        </div>

        <div className="bg-[#131316] p-6 sm:p-7 rounded-[24px] sm:rounded-[32px] border border-dotted border-[#26262B] flex flex-col justify-between">
          <div className="font-mono-numbers text-[clamp(36px,5.5vw,60px)] font-bold text-[#FC5000] leading-none tracking-tight mb-5">
            {jumpAfter}
          </div>
          <div className="pt-3.5 border-t border-dotted border-[#26262B]">
            <div className="text-[14px] font-sans font-semibold text-[#F2EFE9] flex items-center gap-1.5">
              <JargonTooltip term="Fixed">
                <span>Jump after fix</span>
              </JargonTooltip>
            </div>
            <p className="text-[12px] font-sans text-[#9A8F85] mt-1">
              The remaining change after adjusting both satellites to the same standard.
            </p>
          </div>
        </div>

        <div className="bg-[#131316] p-6 sm:p-7 rounded-[24px] sm:rounded-[32px] border border-dotted border-[#26262B] flex flex-col justify-between">
          <div className="font-mono-numbers text-[clamp(24px,3.5vw,38px)] font-bold text-[#F2EFE9] leading-tight tracking-tight mb-5">
            {burnedAreaShare}
          </div>
          <div className="pt-3.5 border-t border-dotted border-[#26262B]">
            <div className="text-[14px] font-sans font-semibold text-[#F2EFE9]">
              Ground-truth burned area check
            </div>
            <p className="text-[12px] font-sans text-[#9A8F85] mt-1">
              Comparing our adjusted counts against real mapped burn perimeters.
            </p>
          </div>
        </div>
      </div>

      <div className="text-[11px] font-mono-numbers text-[#8A8A93]">
        Harmonized NASA FIRMS multi-sensor telemetry · Ground-truth perimeter audit in progress.
      </div>
    </section>
  );
}
