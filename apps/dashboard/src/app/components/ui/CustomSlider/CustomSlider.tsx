import { useRef, useState, useEffect } from 'react';

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number; // <--- added
  className?: string;
}

export default function CustomSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1, // <--- default step
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
    const rawValue = newPercent * (max - min) + min;

    // apply step rounding
    const steppedValue = Math.round(rawValue / step) * step;

    const newValue = Math.min(max, Math.max(min, steppedValue));

    onChange(newValue);
  };

  const handleMouseMove = (e: MouseEvent) => dragging && updateValue(e.clientX);
  const handleTouchMove = (e: TouchEvent) =>
    dragging && updateValue(e.touches[0].clientX);

  useEffect(() => {
    const stop = () => setDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stop);

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', stop);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stop);

      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', stop);
    };
  }, [dragging]);

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 w-full bg-neutral-300 dark:bg-neutral-700 rounded-full cursor-pointer select-none ${className}`}
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
          absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2
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
