/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import validationData from '../data/validation.json';
import { SampleBadge } from './SampleBadge';

export function ProofSection() {
  const jumpBefore = validationData.jumpBeforeFix;
  const jumpAfter = validationData.jumpAfterFix;
  const burnedAreaShare =
    validationData.burnedAreaMatchScore !== null
      ? `${validationData.burnedAreaMatchScore}%`
      : validationData.burnedAreaStatus || 'Validation pending';

  return (
    <section id="proof" className="w-full py-28 px-6 max-w-[1400px] mx-auto border-t border-dotted border-[#26262B]">
      
      {/* Header with 6-word headline & SAMPLE DATA badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h2 className="font-headline text-[clamp(40px,6vw,72px)] leading-[0.94] text-[#F2EFE9] uppercase">
          BEFORE AND AFTER THE FIX.
        </h2>
        {validationData.sample && <SampleBadge />}
      </div>

      {/* One-line statement */}
      <p className="text-[16px] font-sans font-medium text-[#8A8A93] mb-12">
        Three figures measuring the 2012 sensor shift.
      </p>

      {/* Exactly 3 Numbers in 3 Cards with 3-word max labels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Metric 1: Jump before */}
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

        {/* Metric 2: Jump after */}
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

        {/* Metric 3: Matches burned area */}
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

      {/* One small line */}
      <div className="text-[11px] font-mono-numbers text-[#8A8A93]">
        Provisional sample data · Final ground-truth perimeter audit in progress.
      </div>

    </section>
  );
}
