import { useEffect, useState } from 'react';
import { TaskAmount, useTasksAmount } from '../../hooks/useTaskAmount';
import { getWeekRange, WeekRange } from '../../utils/getWeekFromDay';
import Calendar from '../components/Calendar';
import Graph from '../components/Graph/Graph';
import TasksList from '../components/TasksList';
import { useUser } from '../../hooks/useUser';

function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [week, setWeek] = useState<WeekRange | null>(null);
  const { data: user } = useUser();

  useEffect(() => {
    const week = getWeekRange(today);
    setWeek(week);
  }, []);

  const { data: taskAmount } = useTasksAmount({
    startDate: week?.monday,
    endDate: week?.sunday,
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

  return (
    <div className="flex h-full justify-end items-center">
      <div className="h-[400px] w-full self-start">
        {week && Array.isArray(taskAmount) && taskAmount.length > 0 && (
          <Graph points={createPoints(taskAmount)} />
        )}
      </div>

      <div className="h-full flex flex-col shrink-0 ">
        <Calendar />
        <div className="bg-white h-full">{user && <TasksList />}</div>
      </div>
    </div>
  );
}

export default Home;
