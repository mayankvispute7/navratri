import { useCallback, useMemo } from 'react';
import VideoCharacter from '../../components/VideoCharacter/VideoCharacter';
import ChoiceButtons from '../../components/ChoiceButtons/ChoiceButtons';
import Particles from '../../components/Particles/Particles';
import GoldenLight from '../../components/GoldenLight/GoldenLight';
import type { ProposalState, BoyEmotion, GirlEmotion } from '../../hooks/useProposalSequence';
import './ProposalSection.css';

/** Map boy emotion to video source */
const BOY_SRC_MAP: Record<BoyEmotion, string> = {
  happy: '/assest/video/boysmile.mp4',
  sad: '/assest/video/boysad.mp4',
  angry: '/assest/video/boyangry.mp4',
};

/** Map girl emotion to video source */
const GIRL_SRC_MAP: Record<GirlEmotion, string> = {
  smile: '/assest/video/grilsmile.mp4',
  shocked: '/assest/video/girlshock.mp4',
};

interface ProposalSectionProps {
  state: ProposalState;
  onYes: () => void;
  onNo: () => void;
  onBoyReactionEnd: () => void;
  onGirlReactionEnd: () => void;
  onGoldenLightComplete: () => void;
}

export default function ProposalSection({
  state,
  onYes,
  onNo,
  onBoyReactionEnd,
  onGirlReactionEnd,
  onGoldenLightComplete,
}: ProposalSectionProps) {
  const { phase, boyEmotion, girlEmotion, yesScale, noAttempts } = state;

  const isAccepted = phase === 'accepted' || phase === 'finale';
  const showGoldenLight = phase === 'accepted';

  // Unique keys to force re-mount on source change
  const boyKey = useMemo(() => `boy-${boyEmotion}-${noAttempts}`, [boyEmotion, noAttempts]);
  const girlKey = useMemo(() => `girl-${girlEmotion}-${noAttempts}`, [girlEmotion, noAttempts]);

  const handleBoyEnded = useCallback(() => {
    if (boyEmotion !== 'happy') {
      onBoyReactionEnd();
    }
  }, [boyEmotion, onBoyReactionEnd]);

  const handleGirlEnded = useCallback(() => {
    if (girlEmotion !== 'smile') {
      onGirlReactionEnd();
    }
  }, [girlEmotion, onGirlReactionEnd]);

  return (
    <section
      id="proposal"
      className={`proposal-section ${isAccepted ? 'proposal-section--accepted' : ''}`}
      aria-label="Garba proposal"
    >
      <Particles count={8} variant="crimson" />
      <GoldenLight active={showGoldenLight} onComplete={onGoldenLightComplete} />

      <div className="proposal-section__layout">
        {/* Boy character */}
        <div className={`proposal-section__character proposal-section__character--boy ${isAccepted ? 'proposal-section__character--center' : ''}`}>
          <VideoCharacter
            src={BOY_SRC_MAP[boyEmotion]}
            loop={boyEmotion === 'happy'}
            playKey={boyKey}
            ariaLabel={`Boy character — ${boyEmotion}`}
            onEnded={handleBoyEnded}
            className="proposal-section__video"
          />
        </div>

        {/* Center: Question + Buttons */}
        <div className={`proposal-section__center ${isAccepted ? 'proposal-section__center--hidden' : ''}`}>
          <h1 className="proposal-section__question">
            Mere sath Garba khelne aaogi na?
          </h1>

          <ChoiceButtons
            onYes={onYes}
            onNo={onNo}
            yesScale={yesScale}
            disabled={isAccepted}
          />
        </div>

        {/* Girl character */}
        <div className={`proposal-section__character proposal-section__character--girl ${isAccepted ? 'proposal-section__character--center' : ''}`}>
          <VideoCharacter
            src={GIRL_SRC_MAP[girlEmotion]}
            loop={girlEmotion === 'smile'}
            playKey={girlKey}
            ariaLabel={`Girl character — ${girlEmotion}`}
            onEnded={handleGirlEnded}
            className="proposal-section__video"
          />
        </div>
      </div>
    </section>
  );
}
