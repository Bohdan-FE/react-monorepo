import { useMemo, useState } from 'react';
import { TaskAmount, useTasksAmount } from '../../hooks/useTaskAmount';
import { getWeekRange, WeekRange } from '../../utils/getWeekFromDay';
import Calendar from '../components/Calendar';
import Graph from '../components/Graph/Graph';
import TasksList from '../components/TasksList';
import { useUser } from '../../hooks/useUser';

function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [week] = useState<WeekRange>(getWeekRange(today));
  const { data: user } = useUser();
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
        y: task ? task.amount : 0,
        date: currentDate,
      };
    });
    return points;
  };

  const points = useMemo(() => createPoints(taskAmount), [taskAmount, week]);

  return (
    <div className="flex h-full justify-end items-center">
      <div className="h-full w-full self-start flex flex-col gap-4 p-4">
        <p className="text-[3rem] text-center font-medium">Weekly workload</p>
        <div className="h-[300px] flex gap-3">
          <div className="bg-amber-400 w-[45%]"></div>
          {week && Array.isArray(taskAmount) && taskAmount.length > 0 && (
            <Graph points={points} />
          )}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4">
          <div className="bg-amber-600 ">
            <p className="text-center font-semibold">to do</p>
            <TasksList status="todo" />
          </div>
          <div className="bg-pink-700">
            <p className="text-center font-semibold">in progress</p>
            <TasksList status="in_progress" />
          </div>
          <div className="bg-amber-600 ">
            <p className="text-center font-semibold">done</p>
            <TasksList status="done" />
          </div>
        </div>
      </div>

      <div className="h-full flex flex-col shrink-0 ">
        <Calendar />
        {/* <div className="bg-white h-full">{user && <TasksList status='' />}</div> */}
      </div>
    </div>
  );
}

export default Home;
