/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';

export const JARGON_GLOSSARY: Record<string, string> = {
  MODIS: 'The older satellite sensor (since 2000). It sees fires about 1 km wide.',
  VIIRS: 'The newer sensor (since 2012). It sees fires about 375 m wide.',
  Raw: 'The original count, uncorrected.',
  Fixed: 'The count after we make every year fair.',
  'Artifact jump': 'A jump caused by the instrument, not by the world.',
  'Sample data': 'Practice numbers, not real results.',
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

  // Handle click outside to close on mobile
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
      className={`relative inline-flex items-center gap-1.5 align-middle ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={`Learn more about ${term || 'this term'}`}
        className="w-3.5 h-3.5 rounded-full bg-[#1F1F24] border border-[#26262B] text-[#8A8A93] hover:text-[#F2EFE9] hover:border-[#8A8A93] text-[9px] font-mono inline-flex items-center justify-center transition-colors cursor-help leading-none select-none flex-shrink-0"
      >
        ?
      </button>

      {/* Popover Tooltip */}
      {isOpen && explanation && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 max-w-[85vw] p-2.5 bg-[#131316] border border-[#26262B] text-[#F2EFE9] rounded-[12px] shadow-2xl text-[12px] font-sans font-normal leading-relaxed pointer-events-none text-left"
        >
          {term && (
            <span className="font-mono-numbers text-[10px] text-[#FC5000] uppercase font-bold block mb-1">
              {term}
            </span>
          )}
          <span>{explanation}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#26262B]" />
        </span>
      )}
    </span>
  );
}
