import { useRef, useState, useEffect } from 'react';

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function CustomSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  className = '',
}: CustomSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const percent = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = clientX - rect.left;

    x = Math.max(0, Math.min(x, rect.width));

    const newPercent = x / rect.width;
    const newValue = Math.round(newPercent * (max - min) + min);

    onChange(newValue);
  };

  const handleMouseMove = (e: MouseEvent) => dragging && updateValue(e.clientX);
  const handleTouchMove = (e: TouchEvent) =>
    dragging && updateValue(e.touches[0].clientX);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => setDragging(false));

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', () => setDragging(false));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', () => setDragging(false));

      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', () => setDragging(false));
    };
  }, [dragging]);

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 w-full bg-neutral-300 dark:bg-neutral-700 rounded-full cursor-pointer ${className}`}
      onMouseDown={(e) => updateValue(e.clientX)}
      onTouchStart={(e) => updateValue(e.touches[0].clientX)}
    >
      {/* Filled track */}
      <div
        className="absolute h-full bg-blue-500 rounded-full"
        style={{ width: `${percent}%` }}
      />

      {/* Thumb */}
      <div
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
        className="
          absolute top-1/2 -translate-y-1/2 transform
          w-5 h-5
          bg-white dark:bg-neutral-900
          border-4 border-blue-500
          rounded-full
          shadow-md
          cursor-grab active:cursor-grabbing
          transition-shadow duration-150
        "
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
