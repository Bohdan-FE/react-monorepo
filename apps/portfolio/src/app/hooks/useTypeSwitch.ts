import { useState, useEffect } from 'react';

export function useTypeLoop(
  text1: string,
  text2: string,
  speed = 100,
  pause = 1000
) {
  const [displayText, setDisplayText] = useState(text1);
  const [phase, setPhase] = useState<'deleting' | 'adding'>('deleting');
  const [currentTarget, setCurrentTarget] = useState(text1);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'deleting') {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText((prev: string) => prev.slice(0, -1));
        }, speed);
      } else {
        // switch target
        const next = currentTarget === text1 ? text2 : text1;
        setCurrentTarget(next);
        setPhase('adding');
      }
    }

    if (phase === 'adding') {
      if (displayText !== currentTarget) {
        const nextChar = currentTarget[displayText.length];
        timeout = setTimeout(() => {
          setDisplayText((prev: string) => prev + nextChar);
        }, speed);
      } else {
        // pause when full word is shown
        timeout = setTimeout(() => {
          setPhase('deleting');
        }, pause);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, phase, currentTarget, text1, text2, speed, pause]);

  return displayText;
}
