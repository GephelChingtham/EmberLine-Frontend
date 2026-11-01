/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface PlainWordsStripProps {
  simpleView?: boolean;
}

export function PlainWordsStrip({ simpleView = false }: PlainWordsStripProps) {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div
        className={`bg-[#131316] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border transition-colors ${
          simpleView
            ? 'border-[#FC5000]/50'
            : 'border-dotted border-[#26262B]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <span className="text-[11px] font-mono-numbers uppercase text-[#FC5000] tracking-widest font-semibold">
            In plain words · How this works
          </span>
          <span className="text-[12px] font-sans text-[#9A8F85]">
            30-second summary for everyone
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#0A0A0C] p-4 sm:p-5 rounded-[18px] border border-[#26262B]/60">
            <div className="font-mono-numbers text-[11px] text-[#FC5000] uppercase font-bold mb-1.5">
              01 · The Old Camera (2000)
            </div>
            <p className="text-[14px] sm:text-[15px] font-sans text-[#F2EFE9] leading-relaxed">
              NASA’s older satellite (<strong className="font-semibold">MODIS</strong>) took wider, blurrier snapshots. It caught big wildfires but missed smaller ones.
            </p>
          </div>

          <div className="bg-[#0A0A0C] p-4 sm:p-5 rounded-[18px] border border-[#26262B]/60">
            <div className="font-mono-numbers text-[11px] text-[#FC5000] uppercase font-bold mb-1.5">
              02 · The 2012 Upgrade
            </div>
            <p className="text-[14px] sm:text-[15px] font-sans text-[#F2EFE9] leading-relaxed">
              In 2012, a sharper satellite (<strong className="font-semibold">VIIRS</strong>) joined. Because its camera is 7× sharper, raw fire counts suddenly spiked.
            </p>
          </div>

          <div className="bg-[#0A0A0C] p-4 sm:p-5 rounded-[18px] border border-[#26262B]/60">
            <div className="font-mono-numbers text-[11px] text-[#FC5000] uppercase font-bold mb-1.5">
              03 · Our Fair Fix
            </div>
            <p className="text-[14px] sm:text-[15px] font-sans text-[#F2EFE9] leading-relaxed">
              Fires didn’t suddenly double overnight in 2012—the camera just got better. We adjust the numbers so all 25 years are judged fairly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
