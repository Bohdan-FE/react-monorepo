import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-shape';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Fire from '../Fire/Fire';
import { MouseFollowContainer } from '@acme/ui';
import Portal from '../Portal/Portal';
import { TaskAmount } from '../../../hooks/useTaskAmount';
import { useStore } from '../../../store/store';

const padding = {
  top: 20,
  bottom: 20,
  left: 30,
  right: 30,
};

type Point = { x: number; y: number; data?: TaskAmount };

function Graph({ points }: { points: Point[] }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const setDate = useStore((state) => state.setDate);

  const [linePath, setLinePath] = useState('');
  const [areaPath, setAreaPath] = useState('');
  const [scaledPoints, setScaledPoints] = useState<Point[]>([]);

  const narutoRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const areaPathRef = useRef<SVGPathElement | null>(null);

  const kunaiRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paperBombRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const explosionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observer = useRef<ResizeObserver | null>(null);
  const gsapContext = useRef<gsap.Context | null>(null);

  const updateGraph = (width: number, height: number) => {
    if (!points.length) return;

    const maxY = Math.max(...points.map((p) => p.y));
    const maxX = Math.max(...points.map((p) => p.x));

    const scaled = points.map((p) => ({
      x: padding.left + (p.x / maxX) * (width - padding.left - padding.right),
      y:
        padding.top +
        (1 - p.y / maxY) * (height - padding.top - padding.bottom),
      data: p.data,
    }));

    const line = d3
      .line<Point>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5));

    const area = d3
      .area<Point>()
      .x((d) => d.x)
      .y0(height)
      .y1((d) => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5));

    setScaledPoints(scaled);
    setLinePath(line(scaled) || '');
    setAreaPath(area(scaled) || '');
  };

  // ----------------------------
  // RESIZE OBSERVER
  // ----------------------------
  useEffect(() => {
    if (!wrapperRef.current) return;

    observer.current?.disconnect();
    observer.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateGraph(width, height);
      }
    });
    observer.current.observe(wrapperRef.current);

    return () => observer.current?.disconnect();
  }, [points]);

  // ----------------------------
  // ANIMATIONS
  // ----------------------------
  useGSAP(() => {
    if (
      !pathRef.current ||
      !areaPathRef.current ||
      !narutoRef.current ||
      !linePath
    )
      return;

    gsapContext.current?.revert(); // cleanup old animations

    gsapContext.current = gsap.context(() => {
      // Naruto run setup
      gsap.set(narutoRef.current, {
        transformOrigin: '100% 100%',
        xPercent: -100,
        yPercent: -100,
        opacity: 1,
      });

      gsap.from(pathRef.current, {
        duration: 5,
        drawSVG: 0,
        ease: 'none',
      });

      gsap.fromTo(
        areaPathRef.current,
        { clipPath: 'polygon(0 0, 0% 0%, 0% 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)',
          duration: 5,
          ease: 'none',
        }
      );

      if (pathRef.current) {
        gsap.to(narutoRef.current, {
          motionPath: {
            path: pathRef.current,
            align: pathRef.current,
            autoRotate: true,
          },
          duration: 5,
          ease: 'none',
          onComplete: () => {
            gsap.set(narutoRef.current, { opacity: 0 });
          },
        });
      }

      // Kunai setup + explosions
      kunaiRefs.current.forEach((el, i) => {
        if (!el) return;
        const angleDeg = -Math.random() * 180;
        const angleRad = (angleDeg * Math.PI) / 180;
        const distance = 25;
        const xOffset = distance * Math.cos(angleRad);
        const yOffset = distance * Math.sin(angleRad);
        const angleDegBomb =
          angleDeg < -90 ? -45 - angleDeg - 360 : -45 - angleDeg;

        gsap.set(el, {
          transform: `translate3d(${xOffset + 2}rem, ${
            yOffset - 2
          }rem, 0) rotate(${angleDeg + 45}deg)`,
        });

        const bomb = paperBombRefs.current[i];
        if (bomb) {
          gsap.set(bomb, {
            transform: `translate(-55%, 0%) rotate(${angleDegBomb}deg)`,
          });
          bomb.setAttribute('data-angle-bomb', angleDegBomb.toString());
        }
      });

      gsap.to(kunaiRefs.current, {
        display: 'block',
        duration: 0.5,
        delay: 0.6,
        ease: 'none',
        translateY: '-65%',
        translateX: '31%',
        stagger: 0.7,
        opacity: 1,
      });

      // Paper bomb + explosion sequence
      const bombs = gsap.utils.toArray('.paper_bomb') as HTMLElement[];
      bombs.forEach((el, i) => {
        const angle = el.getAttribute('data-angle-bomb') ?? '-45';
        const tl = gsap.timeline({
          delay: 1.1 + i * 0.7,
        });

        tl.fromTo(
          el,
          { rotate: '-135deg' },
          {
            rotate: `${angle}deg`,
            duration: 2.5,
            ease: 'elastic.out(1, 0.3)',
          }
        ).to(el, {
          height: 0,
          duration: 2.5,
          ease: 'none',
          onStart: () => {
            gsap.to('.fire', { opacity: 1 });
          },
          onComplete: () => {
            const explosion = explosionRefs.current[i];
            if (explosion) {
              gsap.to(explosion, {
                opacity: 1,
                display: 'block',
                duration: 0.2,
              });
              gsap.to(explosion, {
                display: 'none',
                delay: 0.5,
              });
            }

            const dot = dotsRef.current[i];
            if (dot) {
              gsap.to(dot, {
                display: 'block',
                opacity: 1,
                duration: 0.5,
              });
            }

            const kunai = kunaiRefs.current[i];
            if (kunai) kunai.style.display = 'none';
          },
        });
      });
    }, wrapperRef);

    return () => gsapContext.current?.revert();
  }, [points, linePath]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative">
      {/* Naruto */}
      <div ref={narutoRef} className="absolute opacity-0">
        <img
          src="/running-naruto.gif"
          alt="Naruto"
          className="w-12 border block translate-y-[18%]"
        />
      </div>

      {/* SVG graph */}
      <svg ref={svgRef} className="w-full h-full">
        <defs>
          <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(72.3% 0.219 149.579/1)" />
            <stop offset="100%" stopColor="oklch(72.3% 0.219 149.579/0)" />
          </linearGradient>
        </defs>

        <path
          ref={areaPathRef}
          d={areaPath}
          fill="url(#gradientFill)"
          style={{ clipPath: 'polygon(0 0, 80% 0%, 80% 100%, 0% 100%)' }}
        />
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke="black"
          strokeWidth={3}
        />
      </svg>

      {/* Explosions */}
      {scaledPoints.map((p, i) => (
        <div
          key={`explosion-${i}`}
          ref={(el) => {
            explosionRefs.current[i] = el;
          }}
          className="w-30 h-30 translate-x-[-50%] translate-y-[-88%] opacity-0 z-[21] absolute"
          style={{ top: p.y, left: p.x }}
        >
          <img
            src={`/explosion.gif?${Date.now()}${i}`}
            alt="explosion"
            className="absolute inset-0 m-auto h-full w-full"
            loading="lazy"
          />
        </div>
      ))}

      {/* Kunai + paper bombs */}
      {scaledPoints.map((p, i) => (
        <div
          key={`kunai-${i}`}
          ref={(el) => {
            kunaiRefs.current[i] = el;
          }}
          className="w-8 h-8 absolute z-20 origin-bottom-left opacity-1"
          style={{ top: p.y - 10, left: p.x - 10 }}
        >
          <img src="/kunai2.png" alt="kunai" className="w-full h-full" />
          <div
            ref={(el) => {
              paperBombRefs.current[i] = el;
            }}
            className="w-4 absolute flex flex-col items-center origin-top paper_bomb overflow-hidden"
            style={{ top: '10%', left: '100%' }}
          >
            <span className="h-3 w-[1px] bg-black/70 block shrink-0" />
            <img src="/paper_bomb.jpeg" alt="paper_bomb" className="w-4" />
            <div className="w-[120%] absolute bottom-0 left-1/2 translate-x-[-50%] block opacity-0 fire">
              <Fire />
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      {scaledPoints.map((p, i) => (
        <div
          key={`dot-${i}`}
          ref={(el) => {
            dotsRef.current[i] = el;
          }}
          className="w-4 h-4 rounded-full bg-red-500 cursor-pointer hover:scale-[1.3] transition-all  translate-x-[-50%] translate-y-[-50%] opacity-0 z-[10] absolute"
          style={{ top: p.y, left: p.x }}
          onClick={() => {
            if (p.data?.date) setDate(new Date(p.data.date));
          }}
        >
          <div className="absolute inset-0 m-auto h-full w-full border border-red-500 rounded-full animate-dot-wave"></div>
          <div className="absolute inset-0 m-auto h-full w-full border border-red-500 rounded-full animate-dot-wave animation-delay-100"></div>
          <div className="absolute inset-0 m-auto h-full w-full border border-red-500 rounded-full animate-dot-wave animation-delay-200"></div>
          <div className="absolute inset-0 m-auto h-full w-full border border-red-500 rounded-full animate-dot-wave animation-delay-300"></div>
          <PointPopup data={p.data} />
        </div>
      ))}
    </div>
  );
}

export default Graph;

function PointPopup({ data }: { data: TaskAmount | undefined }) {
  const [isShown, setIsShown] = useState(false);

  const onMouseEnter = () => {
    setIsShown(true);
  };

  const onMouseLeave = () => {
    setIsShown(false);
  };

  const date = data?.date
    ? new Date(data.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';
  return (
    <div
      className="w-full h-full z-[5] relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isShown && data && (
        <Portal>
          <MouseFollowContainer className="translate-x-[-50%] translate-y-4">
            <div className="bg-pink-300 px-[0.75rem] py-[0.5rem] rounded-xl text-sm space-y-1">
              <p className="font-semibold">
                Date: <span className="font-normal">{date}</span>
              </p>
              <p className="font-semibold">
                Task amount:{' '}
                <span className="font-normal">{data.totalAmount}</span>
              </p>

              <p className="font-semibold">
                Todo: <span className="font-normal">{data.todo}</span>
              </p>
              <p className="font-semibold">
                In Progress:{' '}
                <span className="font-normal">{data.in_progress}</span>
              </p>
              <p className="font-semibold">
                Done: <span className="font-normal">{data.done}</span>
              </p>
            </div>
          </MouseFollowContainer>
        </Portal>
      )}
    </div>
  );
}
