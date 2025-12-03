import { useMemo, useState } from 'react';
import { TaskAmount, useTasksAmount } from '../../../hooks/useTaskAmount';
import { useStore } from '../../../store/store';
import DonutChart from '../DonatChart/DonatChart';
import { IoIosArrowDown } from 'react-icons/io';
import clsx from 'clsx';
import { useOutsideClick } from '@acme/ui';

function DonutGraphContainer() {
  const firstDayOfMonth = useStore((state) => state.firstDayOfMonth);
  const lastDayOfMonth = useStore((state) => state.lastDayOfMonth);
  const { data: taskAmount } = useTasksAmount({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  });
  const [selectedTab, setSelectedTab] = useState<
    'This week' | 'Today' | 'This month'
  >('This month');
  const [isOpen, setIsOpen] = useState(false);
  const startOfWeek = (() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    return new Date(now.setDate(diff));
  })();

  const selectRef = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const endOfWeek = (() => {
    const start = new Date(startOfWeek);
    return new Date(start.setDate(start.getDate() + 6));
  })();

  const thisWeekTasks = taskAmount?.filter((task) => {
    const taskDate = new Date(task.date);
    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  });

  const todaysTasks = taskAmount?.filter((task) => {
    const taskDate = new Date(task.date);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const parsedData = (taskAmount: TaskAmount[]) => {
    const todo = taskAmount.reduce((acc, task) => acc + task.todo, 0);
    const inProgress = taskAmount.reduce(
      (acc, task) => acc + task.in_progress,
      0
    );
    const done = taskAmount.reduce((acc, task) => acc + task.done, 0);
    const total = todo + inProgress + done;
    return { todo, inProgress, done, total };
  };

  const selectedTabData =
    selectedTab === 'Today'
      ? todaysTasks
      : selectedTab === 'This week'
      ? thisWeekTasks
      : taskAmount;

  const {
    todo = 0,
    inProgress = 0,
    done = 0,
    total = 0,
  } = parsedData(selectedTabData || []);

  const selectTab = (tab: 'This week' | 'Today' | 'This month') => {
    setSelectedTab(tab);
    setIsOpen(false);
  };

  const chartData = useMemo(() => {
    return [
      { name: 'To Do', amount: todo },
      { name: 'In Progress', amount: inProgress },
      { name: 'Done', amount: done },
    ];
  }, [todo, inProgress, done]);

  return (
    <div className="shadow-big border-4 bg-white/50 backdrop-blur-md rounded-2xl flex flex-col gap-4 p-2 h-full">
      <div className="relative z-10 w-1/2 self-end" ref={selectRef}>
        <div
          className="flex items-center justify-between gap-2  p-2 rounded-xl bg-blue-dark text-white  shadow-small  cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="font-semibold">{selectedTab}</p>
          <IoIosArrowDown className="font-semibold" />
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+0.4rem)] left-0 flex flex-col  w-full rounded-xl shadow-small bg-white overflow-hidden">
            <button
              className={clsx(
                'p-2 text-start hover:bg-blue-light transition-colors',
                {
                  'bg-blue-dark text-white pointer-events-none':
                    selectedTab === 'Today',
                }
              )}
              onClick={() => selectTab('Today')}
            >
              Today
            </button>
            <button
              className={clsx(
                'p-2 text-start hover:bg-blue-light transition-colors',
                {
                  'bg-blue-dark text-white pointer-events-none':
                    selectedTab === 'This week',
                }
              )}
              onClick={() => selectTab('This week')}
            >
              This week
            </button>
            <button
              className={clsx(
                'p-2 text-start hover:bg-blue-light transition-colors',
                {
                  'bg-blue-dark text-white pointer-events-none':
                    selectedTab === 'This month',
                }
              )}
              onClick={() => selectTab('This month')}
            >
              This month
            </button>
          </div>
        )}
      </div>

      <div className="aspect-square overflow-hidden shrink-1 w-[62%] ml-6 relative">
        <DonutChart data={chartData} donutThickness={2} keepSquare={true} />
        <div className="absolute inset-0 w-full h-full p-[3rem]">
          <div
            className="w-full h-full "
            style={{
              animation:
                'clipPathAnim 5s infinite alternate cubic-bezier(0.4,0,0.2,1)',
              clipPath: 'ellipse(50% 50% at 50% 50%)',
            }}
          >
            <img
              className="object-contain w-full h-full object-center animate-spin-slow "
              src="/sharingan.png"
              alt=""
            />
          </div>
          <style>
            {`
              @keyframes clipPathAnim {
          0% {
            clip-path: ellipse(50% 50% at 50% 50%);
          }
            70% {
              clip-path: ellipse(50% 50% at 50% 50%);
          }
          100% {
            clip-path: ellipse(50% 0% at 50% 50%);
          }
              }
            `}
          </style>
        </div>
      </div>

      <div className="space-y-1 px-2">
        <div className="flex items-center gap-2">
          <div className="size-4 border rounded-sm bg-orange shadow-small"></div>
          <span className="font-semibold text-sm">To Do:</span>
          <span className="text-sm opacity-80">
            {todo} ({total > 0 ? ((todo / total) * 100).toFixed(2) : 0}
            {'%'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 border rounded-sm bg-pink shadow-small"></div>
          <span className="font-semibold text-sm">In Progress:</span>
          <span className="text-sm opacity-80">
            {inProgress} (
            {total > 0 ? ((inProgress / total) * 100).toFixed(2) : 0}
            {'%'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 border rounded-sm bg-blue shadow-small"></div>
          <span className="font-semibold text-sm">Done:</span>
          <span className="text-sm opacity-80">
            {done} ({total > 0 ? ((done / total) * 100).toFixed(2) : 0}
            {'%'})
          </span>
        </div>
      </div>

      <img
        className="absolute bottom-2 right-1 h-[75%] scale-x-[-1]"
        src="/kakasi.png"
        alt=""
      />
    </div>
  );
}

export default DonutGraphContainer;
