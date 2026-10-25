/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import validationData from '../data/validation.json';
import regionsData from '../data/regions.json';
import type { RegionId } from '../App';

interface Props {
  selectedRegion: RegionId;
  onSelectRegion: (r: RegionId) => void;
}

export function ProofSection({ selectedRegion, onSelectRegion }: Props) {
  const regionVal =
    (validationData as any).byRegion?.[selectedRegion] || validationData;
  const activeRegionObj =
    regionsData.regions.find((r) => r.id === selectedRegion) || regionsData.regions[0];

  const jumpBefore = regionVal.jumpBeforeFix;
  const jumpAfter = regionVal.jumpAfterFix;
  const burnedAreaShare =
    regionVal.burnedAreaMatchScore !== null && regionVal.burnedAreaMatchScore !== undefined
      ? `${regionVal.burnedAreaMatchScore}%`
      : regionVal.burnedAreaStatus || 'Validation pending';

  return (
    <section id="proof" className="w-full py-28 px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h2 className="font-headline text-[clamp(40px,6vw,72px)] leading-[0.94] text-[#F2EFE9] uppercase">
          BEFORE AND AFTER THE FIX.
        </h2>

        {/* Region Switcher */}
        <div className="flex items-center gap-1 bg-[#131316] p-1 rounded-full border border-dotted border-[#26262B]">
          {regionsData.regions.filter((r: any) => r.isReady).map((r: any) => (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r.id as RegionId)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono-numbers uppercase transition-all cursor-pointer ${
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

      <p className="text-[16px] font-sans font-medium text-[#8A8A93] mb-12">
        Three figures measuring the 2012 sensor shift in <strong className="text-[#F2EFE9]">{activeRegionObj.fullName || activeRegionObj.name}</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#131316] p-8 rounded-[36px] flex flex-col justify-between">
          <div className="font-mono-numbers text-[clamp(44px,6vw,68px)] font-bold text-[#6E6E78] leading-none tracking-tight mb-6">
            {jumpBefore}
          </div>
          <div className="pt-4 border-t border-dotted border-[#26262B]">
            <div className="text-[14px] font-sans font-semibold text-[#F2EFE9]">
              Jump before
            </div>
          </div>
        </div>

        <div className="bg-[#131316] p-8 rounded-[36px] flex flex-col justify-between">
          <div className="font-mono-numbers text-[clamp(44px,6vw,68px)] font-bold text-[#FC5000] leading-none tracking-tight mb-6">
            {jumpAfter}
          </div>
          <div className="pt-4 border-t border-dotted border-[#26262B]">
            <div className="text-[14px] font-sans font-semibold text-[#F2EFE9]">
              Jump after
            </div>
          </div>
        </div>

        <div className="bg-[#131316] p-8 rounded-[36px] flex flex-col justify-between">
          <div className="font-mono-numbers text-[clamp(28px,3.8vw,42px)] font-bold text-[#F2EFE9] leading-tight tracking-tight mb-6">
            {burnedAreaShare}
          </div>
          <div className="pt-4 border-t border-dotted border-[#26262B]">
            <div className="text-[14px] font-sans font-semibold text-[#F2EFE9]">
              Matches burned area
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] font-mono-numbers text-[#8A8A93]">
        Harmonized NASA FIRMS multi-sensor telemetry · Ground-truth perimeter audit in progress.
      </div>
    </section>
  );
}
