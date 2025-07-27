import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-shape';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Fire from '../Fire/Fire';

const padding = {
  top: 20,
  bottom: 20,
  left: 30,
  right: 30,
};

function Graph({ points }: { points: { x: number; y: number }[] }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [linePath, setLinePath] = useState('');
  const [areaPath, setAreaPath] = useState('');
  const [scaledPoints, setScaledPoints] = useState<{ x: number; y: number }[]>(
    []
  );
  const narutoRef = useRef<HTMLImageElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const areaPathRef = useRef<SVGPathElement | null>(null);
  const gsapContext = useRef<gsap.Context | null>(null);
  const kunaiRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paperBombRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (
      !narutoRef.current ||
      !pathRef.current ||
      !areaPathRef.current ||
      pathRef.current.getTotalLength() === 0
    )
      return;

    if (gsapContext.current) {
      gsapContext.current.revert(); // 🧹 clean up old animations
    }

    gsapContext.current = gsap.context(() => {
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
        {
          clipPath: 'polygon(0 0, 0% 0%, 0% 100%, 0% 100%)',
        },
        {
          clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)',
          duration: 5,
          ease: 'none',
        }
      );

      gsap.to(narutoRef.current, {
        motionPath: pathRef.current
          ? {
              path: pathRef.current,
              align: pathRef.current,
              autoRotate: true,
            }
          : undefined,
        duration: 5,
        ease: 'none',
        onComplete: () => {
          gsap.set(narutoRef.current, { opacity: 0 });
        },
      });

      kunaiRefs.current.forEach((el, i) => {
        const angleDeg = -Math.random() * 180;
        const angleRad = (angleDeg * Math.PI) / 180;
        const distance = 25;
        const xOffset = distance * Math.cos(angleRad);
        const yOffset = distance * Math.sin(angleRad);
        const angleDegBomb =
          angleDeg < -90 ? -45 - angleDeg - 360 : -45 - angleDeg;

        gsap.set(el, {
          transform: `translate3d(${xOffset + 2}rem, ${yOffset - 2}rem, 0)  rotate(${angleDeg + 45}deg)`,
        });

        gsap.set(paperBombRefs.current[i], {
          transform: `translate(-55%, 0%) rotate(${angleDegBomb}deg)`,
        });

        paperBombRefs.current[i]?.setAttribute(
          'data-angle-bomb',
          angleDegBomb.toString()
        );

        paperBombRefs.current[i];
      });

      gsap.to(kunaiRefs.current, {
        duration: 0.5,
        delay: 0.6,
        ease: 'none',
        translateY: '-65%',
        translateX: '31%',
        stagger: 0.7,
        opacity: 1,
      });

      const elements = gsap.utils.toArray('.paper_bomb') as HTMLElement[];

      elements.forEach((el, i) => {
        const angle = el.getAttribute('data-angle-bomb') ?? '-45';

        const tl = gsap.timeline({
          delay: 1.1 + i * 0.7, // stagger manually
        });

        tl.fromTo(
          el,
          {
            rotate: '-135deg',
          },
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
            gsap.to('.fire', {
              opacity: 1,
            });
          },
          onComplete: () => {
            gsap.to(dotsRef.current[i], {
              opacity: 1,
            });
          },
        });
      });
    }, wrapperRef); // <- scope for the refs

    return () => {
      if (gsapContext.current) gsapContext.current.revert();
    }; // 🧹 clean up old animations
  }, [linePath]); // or [points]

  const updateGraph = (width: number, height: number) => {
    const maxY = Math.max(...points.map(p => p.y));
    const maxX = Math.max(...points.map(p => p.x));

    const scaled = points.map(p => ({
      x: padding.left + (p.x / maxX) * (width - padding.left - padding.right),
      y:
        padding.top +
        (1 - p.y / maxY) * (height - padding.top - padding.bottom),
    }));

    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGenerator = d3
      .area<{ x: number; y: number }>()
      .x(d => d.x)
      .y0(height)
      .y1(d => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5));

    setLinePath(lineGenerator(scaled) || '');
    setAreaPath(areaGenerator(scaled) || '');
    setScaledPoints(scaled);
  };

  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        updateGraph(width, height);
      }
    });

    observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
    };
  }, [points]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full relative perspective-distant"
    >
      <div ref={narutoRef} className="absolute">
        <img
          className="w-12 border block translate-y-[18%]"
          src="/running-naruto.gif"
          alt="naruto"
        />
      </div>

      <svg ref={svgRef} className="w-full h-full">
        <defs>
          <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(72.3% 0.219 149.579/0.5)" />
            <stop offset="100%" stopColor="oklch(72.3% 0.219 149.579/0)" />
          </linearGradient>
        </defs>

        <path
          ref={areaPathRef}
          style={{
            clipPath: 'polygon(0 0, 80% 0%, 80% 100%, 0% 100%)',
          }}
          d={areaPath}
          fill="url(#gradientFill)"
        />
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke="black"
          strokeWidth={3}
        />
        {/* {scaledPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5} fill="red" />
        ))} */}
      </svg>
      {scaledPoints.map((p, i) => (
        <div
          ref={el => {
            dotsRef.current[i] = el;
          }}
          className="w-19 h-19 rounded-full  translate-x-[-50%] translate-y-[-50%] opacity-0"
          style={{
            position: 'absolute',
            top: p.y,
            left: p.x,
          }}
          key={i}
        >
          <img
            className="absolute inset-0 m-auto h-full "
            src={`/explosion.gif?${i}`}
            loading="lazy"
            alt="explosion gif"
          />
        </div>
      ))}
      {scaledPoints.map((p, i) => {
        return (
          <div
            ref={el => {
              kunaiRefs.current[i] = el;
            }}
            className="w-8 h-8 absolute z-20 transform-3d opacity-1 origin-bottom-left"
            style={{
              top: p.y - 10 + 'px',
              left: p.x - 10 + 'px',
            }}
            key={i}
          >
            <img className="w-full h-full" src="/kunai2.png" alt="kunai" />
            <div
              ref={el => {
                paperBombRefs.current[i] = el;
              }}
              className="w-4 absolute flex flex-col items-center origin-top paper_bomb overflow-hidden"
              style={{
                top: '10%',
                left: '100%',
              }}
            >
              <span className="h-3 w-[1px] bg-black/70 block shrink-0"></span>
              <img className="w-4" src="/paper_bomb.jpeg" alt="paper_bomb" />
              <div className="w-[120%] absolute bottom-0 left-1/2 translate-x-[-50%] block opacity-0 fire">
                <Fire />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Graph;
