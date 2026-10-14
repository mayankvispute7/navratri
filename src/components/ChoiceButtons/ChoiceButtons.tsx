import { useCallback, useRef, useState } from 'react';
import './ChoiceButtons.css';

interface ChoiceButtonsProps {
  onYes: () => void;
  onNo: () => void;
  yesScale: number;
  disabled: boolean;
  noLocked?: boolean;
}

export default function ChoiceButtons({
  onYes,
  onNo,
  yesScale,
  disabled,
}: ChoiceButtonsProps) {
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const lastDodgeTimeRef = useRef(0);
  const dodgeStepRef = useRef(0);

  /** Generate an offset that clearly moves the button away every time */
  const dodgeNo = useCallback(() => {
    dodgeStepRef.current += 1;
    const step = dodgeStepRef.current;

    // Movement bounds within proposal section
    const boundX = 120;
    const boundY = 50;

    // Alternating angle quadrants so consecutive dodges jump far across
    const angles = [
      Math.PI * 0.25,  // top-right
      Math.PI * 1.15,  // bottom-left
      Math.PI * 0.8,   // top-left
      Math.PI * 1.85,  // bottom-right
      Math.PI * 0.5,   // top
      Math.PI * 1.5,   // bottom
      Math.PI * 0.95,  // left
      Math.PI * 0.05,  // right
    ];

    const baseAngle = angles[step % angles.length];
    const angle = baseAngle + (Math.random() - 0.5) * 0.25;
    const distance = 70 + Math.random() * 45;

    let targetX = Math.cos(angle) * distance;
    let targetY = Math.sin(angle) * distance;

    targetX = Math.max(-boundX, Math.min(boundX, targetX));
    targetY = Math.max(-boundY, Math.min(boundY, targetY));

    setNoOffset({ x: targetX, y: targetY });
  }, []);

  /** Handle NO interaction — dodge + trigger reaction every time */
  const handleNoInteraction = useCallback(() => {
    if (disabled) return;

    const now = Date.now();
    // 130ms debounce prevents event flooding while allowing immediate repeat dodges
    if (now - lastDodgeTimeRef.current < 130) return;
    lastDodgeTimeRef.current = now;

    dodgeNo();
    onNo();
  }, [disabled, dodgeNo, onNo]);

  /** Desktop: trigger on pointer enter or pointer move approach */
  const handlePointerEnter = useCallback(() => {
    handleNoInteraction();
  }, [handleNoInteraction]);

  /** Mobile: trigger on tap/click */
  const handleNoClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      handleNoInteraction();
    },
    [handleNoInteraction],
  );



  return (
    <div className="choice-buttons">
      <button
        id="btn-yes"
        className="choice-buttons__yes"
        onClick={onYes}
        disabled={disabled}
        style={{
          transform: `scale(${yesScale})`,
        }}
        aria-label="Yes, I will dance Garba with you"
      >
        YES ❤️
      </button>

      {!disabled && (
        <button
          id="btn-no"
          className="choice-buttons__no"
          onPointerEnter={handlePointerEnter}
          onPointerOver={handlePointerEnter}
          onMouseEnter={handlePointerEnter}
          onMouseMove={handlePointerEnter}
          onPointerMove={handlePointerEnter}
          onClick={handleNoClick}
          style={{
            transform: `translate(${noOffset.x}px, ${noOffset.y}px)`,
          }}
          aria-label="No, I won't dance Garba"
        >
          NO 🙈
        </button>
      )}
    </div>
  );
}
