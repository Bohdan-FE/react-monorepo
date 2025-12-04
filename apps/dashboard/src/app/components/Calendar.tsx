import clsx from 'clsx';
import { useStore } from '../../store/store';
import { useTasksAmount } from '../../hooks/useTaskAmount';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import { useTasks } from '../../hooks/useTasks';
import { MouseEvent } from 'react';
import { LuArrowBigLeft } from 'react-icons/lu';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Calendar() {
  const today = new Date();
  const setDate = useStore((state) => state.setDate);
  const {
    date,
    firstDayOfMonth,
    lastDayOfMonth,
    year,
    month,
    goToNextMonth,
    goToPreviousMonth,
    setOnDragEnd,
    setDragData,
    dragData,
    setEndPosition,
    offset,
    selectTask,
  } = useStore((state) => state);
  const { mutate: updateTask } = useUpdateTask(date);
  const { data: tasks } = useTasks(date);

  const { data: tasksAmount } = useTasksAmount({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  });

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  const getCalendarDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      if (tasksAmount === undefined) break;
      const tasksAmountForDay = tasksAmount.find(
        (d) =>
          new Date(d.date).toISOString() ===
          new Date(year, month, i).toISOString()
      );

      days.push({
        day: i,
        date: new Date(year, month, i),
        tasksAmount: tasksAmountForDay?.totalAmount,
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isWeekend = (index: number) => {
    const dayOfWeek = index % 7;
    return dayOfWeek === 5 || dayOfWeek === 6; // Saturday or Sunday
  };

  const handleOnDragOver = (e: MouseEvent, date: Date | undefined) => {
    e.preventDefault();
    if (!dragData || !date) return;
    let index = 0;
    if (tasks && tasks.length > 0) {
      index = Math.max(...tasks.map((task) => task.index)) + 1;
    }
    setEndPosition({
      x: e.currentTarget.getBoundingClientRect().left - offset.x,
      y: e.currentTarget.getBoundingClientRect().top - offset.y,
    });

    setOnDragEnd(() => {
      updateTask({
        taskId: dragData._id,
        task: {
          date,
          index,
          status: 'todo',
        },
      });
      setDragData(null);
    });
  };

  return (
    <div className="max-w-md p-4 shadow-big border-4 bg-white/50 rounded-2xl max-h-full relative group">
      <div className="bg-[url('/spiral.png')] bg-center bg-contain bg-no-repeat opacity-50 absolute w-full h-full inset-0 mx-auto group-hover:blur-sm transition-all duration-500">
        <img
          className="h-[85%] bottom-0 left-0 absolute"
          src="/temari.png"
          alt=""
        />
        <img
          className="h-[25%] bottom-0 right-0 absolute animate-up-down delay-200"
          src="/fan.png"
          alt=""
        />
        <img
          className="h-[15%] top-6 right-6 scale-[-1] absolute animate-up-down delay-100"
          src="/fan.png"
          alt=""
        />
      </div>
      <div className="flex justify-between items-center mb-4 z-[2] relative">
        <button
          onClick={goToPreviousMonth}
          className="px-2 py-2 text-sm bg-blue-dark text-white rounded-md shadow-small hover:bg-blue-light "
        >
          <LuArrowBigLeft />
        </button>
        <h2 className="text-lg font-semibold">
          {date.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-2 py-2 text-sm bg-blue-dark text-white  rounded-md shadow-small  hover:bg-blue-light"
        >
          <LuArrowBigLeft className="rotate-180" />
        </button>
      </div>

      <div className="backdrop-blur-[4px] p-1 rounded-md z-[2] relative shadow-sm">
        <div className="grid grid-cols-7 text-center font-bold text-black mb-2 z-[2] relative">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center gap-y-2 ">
          {calendarDays.map((day, index) => {
            const isWeekendDay = isWeekend(index);
            const baseStyle = isWeekendDay ? 'text-red-500' : 'text-gray-800';

            return (
              <div
                key={index}
                className={clsx(
                  'h-10 flex items-center justify-center cursor-pointer hover:outline outline-blue rounded-md relative',
                  date.getDate() === day?.date.getDate() && 'border-2'
                )}
              >
                {day?.tasksAmount && (
                  <div className="absolute top-0 right-0 aspect-square text-xs text-gray-500 rounded-full ">
                    <p className="">{day?.tasksAmount?.toString()}</p>
                  </div>
                )}
                {day ? (
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${baseStyle} ${
                      isToday(day.day) ? 'bg-black/10 font-bold' : ''
                    }`}
                    onMouseOver={(e) => handleOnDragOver(e, day?.date)}
                    onClick={() => {
                      setDate(day?.date || today);
                      selectTask(null);
                    }}
                  >
                    {day.day}
                  </div>
                ) : (
                  <span></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
