import { RefObject, useEffect, useRef } from 'react';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

export const useFlip = ({
  customElement,
  power,
}: {
  customElement?: RefObject<HTMLElement>;
  power?: number;
}) => {
  const ref = useRef<HTMLDivElement | null>(null); // Ensure the ref matches the expected type

  useEffect(() => {
    const card = customElement?.current || (ref.current as HTMLElement);
    const parent = card && card?.parentElement;
    if (parent) {
      parent.style.perspective = '93.75rem';
    }
    if (card) {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'all 0.3s ease';
    }
  }, []);

  function onMouseMove(
    element: HTMLElement,
    event: MouseEvent,
    level?: number,
  ): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = mouseX - rect.width / 2;
    const centerY = mouseY - rect.height / 2;
    const rotateX = (centerY / rect.height) * -(level ?? 10);
    const rotateY = (-centerX / rect.width) * -(level ?? 10);
    gsap.to(element, {
      duration: 1.5,
      rotateX: `${rotateX}deg`,
      rotateY: `${rotateY}deg`,
      ease: 'power3',
    });
  }

  useGSAP(() => {
    if (ref.current) {
      ref.current.addEventListener('mousemove', (event: MouseEvent) => {
        onMouseMove(ref.current as HTMLElement, event, power);
      });
    }
  });

  return ref; // Return the ref
};
