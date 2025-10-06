import { useMemo, useState } from 'react';
import { TaskAmount, useTasksAmount } from '../../hooks/useTaskAmount';
import { getWeekRange, WeekRange } from '../../utils/getWeekFromDay';
import Calendar from '../components/Calendar';
import Graph from '../components/Graph/Graph';
import TasksList from '../components/TasksList';
import { useUser } from '../../hooks/useUser';
import TaskDescription from '../components/TaskDescription';
import { useStore } from '../../store/store';
import clsx from 'clsx';

function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [week] = useState<WeekRange>(getWeekRange(today));
  const { data: user } = useUser();
  const { selectedTask } = useStore();
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
    <div className="flex h-full">
      <div className="flex-1 w-full h-full flex flex-col gap-4 p-4">
        {/* <p className="text-[2rem] text-center font-medium">Weekly workload</p> */}
        <div className="grid grid-rows-2 gap-4 flex-1">
          <div className="grid grid-cols-4 gap-4">
            <Calendar />
            <div className="col-span-2 rounded-3xl shadow-big border-4 bg-white  relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/konoha-bg.jpg')] bg-center bg-cover opacity-30"></div>
              {week && Array.isArray(taskAmount) && taskAmount.length > 0 && (
                <Graph points={points} />
              )}
            </div>

            <div className="shadow-big border-4 bg-white/50 backdrop-blur-md rounded-3xl"></div>
          </div>
          <div
            className={clsx('flex-1 grid gap-4', {
              'grid-cols-4': selectedTask,
              'grid-cols-3': !selectedTask,
            })}
          >
            <div className="shadow-big border-4 bg-orange/50 backdrop-blur-md flex flex-col rounded-3xl relative">
              <div className="absolute bottom-0 right-4 h-[75%] w-fit">
                <img className="h-full" src="/naruto-full.png" alt="" />
              </div>
              <p className="text-center font-semibold">to do</p>
              <TasksList status="todo" />
            </div>
            <div className="shadow-big border-4 bg-pink/50 backdrop-blur-md flex flex-col rounded-3xl">
              <div className="absolute bottom-0 right-4 h-[75%] w-fit">
                <img className="h-full" src="/sakura-full.png" alt="" />
              </div>
              <p className="text-center font-semibold ">in progress</p>
              <TasksList status="in_progress" />
            </div>
            <div className="shadow-big border-4 bg-blue/50 backdrop-blur-md flex flex-col rounded-3xl">
              <div className="absolute bottom-0 right-4 h-[75%] w-fit">
                <img className="h-full" src="/sasuke-full.png" alt="" />
              </div>
              <p className="text-center font-semibold">done</p>
              <TasksList status="done" />
            </div>
            {selectedTask && (
              <div className="bg-white/50 rounded-3xl backdrop-blur-md border-4 shadow-big">
                <TaskDescription />
              </div>
            )}
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
