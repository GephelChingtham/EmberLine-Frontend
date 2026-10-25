/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JargonTooltip } from './JargonTooltip';

export function SampleBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F28E]/10 border border-[#F5F28E]/30 text-[#F5F28E] font-mono-numbers text-[11px] font-semibold tracking-wider uppercase ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#F5F28E]"></span>
      <JargonTooltip term="Sample data">
        <span>SAMPLE DATA</span>
      </JargonTooltip>
    </span>
  );
}
