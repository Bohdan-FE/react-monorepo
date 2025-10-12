import { useMemo, useState } from 'react';
import { TaskAmount, useTasksAmount } from '../../hooks/useTaskAmount';
import { getWeekRange, WeekRange } from '../../utils/getWeekFromDay';
import Calendar from '../components/Calendar';
import Graph from '../components/Graph/Graph';

import TaskDescription from '../components/TaskDescription';

import clsx from 'clsx';

import TasksContainer from '../components/TasksContainer/TasksContainer';
import DonutGraphContainer from '../components/DonatGraphContainer/DonatGraphContainer';

function Home() {
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
        date: currentDate,
      };
    });
    return points;
  };

  const points = useMemo(() => createPoints(taskAmount), [taskAmount, week]);

  return (
    <div className="flex h-full">
      <div className="flex-1 w-full h-full flex flex-col gap-4 p-4">
        <div className="grid grid-rows-2 h-full gap-4 ">
          <div className="grid grid-cols-4 gap-4 h-full">
            <Calendar />
            <div className="col-span-2 rounded-2xl shadow-big border-4 bg-white relative ">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/konoha-bg.jpg')] bg-center bg-cover opacity-30 rounded-2xl"></div>
              {week && Array.isArray(taskAmount) && taskAmount.length > 0 && (
                <Graph points={points} />
              )}
            </div>
            <DonutGraphContainer />
          </div>
          <div
            className={clsx('grid grid-cols-4 grid-rows-[100%] gap-4 h-full')}
          >
            <TaskDescription />
            <TasksContainer type="todo" />
            <TasksContainer type="in_progress" />
            <TasksContainer type="done" />
          </div>
        </div>
      </div>

      {/* <div className="h-full flex flex-col shrink-0 ">
        <Calendar />
        <div className="bg-white h-full">{user && <TasksList status='' />}</div>
      </div> */}
    </div>
  );
}

export default Home;
