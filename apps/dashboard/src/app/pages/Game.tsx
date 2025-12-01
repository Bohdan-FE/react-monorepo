import { useEffect, useRef, useState } from 'react';
import { CircleDrawer } from '@acme/ui';
import CustomSlider from '../components/ui/CustomSlider/CustomSlider';

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<CircleDrawer[]>([]);
  const mouseCircleRef = useRef<CircleDrawer>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    mouseCircleRef.current = new CircleDrawer(context!, {
      x: 0,
      y: 0,
      radius: 2,
      percentage: 0,
      color: 'black',
      lineWidth: 12,
      mass: 1000,
    });

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resizeCanvas();

    if (context) {
      startLoop(context);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const draw = (ctx: CanvasRenderingContext2D) => {
    circlesRef.current.forEach((c) => c.draw());
    mouseCircleRef.current?.draw();
  };

  const startLoop = (ctx: CanvasRenderingContext2D) => {
    const update = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      draw(ctx);
      mousePhysic();

      circlePhysic();
      gravityPhysic();
      requestAnimationFrame(update);
    };
    update();
  };

  const gravityPhysic = () => {
    const GRAVITY = 0.05;
    const FRICTION = 0.99;
    const ROTATION_FRICTION = 0.8;
    const BOUNCE = 0.7;

    const ctx = contextRef.current;
    if (!ctx) return;

    circlesRef.current.forEach((obj) => {
      // --- Гравитация ---
      obj.VY += GRAVITY * obj.Mass;

      // --- Трение движения ---
      obj.VX *= FRICTION;
      obj.VY *= FRICTION;

      // --- Обновление позиции ---
      obj.update({
        x: obj.X + obj.VX,
        y: obj.Y + obj.VY,
      });

      // --- Вращение ---
      obj.AngularVelocity *= ROTATION_FRICTION;
      obj.Angle += obj.AngularVelocity;

      // --- Столкновения со стенами ---
      const bottom = ctx.canvas.height;
      const right = ctx.canvas.width;

      // Низ
      if (obj.Y + obj.Radius > bottom) {
        obj.update({ y: bottom - obj.Radius });
        obj.VY *= -BOUNCE;
        obj.AngularVelocity += (obj.VX / obj.Radius) * 0.2;
      }

      // Верх
      if (obj.Y - obj.Radius < 0) {
        obj.update({ y: obj.Radius });
        obj.VY *= -BOUNCE;
        obj.AngularVelocity += (obj.VX / obj.Radius) * 0.2;
      }

      // Лево
      if (obj.X - obj.Radius < 0) {
        obj.update({ x: obj.Radius });
        obj.VX *= -BOUNCE;
        obj.AngularVelocity += (obj.VY / obj.Radius) * 0.2;
      }

      // Право
      if (obj.X + obj.Radius > right) {
        obj.update({ x: right - obj.Radius });
        obj.VX *= -BOUNCE;
        obj.AngularVelocity += (obj.VY / obj.Radius) * 0.2;
      }
    });
  };

  const circlePhysic = () => {
    const circles = circlesRef.current;

    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const c1 = circles[i];
        const c2 = circles[j];

        const dx = c2.X - c1.X;
        const dy = c2.Y - c1.Y;
        const dist = Math.hypot(dx, dy);
        const minDist = c1.Radius + c2.Radius;

        if (dist < minDist && dist > 0) {
          // --- Нормаль ---
          const nx = dx / dist;
          const ny = dy / dist;

          // --- Улучшенная коррекция перекрытия (без дрожания) ---
          const percent = 0.3; // сила коррекции
          const slop = 0.5; // допуск
          const overlap = Math.max(minDist - dist - slop, 0) * percent;

          const totalMass = c1.Mass + c2.Mass;
          const move1 = overlap * (c2.Mass / totalMass);
          const move2 = overlap * (c1.Mass / totalMass);

          c1.update({
            x: c1.X - nx * move1,
            y: c1.Y - ny * move1,
          });
          c2.update({
            x: c2.X + nx * move2,
            y: c2.Y + ny * move2,
          });

          // --- Линейная скорость по нормали ---
          const m1 = c1.Mass;
          const m2 = c2.Mass;
          const e = 0.9; // 0–1 упругость

          const v1 = c1.VX * nx + c1.VY * ny;
          const v2 = c2.VX * nx + c2.VY * ny;

          const newV1 = (v1 * (m1 - e * m2) + (1 + e) * m2 * v2) / (m1 + m2);
          const newV2 = (v2 * (m2 - e * m1) + (1 + e) * m1 * v1) / (m1 + m2);

          c1.VX += (newV1 - v1) * nx;
          c1.VY += (newV1 - v1) * ny;
          c2.VX += (newV2 - v2) * nx;
          c2.VY += (newV2 - v2) * ny;

          // --- Касательная сила (трение + вращение) ---
          const tx = -ny;
          const ty = nx;

          const rvx = c2.VX - c1.VX;
          const rvy = c2.VY - c1.VY;
          const relTangent = rvx * tx + rvy * ty;

          const I1 = 0.5 * m1 * c1.Radius ** 2;
          const I2 = 0.5 * m2 * c2.Radius ** 2;

          const Jt =
            -relTangent /
            (1 / m1 + 1 / m2 + c1.Radius ** 2 / I1 + c2.Radius ** 2 / I2);

          c1.VX -= (Jt * tx) / m1;
          c1.VY -= (Jt * ty) / m1;
          c2.VX += (Jt * tx) / m2;
          c2.VY += (Jt * ty) / m2;

          c1.AngularVelocity -= (Jt * c1.Radius) / I1;
          c2.AngularVelocity += (Jt * c2.Radius) / I2;

          // --- Дампинг после столкновения ---
          c1.VX *= 0.98;
          c1.VY *= 0.98;
          c2.VX *= 0.98;
          c2.VY *= 0.98;

          c1.AngularVelocity *= 0.98;
          c2.AngularVelocity *= 0.98;
        }
      }
    }

    // --- Финальная стабилизация (убирает дрожание) ---
    circles.forEach((c) => {
      if (Math.abs(c.VX) < 0.01) c.VX = 0;
      if (Math.abs(c.VY) < 0.01) c.VY = 0;
      if (Math.abs(c.AngularVelocity) < 0.01) c.AngularVelocity = 0;
    });
  };

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
      const dx = c.X - mousePosition.current.x;
      const dy = c.Y - mousePosition.current.y;
      const dist = Math.hypot(dx, dy);
      const minDist = c.Radius + mouseCircleRef.current!.Radius;
      if (dist < minDist && dist > 0) {
        // normalize vector (dx, dy)
        const nx = dx / dist;
        const ny = dy / dist;
        // how much overlap
        const overlap = (minDist - dist) * 0.5;
        // push the circle away by overlap
        c.update({ x: c.X + nx * overlap, y: c.Y + ny * overlap });
        c.VX = c.VX + nx * overlap;
        c.VY = c.VY + ny * overlap;
      }
    });
  };

  const addCircle = ({
    imageUrl,
    mass,
  }: {
    imageUrl: string;
    mass: number;
  }) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    const circle = new CircleDrawer(ctx, {
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 2,
      radius: 30 + Math.random() * 30,
      percentage: 1,
      color: 'black',
      imageUrl,
      fillColor: 'white',
      mass,
    });
    circlesRef.current.push(circle);
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute z-[1] top-4 right-4 bg-orange rounded-2xl shadow-big w-[18rem] p-4">
        <SelectCharacter addCircle={addCircle} />
      </div>
      <canvas
        onMouseMove={mouseMove}
        className="w-full h-full"
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default Game;

