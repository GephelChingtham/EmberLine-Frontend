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
  Harmonization: 'Adjusting data from two different cameras so every year is compared fairly.',
  Delta: 'How many extra fire counts were removed to fix the 2012 camera spike.',
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
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="border-b border-dotted border-[#8A8A93]/60 hover:border-[#FC5000] transition-colors cursor-help"
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
        className="w-4 h-4 rounded-full bg-[#1C1C21] border border-[#26262B] text-[#8A8A93] hover:text-[#F2EFE9] hover:border-[#FC5000] text-[10px] font-mono inline-flex items-center justify-center transition-colors cursor-help leading-none select-none flex-shrink-0"
      >
        ?
      </button>

      {isOpen && explanation && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 w-60 max-w-[82vw] p-3 bg-[#131316] border border-[#26262B] text-[#F2EFE9] rounded-[14px] text-[12px] font-sans font-normal leading-relaxed pointer-events-none text-left"
        >
          {term && (
            <span className="font-mono-numbers text-[10px] text-[#FC5000] uppercase font-bold block mb-1 tracking-wider">
              {term}
            </span>
          )}
          <span className="text-[#F2EFE9]/90 block">{explanation}</span>
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

export function PlainWordsLine({
  text,
  simpleView = false,
  className = '',
}: PlainWordsLineProps) {
  return (
    <p
      className={`font-sans transition-all duration-200 ${
        simpleView
          ? 'text-[16px] sm:text-[18px] text-[#F2EFE9] font-medium leading-snug mt-2'
          : 'text-[13px] sm:text-[14px] text-[#9A8F85] font-normal leading-relaxed mt-1.5'
      } ${className}`}
    >
      <span
        className={`font-mono-numbers uppercase tracking-wider mr-2 ${
          simpleView
            ? 'text-[11px] text-[#FC5000] font-bold bg-[#FC5000]/10 px-2 py-0.5 rounded-md'
            : 'text-[11px] text-[#9A8F85]/80 font-semibold'
        }`}
      >
        In plain words:
      </span>
      <span>{text}</span>
    </p>
  );
}
