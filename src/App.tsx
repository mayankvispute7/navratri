import { useCallback, useRef, useState } from 'react';
import IntroLoader from './components/IntroLoader/IntroLoader';
import OpeningSection from './sections/OpeningSection/OpeningSection';
import ProposalSection from './sections/ProposalSection/ProposalSection';
import GarbaFinale from './sections/GarbaFinale/GarbaFinale';
import { useProposalSequence } from './hooks/useProposalSequence';
import './App.css';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const {
    state,
    triggerNoReaction,
    onReactionComplete,
    startReactionFallback,
    acceptProposal,
    showFinale,
  } = useProposalSequence();

  // Track which reaction clips have ended (boy and girl)
  const reactionEndCountRef = useRef(0);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  /** Handle YES click */
  const handleYes = useCallback(() => {
    acceptProposal();
  }, [acceptProposal]);

  /** Handle NO interaction */
  const handleNo = useCallback(() => {
    const triggered = triggerNoReaction();
    if (triggered) {
      reactionEndCountRef.current = 0;
      startReactionFallback(3500);
    }
  }, [triggerNoReaction, startReactionFallback]);

  /** Called when a boy reaction clip finishes */
  const handleBoyReactionEnd = useCallback(() => {
    reactionEndCountRef.current += 1;
    // Wait for both boy and girl to finish, or just proceed if one fires
    // We use a small timeout to allow both to fire closely
    setTimeout(() => {
      onReactionComplete();
    }, 100);
  }, [onReactionComplete]);

  /** Called when a girl reaction clip finishes */
  const handleGirlReactionEnd = useCallback(() => {
    reactionEndCountRef.current += 1;
    setTimeout(() => {
      onReactionComplete();
    }, 100);
  }, [onReactionComplete]);

  /** Golden light transition completes → show finale */
  const handleGoldenLightComplete = useCallback(() => {
    showFinale();
  }, [showFinale]);

  return (
    <div className="app">
      {/* Scene 0: Intro Loader */}
      <IntroLoader onComplete={handleIntroComplete} />

      {introComplete && (
        <>
          {/* Scene 1: Opening */}
          {state.phase !== 'finale' && <OpeningSection />}

          {/* Scene 2-4: Proposal */}
          {state.phase !== 'finale' && (
            <ProposalSection
              state={state}
              onYes={handleYes}
              onNo={handleNo}
              onBoyReactionEnd={handleBoyReactionEnd}
              onGirlReactionEnd={handleGirlReactionEnd}
              onGoldenLightComplete={handleGoldenLightComplete}
            />
          )}

          {/* Scene 5: Garba Finale */}
          {state.phase === 'finale' && <GarbaFinale />}
        </>
      )}
    </div>
  );
}
