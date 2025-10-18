import { useMemo, useState } from 'react';
import Graph from '../Graph/Graph';
import { TaskAmount, useTasksAmount } from '../../../hooks/useTaskAmount';
import { getWeekRange, WeekRange } from '../../../utils/getWeekFromDay';

function LineGraphContainer() {
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
        data: task,
      };
    });
    return points;
  };

  const points = useMemo(() => createPoints(taskAmount), [taskAmount, week]);

  return (
    <div className="col-span-2 rounded-2xl shadow-big border-4 bg-white relative p-6">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/konoha-bg.jpg')] bg-center bg-cover opacity-30 rounded-2xl"></div>
      <div className="border-b-2 border-l-2 border-black h-full relative">
        <div className="absolute h-full w-1 bottom-0 left-0 flex flex-col justify-between">
          <p className="absolute top-1/2 left-[-0.75rem] whitespace-nowrap translate-y-[-50%] translate-x-[-50%] -rotate-90 font-bold tracking-[0.5rem] block">
            Task amount
          </p>
          {points.map((_, i) => (
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

        {week && Array.isArray(taskAmount) && taskAmount.length > 0 && (
          <Graph points={points} />
        )}
      </div>
    </div>
  );
}

export default LineGraphContainer;
