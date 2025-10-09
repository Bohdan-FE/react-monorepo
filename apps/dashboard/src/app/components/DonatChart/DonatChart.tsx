import React, { useEffect, useRef, useMemo, useState } from 'react';

export interface DonutSlice {
  name: string;
  amount: number;
}

export interface DonutChartProps {
  data: DonutSlice[];
  donutThickness?: number; // thickness in rem
  animate?: boolean;
  centerLabel?: { title?: string; sub?: string } | null;
  formatAmount?: (value: number) => string;
  keepSquare?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data = [],
  donutThickness = 3, // default: 3rem
  animate = true,
  centerLabel = null,
  formatAmount,
  keepSquare = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

  const colors = useMemo(() => ['#fa7315', '#ec4899', '#3575df'], []);

  const { normalized, total } = useMemo(() => {
    const arr = data.map((s) => ({
      name: s.name,
      amount: Math.max(0, Number(s.amount) || 0),
    }));
    const total = arr.reduce((acc, x) => acc + x.amount, 0);
    if (total === 0)
      return {
        normalized: arr.map((x) => ({ ...x, percentage: 0 })),
        total: 0,
      };
    return {
      total,
      normalized: arr.map((x) => ({
        ...x,
        percentage: (x.amount / total) * 100,
      })),
    };
  }, [data]);

  // Convert rem → px
  const remToPx = (rem: number) => {
    if (typeof window === 'undefined') return rem * 16; // fallback SSR
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    canvas.width = width;
    canvas.height = height;

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 2;
    const thicknessPx = remToPx(donutThickness);
    const thickness = Math.max(8, Math.min(radius - 4, thicknessPx));

    let startAngle = -Math.PI / 2;
    const arcs = normalized.map((s, i) => {
      const angle = (s.percentage / 100) * Math.PI * 2;
      const a = {
        start: startAngle,
        end: startAngle + angle,
        color: colors[i % colors.length],
      };
      startAngle += angle;
      return a;
    });

    const duration = animate ? 600 : 0;
    const startTime = performance.now();

    const drawFrame = (now: number) => {
      const t = duration <= 0 ? 1 : Math.min(1, (now - startTime) / duration);
      ctx.clearRect(0, 0, width, height);

      for (const arc of arcs) {
        const end = arc.start + (arc.end - arc.start) * t;
        ctx.beginPath();
        ctx.arc(cx, cy, radius - thickness / 2, arc.start, end);
        ctx.lineWidth = thickness;
        ctx.lineCap = 'butt';
        ctx.strokeStyle = arc.color;
        ctx.stroke();
      }

      if (t < 1) requestAnimationFrame(drawFrame);
    };

    requestAnimationFrame(drawFrame);
  };

  // Handle container resize (responsive width)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const w = entry.contentRect.width;
        const h = keepSquare ? w : entry.contentRect.height;
        setCanvasSize({ width: w, height: h || w });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [keepSquare]);

  useEffect(() => {
    draw();
  }, [canvasSize, normalized, donutThickness, animate]);

  return (
    <div ref={containerRef} className="donut-wrap relative w-full inline-block">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: keepSquare ? 'auto' : '100%',
          display: 'block',
        }}
      />
      {centerLabel && (
        <div className="center-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          {centerLabel.title && (
            <div className="center-title font-bold text-base">
              {centerLabel.title}
            </div>
          )}
          {centerLabel.sub && (
            <div className="center-sub text-sm opacity-80">
              {centerLabel.sub}
            </div>
          )}
        </div>
      )}
      <div className="legend mt-2 flex flex-col gap-[6px] text-[13px]">
        {normalized.map((s, i) => (
          <div key={i} className="legend-item flex items-center gap-2">
            <span
              className="swatch inline-block w-[14px] h-[14px] rounded-[3px]"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span>
              {s.name}:{' '}
              {formatAmount
                ? formatAmount(s.amount)
                : s.amount.toLocaleString()}{' '}
              ({s.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
