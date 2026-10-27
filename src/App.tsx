/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { EmberlineHero } from './components/EmberlineHero';
import { PlainWordsStrip } from './components/PlainWordsStrip';
import { TheProblemSection } from './components/TheProblemSection';
import { TheFixSection } from './components/TheFixSection';
import { CaliforniaSection } from './components/CaliforniaSection';
import { ProofSection } from './components/ProofSection';
import { Footer } from './components/Footer';
import regionsData from './data/regions.json';

export type RegionId =
  | 'california_west_us'
  | 'amazon'
  | 'australia'
  | 'canada_boreal'
  | 'india'
  | 'malaysia';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('california_west_us');
  const [simpleView, setSimpleView] = useState<boolean>(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeRegionObj =
    regionsData.regions.find((r) => r.id === selectedRegion) || regionsData.regions[0];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F2EFE9] flex flex-col font-sans antialiased selection:bg-[#FC5000] selection:text-white">
      <main className="flex-1 w-full">
        {/* Section 1: Hero */}
        <EmberlineHero
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          activeRegionName={activeRegionObj.name}
          simpleView={simpleView}
          onToggleSimpleView={() => setSimpleView((prev) => !prev)}
          onExploreClick={() => scrollTo('the-fix')}
          onMethodClick={() => scrollTo('the-problem')}
          onCaliforniaClick={() => scrollTo('california')}
          onProofClick={() => scrollTo('proof')}
        />

        {/* Simplified Guide Section for Normal People */}
        <PlainWordsStrip
          selectedRegion={selectedRegion}
          simpleView={simpleView}
          onToggleSimpleView={() => setSimpleView((prev) => !prev)}
        />

        {/* Section 2: The Problem */}
        <TheProblemSection
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          simpleView={simpleView}
        />

        {/* Section 3: The Fix */}
        <TheFixSection
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          simpleView={simpleView}
        />

        {/* Section 4: Daily Fire Archive */}
        <CaliforniaSection
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          simpleView={simpleView}
        />

        {/* Section 5: Proof */}
        <ProofSection
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          simpleView={simpleView}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
