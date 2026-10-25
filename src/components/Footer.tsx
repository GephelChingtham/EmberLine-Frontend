/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0C] py-16 border-t border-dotted border-[#26262B]">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Minimal Footer Row: Logo, GitHub, Team, One line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-dotted border-[#26262B]">
          
          <div className="flex items-center gap-2.5">
            <div className="w-[10px] h-[10px] rounded-full bg-[#FC5000]" aria-hidden="true"></div>
            <span className="font-headline text-[24px] tracking-[0.04em] text-[#F2EFE9] leading-none uppercase">
              Emberline
            </span>
            <span className="text-[#26262B] ml-2">·</span>
            <span className="text-[13px] font-mono-numbers text-[#8A8A93]">
              By Two Orbits
            </span>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-mono-numbers">
            <a
              href="https://github.com/mehrunisha1011/emberline"
              target="_blank"
              rel="noreferrer"
              className="text-[#8A8A93] hover:text-[#FC5000] transition-colors"
            >
              GitHub: mehrunisha1011/emberline →
            </a>
          </div>

        </div>

        {/* NASA FIRMS Credit & One Line */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12px] font-mono-numbers text-[#8A8A93]">
          <div>
            Wildfire observation data courtesy of NASA FIRMS (MODIS 1km & VIIRS 375m).
          </div>
          <div className="text-[#8A8A93]">
            Two satellites, one continuous fire timeline.
          </div>
        </div>

      </div>
    </footer>
  );
}
