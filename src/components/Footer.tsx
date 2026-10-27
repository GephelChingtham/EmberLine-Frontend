/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0C] py-12 border-t border-dotted border-[#26262B]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dotted border-[#26262B]">
          <div className="flex items-center gap-3">
            <span className="font-headline text-[24px] tracking-[0.04em] text-[#F2EFE9] leading-none uppercase">
              Emberline
            </span>
            <span className="text-[13px] font-mono-numbers text-[#8A8A93]">
              By Two Orbits
            </span>
          </div>

          <div className="text-[12px] font-mono-numbers text-[#9A8F85]">
            MODIS & VIIRS Multi-Sensor Fire Archive
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12px] font-mono-numbers text-[#8A8A93]">
          <div>
            Wildfire observation data courtesy of NASA FIRMS (MODIS & VIIRS).
          </div>
          <div className="text-[#8A8A93]">
            Two satellites, one continuous fire timeline.
          </div>
        </div>
      </div>
    </footer>
  );
}
