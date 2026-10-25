/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function PlainWordsStrip() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 py-12">
      <div className="bg-[#131316] rounded-[32px] p-8 sm:p-10 border border-dotted border-[#26262B]">
        
        {/* Slim Header Label */}
        <div className="text-[11px] font-mono-numbers uppercase text-[#FC5000] tracking-widest font-semibold mb-6">
          In plain words
        </div>

        {/* 3 short lines, side by side on desktop, lots of spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          
          <div className="flex flex-col justify-start">
            <p className="text-[16px] font-sans font-medium text-[#F2EFE9] leading-relaxed">
              Satellites count fires from space. We have 20+ years of them.
            </p>
          </div>

          <div className="flex flex-col justify-start">
            <p className="text-[16px] font-sans font-medium text-[#F2EFE9] leading-relaxed">
              In 2012, a sharper satellite joined. It could see small fires the old one missed.
            </p>
          </div>

          <div className="flex flex-col justify-start">
            <p className="text-[16px] font-sans font-medium text-[#F2EFE9] leading-relaxed">
              So the count jumped, but the fires were always there. We adjust the numbers so every year is fair.
            </p>
          </div>

        </div>

        {/* Under it: one muted line */}
        <div className="pt-6 border-t border-dotted border-[#26262B]">
          <p className="text-[14px] font-sans text-[#8A8A93] italic">
            “Like swapping a blurry camera for a sharp one: you suddenly see more stars. The stars were always there.”
          </p>
        </div>

      </div>
    </section>
  );
}
