/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';

export const JARGON_GLOSSARY: Record<string, string> = {
  MODIS: 'The older NASA satellite sensor (2000). Blurrier, sees fires about 1 km wide.',
  VIIRS: 'The newer NASA sensor (2012). Sharper, sees fires about 375 m wide.',
  Raw: 'The original fire count, unadjusted.',
  Fixed: 'The count after correcting for the camera upgrade.',
  '2012 artifact jump': 'A fake spike caused by the better camera, not by more fires.',
  'Artifact jump': 'A fake spike caused by the better camera, not by more fires.',
  Detection: 'When a satellite spots heat that looks like a fire.',
  detection: 'When a satellite spots heat that looks like a fire.',
  Harmonization: 'Adjusting counts from different satellites so every year is judged on the same scale.',
  harmonization: 'Adjusting counts from different satellites so every year is judged on the same scale.',
};

interface JargonTooltipProps {
  term?: keyof typeof JARGON_GLOSSARY | string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function JargonTooltip({
  term,
  text,
  children,
  className = '',
}: JargonTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const explanation = text || (term ? JARGON_GLOSSARY[term] : '') || '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 align-baseline ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="underline decoration-dotted decoration-[#9A8F85]/70 underline-offset-4 cursor-help"
      >
        {children}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={`Definition for ${term || 'term'}`}
        className="w-3.5 h-3.5 rounded-full bg-[#1F1F24] border border-[#26262B] text-[#9A8F85] hover:text-[#F2EFE9] hover:border-[#9A8F85] text-[9px] font-mono inline-flex items-center justify-center transition-colors cursor-help leading-none select-none flex-shrink-0"
      >
        ?
      </button>

      {isOpen && explanation && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 max-w-[85vw] p-3 bg-[#131316] border border-[#26262B] text-[#F2EFE9] rounded-[12px] text-[12px] font-sans font-normal leading-relaxed pointer-events-none text-left"
        >
          {term && (
            <span className="font-mono-numbers text-[10px] text-[#FC5000] uppercase font-bold block mb-1">
              {term}
            </span>
          )}
          <span className="text-[#F2EFE9]">{explanation}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#26262B]" />
        </span>
      )}
    </span>
  );
}

interface PlainWordsLineProps {
  text: string;
  simpleView?: boolean;
  className?: string;
}

export function PlainWordsLine({ text, simpleView = false, className = '' }: PlainWordsLineProps) {
  return (
    <p
      className={`font-sans transition-all duration-200 ${
        simpleView
          ? 'text-[17px] sm:text-[20px] text-[#F2EFE9] font-medium leading-snug mt-2 mb-4'
          : 'text-[13px] sm:text-[14px] text-[#9A8F85] font-normal leading-relaxed mt-1.5 mb-3'
      } ${className}`}
    >
      <span
        className={`font-mono-numbers uppercase tracking-wider mr-2 ${
          simpleView
            ? 'text-[11px] text-[#FC5000] font-bold bg-[#FC5000]/10 px-2 py-0.5 rounded'
            : 'text-[11px] text-[#9A8F85] font-semibold'
        }`}
      >
        In plain words:
      </span>
      <span>{text}</span>
    </p>
  );
}
