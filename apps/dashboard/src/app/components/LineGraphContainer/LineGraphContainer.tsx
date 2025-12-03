import { useMemo, useRef, useState } from 'react';
import Graph from '../Graph/Graph';
import { TaskAmount, useTasksAmount } from '../../../hooks/useTaskAmount';
import { getWeekRange, WeekRange } from '../../../utils/getWeekFromDay';
import clsx from 'clsx';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

function LineGraphContainer() {
  const [itachiPosition, setItachiPosition] = useState<'left' | 'right'>(
    'right'
  );
  const itachiContainerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!itachiContainerRef.current) return;
    const tl = gsap.timeline();
    tl.to(itachiContainerRef.current, {
      opacity: 0,
      duration: 0.5,
      scaleX: itachiPosition === 'left' ? '-1.5' : '1.5',
    })
      .to(itachiContainerRef.current, {
        left: itachiPosition === 'left' ? '-4rem' : 'auto',
        right: itachiPosition === 'right' ? '-4rem' : 'auto',
        scaleX: itachiPosition === 'left' ? '1.5' : '-1.5',
        duration: 0,
      })
      .to(itachiContainerRef.current, {
        opacity: 1,
        scaleX: itachiPosition === 'left' ? '1' : '-1',
        duration: 0.5,
        onComplete: () => {
          tl.kill();
        },
      });
  }, [itachiContainerRef, itachiPosition]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [week] = useState<WeekRange>(getWeekRange(today));

  const initialYear = today.getFullYear();
  const initialMonth = today.getMonth();
  const firstDayOfMonth = new Date(initialYear, initialMonth, 1);
  const lastDayOfMonth = new Date(initialYear, initialMonth + 1, 0);

  const { data: taskAmount } = useTasksAmount({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  });

  const createPoints = (taskAmount: TaskAmount[] | undefined) => {
    if (!taskAmount || !week) return [];

    const weekArray = Array.from({ length: 7 });

    const points = weekArray.map((_, index) => {
      const currentDate = new Date(week.monday);
      currentDate.setDate(currentDate.getDate() + index);
      const task = taskAmount.find(
        (task) =>
          new Date(task.date).toDateString() === currentDate.toDateString()
      );
      return {
        x: index,
        y: task ? task.totalAmount : 0,
        data: task ?? {
          date: currentDate.toISOString(),
          todo: 0,
          in_progress: 0,
          done: 0,
          totalAmount: 0,
        },
      };
    });
    return points;
  };

  const points = useMemo(() => createPoints(taskAmount), [taskAmount, week]);
  const maxY = useMemo(() => {
    if (points.length === 0) return 0;
    return Math.max(...points.map((p) => p.y));
  }, [points]);

  const isData = useMemo(() => {
    return points.some((p) => p.y > 0);
  }, [points]);

  return (
    <div className="col-span-2 rounded-2xl shadow-big border-4 bg-white relative p-6 pt-2 h-full flex flex-col z-[2]">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/konoha-bg.jpg')] bg-center bg-cover opacity-30 rounded-2xl"></div>

      <p className="font-bold text-2xl text-center">Weekly Workload</p>
      <div className="border-b-2 border-l-2 border-black relative flex-1 z-[1]">
        <div className="absolute h-full w-1 bottom-0 left-0 flex flex-col justify-between">
          <p className="absolute top-1/2 left-[-0.75rem] whitespace-nowrap translate-y-[-50%] translate-x-[-50%] -rotate-90 font-bold tracking-[0.5rem] block">
            Task amount
          </p>
          {Array.from({ length: maxY }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[0.1rem] bg-black last:bg-transparent"
            ></div>
          ))}
        </div>

        <div className="absolute w-full h-1 bottom-0 left-0 flex  justify-between">
          <p className="absolute left-1/2 bottom-[-0.25rem] whitespace-nowrap translate-x-[-50%] translate-y-[100%]  font-bold tracking-[0.5rem] block">
            Date
          </p>
          {points.map((_, i) => (
            <div
              key={i}
              className="h-full w-[0.1rem] bg-black first:bg-transparent"
            ></div>
          ))}
        </div>

        {week &&
        isData &&
        Array.isArray(taskAmount) &&
        taskAmount.length > 0 ? (
          <Graph points={points} />
        ) : (
          <div className="h-full flex items-center justify-center text-md">
            No tasks this week
          </div>
        )}
      </div>

      <div
        ref={itachiContainerRef}
        className={clsx('absolute top-[-1rem] right-[-4rem] w-[20%] z-[5]')}
        onMouseEnter={() =>
          setItachiPosition((prev) => (prev === 'left' ? 'right' : 'left'))
        }
      >
        <img
          className="w-full h-full object-contain object-center animate-up-down"
          src="/itachi.png"
          alt=""
        />
      </div>
    </div>
  );
}

export default LineGraphContainer;
