/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0C] py-12 sm:py-16 border-t border-dotted border-[#26262B]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dotted border-[#26262B]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FC5000]" aria-hidden="true" />
            <span className="font-headline text-[22px] tracking-[0.04em] text-[#F2EFE9] leading-none uppercase">
              Emberline
            </span>
            <span className="text-[12px] font-mono-numbers text-[#8A8A93] ml-2">
              By Two Orbits
            </span>
          </div>

          <div className="text-[12px] font-mono-numbers text-[#9A8F85]">
            Two satellites, one continuous fire timeline.
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] sm:text-[12px] font-mono-numbers text-[#8A8A93]">
          <div>
            Wildfire observation data courtesy of NASA FIRMS (MODIS 1km & VIIRS 375m).
          </div>
          <div className="text-[#8A8A93]">
            2000–2025 Harmonized Archive
          </div>
        </div>
      </div>
    </footer>
  );
}
