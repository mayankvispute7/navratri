import { useCallback, useRef, useState } from 'react';

/* ── Proposal State Machine ──
 * States:
 *   idle       → default loops playing, NO is available
 *   reacting   → reaction clips playing, NO is locked out
 *   accepted   → YES clicked, transitioning to finale
 *   finale     → garba playing
 */

export type BoyEmotion = 'happy' | 'sad' | 'angry';
export type GirlEmotion = 'smile' | 'shocked';
export type ProposalPhase = 'idle' | 'reacting' | 'accepted' | 'finale';

export interface ProposalState {
  phase: ProposalPhase;
  boyEmotion: BoyEmotion;
  girlEmotion: GirlEmotion;
  noAttempts: number;
  yesScale: number;
}

const INITIAL_STATE: ProposalState = {
  phase: 'idle',
  boyEmotion: 'happy',
  girlEmotion: 'smile',
  noAttempts: 0,
  yesScale: 1,
};

const MAX_YES_SCALE = 1.35;
const YES_SCALE_INCREMENT = 0.08;

export function useProposalSequence() {
  const [state, setState] = useState<ProposalState>(INITIAL_STATE);
  const reactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAcceptedRef = useRef(false);

  /** Clean up any pending reaction reset timer */
  const clearReactionTimeout = useCallback(() => {
    if (reactionTimeoutRef.current !== null) {
      clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = null;
    }
  }, []);

  /** Called when the NO button is triggered (hover on desktop, tap on mobile).
   *  Allows repeating reactions every time NO is hovered/tapped. */
  const triggerNoReaction = useCallback((): boolean => {
    if (isAcceptedRef.current) return false;

    let triggered = false;
    setState((prev) => {
      // Only block if proposal was accepted or in finale
      if (prev.phase === 'accepted' || prev.phase === 'finale') return prev;

      const newAttempts = prev.noAttempts + 1;

      // Determine boy emotion: 1st → sad, 2nd → angry, then alternate
      let boyEmotion: BoyEmotion;
      if (newAttempts % 2 === 1) {
        boyEmotion = 'sad';
      } else {
        boyEmotion = 'angry';
      }

      triggered = true;
      return {
        phase: 'reacting',
        boyEmotion,
        girlEmotion: 'shocked',
        noAttempts: newAttempts,
        yesScale: Math.min(prev.yesScale + YES_SCALE_INCREMENT, MAX_YES_SCALE),
      };
    });

    return triggered;
  }, []);

  /** Called when reaction clips finish playing (via 'ended' event).
   *  Restores idle state with default loops. */
  const onReactionComplete = useCallback(() => {
    if (isAcceptedRef.current) return;
    clearReactionTimeout();

    setState((prev) => {
      if (prev.phase !== 'reacting') return prev;
      return {
        ...prev,
        phase: 'idle',
        boyEmotion: 'happy',
        girlEmotion: 'smile',
      };
    });
  }, [clearReactionTimeout]);

  /** Start a defensive fallback timer in case 'ended' never fires.
   *  Should be called after starting a reaction clip. */
  const startReactionFallback = useCallback((durationMs: number = 8000) => {
    clearReactionTimeout();
    reactionTimeoutRef.current = setTimeout(() => {
      if (!isAcceptedRef.current) {
        onReactionComplete();
      }
    }, durationMs);
  }, [clearReactionTimeout, onReactionComplete]);

  /** Called when YES is clicked. Takes priority over everything. */
  const acceptProposal = useCallback(() => {
    isAcceptedRef.current = true;
    clearReactionTimeout();

    setState((prev) => ({
      ...prev,
      phase: 'accepted',
      boyEmotion: 'happy',
      girlEmotion: 'smile',
    }));
  }, [clearReactionTimeout]);

  /** Called after the acceptance transition completes to show the finale. */
  const showFinale = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'finale',
    }));
  }, []);

  return {
    state,
    triggerNoReaction,
    onReactionComplete,
    startReactionFallback,
    acceptProposal,
    showFinale,
    isAccepted: isAcceptedRef,
  };
}
