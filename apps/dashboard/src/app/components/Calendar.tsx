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
  } = useStore((state) => state);
  const { mutate: updateTask } = useUpdateTask(date);
  const { data: tasks } = useTasks(date);

  const { data: tasksAmount } = useTasksAmount({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  });

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Make Monday = 0

  const getCalendarDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const tasksAmountForDay = tasksAmount?.find(
        (d) =>
          new Date(d.date).toISOString() ===
          new Date(year, month, i).toISOString()
      );
      days.push({
        day: i,
        date: new Date(year, month, i),
        tasksAmount: tasksAmountForDay?.amount,
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
        },
      });
      setDragData(null);
    });
  };

  return (
    <div className="max-w-md p-4 rounded-xl shadow-lg bg-cyan-100">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-2 py-1 text-sm bg-white rounded-md border-2 hover:bg-cyan-50 "
        >
          <LuArrowBigLeft />
        </button>
        <h2 className="text-lg font-semibold">
          {date.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-2 py-1 text-sm bg-white rounded-md border-2 hover:bg-cyan-50"
        >
          <LuArrowBigLeft className="rotate-180" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center gap-y-2">
        {calendarDays.map((day, index) => {
          const isWeekendDay = isWeekend(index);
          const baseStyle = isWeekendDay ? 'text-red-500' : 'text-gray-800';

          return (
            <div
              key={index}
              className={clsx(
                'h-10 flex items-center justify-center cursor-pointer hover:outline outline-cyan-300 rounded-md relative',
                date.getDate() === day?.date.getDate() && 'border-2'
              )}
              onClick={() => {
                setDate(day?.date || today);
              }}
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
  );
}
