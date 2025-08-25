import { useEffect, useRef } from 'react';
import { CircleDrawer } from '@acme/ui';

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<{ circle: CircleDrawer; vx: number; vy: number }[]>(
    []
  );
  const mouseCircleRef = useRef<CircleDrawer>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    for (let i = 0; i < 4; i++) {
      const circle = new CircleDrawer(context!, {
        x: 60 * (i + 1),
        y: 100,
        radius: 40,
        percentage: 1,
        color: 'black',
      });
      circlesRef.current.push({ circle, vx: 0, vy: 0 });
    }
    mouseCircleRef.current = new CircleDrawer(context!, {
      x: 0,
      y: 0,
      radius: 20,
      percentage: 1,
      color: 'black',
      lineWidth: 12,
    });
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      if (context) {
        startLoop(context);
      }
    };
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resizeCanvas();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const draw = (ctx: CanvasRenderingContext2D) => {
    circlesRef.current.forEach((c) => c.circle.draw());
    mouseCircleRef.current?.draw();
  };

  const startLoop = (ctx: CanvasRenderingContext2D) => {
    const update = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      draw(ctx);
      circlesRef.current.forEach((c) =>
        c.circle.update({ y: c.circle.getY() + 0.5 })
      );
      mousePhysic();
      gravityPhysic();
      circlePhysic();
      requestAnimationFrame(update);
    };
    update();
  };

  const gravityPhysic = () => {
    const GRAVITY = 0.07; // pixels/frame²
    const FRICTION = 0.98; // damping on velocity

    const ctx = contextRef.current;
    if (!ctx) return;
    circlesRef.current.forEach((obj) => {
      obj.vy += GRAVITY; // gravity accelerates downward
      obj.vx *= FRICTION; // optional friction for horizontal
      obj.vy *= FRICTION; // optional damping for vertical

      obj.circle.update({
        x: obj.circle.getX() + obj.vx,
        y: obj.circle.getY() + obj.vy,
      });

      // floor collision
      if (obj.circle.getY() + obj.circle.getRadius() > ctx.canvas.height) {
        obj.circle.update({ y: ctx.canvas.height - obj.circle.getRadius() });
        obj.vy *= -0.7; // bounce effect
      }

      // walls
      if (obj.circle.getX() - obj.circle.getRadius() < 0) {
        obj.circle.update({ x: obj.circle.getRadius() });
        obj.vx *= -0.7;
      }
      if (obj.circle.getX() + obj.circle.getRadius() > ctx.canvas.width) {
        obj.circle.update({ x: ctx.canvas.width - obj.circle.getRadius() });
        obj.vx *= -0.7;
      }
    });
  };

  const circlePhysic = () => {
    circlesRef.current?.forEach((c1) => {
      circlesRef.current?.forEach((c2) => {
        const dx = c1.circle.getX() - c2.circle.getX();
        const dy = c1.circle.getY() - c2.circle.getY();
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = c1.circle.getRadius() + c2.circle.getRadius();
        if (distance < minDistance && distance > 0) {
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance * 0;
          c2.circle.update({
            x: c2.circle.getX() + nx * overlap * 0.2,
            y: c2.circle.getY() + ny * overlap * 0.2,
          });
          c2.vx += nx * overlap * 0.2;
          c2.vy += ny * overlap * 0.2;
        }
      });
    });
  };

  const mouseEnter = (e: React.MouseEvent) => {};

  const mouseMove = (e: React.MouseEvent) => {
    const offset = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - offset.x;
    const y = e.clientY - offset.y;
    mousePosition.current = { x, y };
  };

  const mousePhysic = () => {
    mouseCircleRef.current?.update({
      x: mousePosition.current.x,
      y: mousePosition.current.y,
    });
    circlesRef.current?.forEach((c) => {
      const dx = c.circle.getX() - mousePosition.current.x;
      const dy = c.circle.getY() - mousePosition.current.y;
      const dist = Math.hypot(dx, dy);

      const minDist =
        c.circle.getRadius() + mouseCircleRef.current!.getRadius();

      if (dist < minDist && dist > 0) {
        // normalize vector (dx, dy)
        const nx = dx / dist;
        const ny = dy / dist;

        // how much overlap
        const overlap = minDist - dist;
        // push the circle away by overlap
        c.circle.update({
          x: c.circle.getX() + nx * overlap,
          y: c.circle.getY() + ny * overlap,
        });
        c.vx += nx * overlap;
        c.vy += ny * overlap;
      }
    });
  };

  return (
    <div className="w-full h-full bg-green-100">
      <canvas
        onMouseEnter={mouseEnter}
        onMouseMove={mouseMove}
        className="w-full h-full"
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default Game;