const SelectCharacter = ({
  addCircle,
}: {
  addCircle: ({ imageUrl, mass }: { imageUrl: string; mass: number }) => void;
}) => {
  const avatars = [
    '/characters/ino-avatar.jpg',
    '/characters/itachi-avatar.jpg',
    '/characters/jiraja-avatar.png',
    '/characters/kabuto-avatar.jpg',
    '/characters/kakasi-avatar.jpg',
    '/characters/naruto-avatar.png',
    '/characters/pain-avatar.png',
    '/characters/sakura-avatar.png',
    '/characters/tamari-avatar.jpg',
    '/characters/tenten-avatar.png',
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mass, setMass] = useState(1); // новое состояние массы

  const prevAvatar = () => {
    setSelectedIndex((prev) => (prev === 0 ? avatars.length - 1 : prev - 1));
  };

  const nextAvatar = () => {
    setSelectedIndex((prev) => (prev === avatars.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circle Avatar */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
        <img
          src={avatars[selectedIndex]}
          alt="selected avatar"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Arrows */}
      <div className="flex items-center space-x-8">
        <button
          onClick={prevAvatar}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &#8592;
        </button>
        <button
          onClick={nextAvatar}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &#8594;
        </button>
      </div>

      {/* Mass Slider */}
      <div className="flex flex-col items-center space-y-2 w-full">
        <p className="text-gray-700 font-medium">Weight: {mass}</p>

        <CustomSlider
          value={mass}
          onChange={setMass}
          min={1}
          max={10}
          className="w-full"
        />
      </div>

      {/* Add Button */}
      <button
        onClick={() =>
          addCircle({
            imageUrl: avatars[selectedIndex],
            mass,
          })
        }
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Character
      </button>
    </div>
  );
};
