/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmberlineHero } from './components/EmberlineHero';
import { PlainWordsStrip } from './components/PlainWordsStrip';
import { TheProblemSection } from './components/TheProblemSection';
import { TheFixSection } from './components/TheFixSection';
import { CaliforniaSection } from './components/CaliforniaSection';
import { ProofSection } from './components/ProofSection';
import { Footer } from './components/Footer';

export default function App() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F2EFE9] flex flex-col font-sans antialiased selection:bg-[#FC5000] selection:text-white">
      
      <main className="flex-1 w-full">
        {/* Section 1: Hero */}
        <EmberlineHero
          onExploreClick={() => scrollTo('the-fix')}
          onMethodClick={() => scrollTo('the-problem')}
          onCaliforniaClick={() => scrollTo('california')}
          onProofClick={() => scrollTo('proof')}
        />

        {/* Slim Strip: In plain words */}
        <PlainWordsStrip />

        {/* Section 2: The Problem */}
        <TheProblemSection />

        {/* Section 3: The Fix (Big Raw/Fixed toggle on trend graph - the demo moment) */}
        <TheFixSection />

        {/* Section 4: California (Daily calendar heatmap 2000-now + fire detail panel) */}
        <CaliforniaSection />

        {/* Section 5: Proof (Exactly 3 numbers: jump before fix, jump after fix, share matching burned area) */}
        <ProofSection />
      </main>

      {/* Footer: Method paragraph, NASA FIRMS credit, both GitHub links, team name */}
      <Footer />

    </div>
  );
}
