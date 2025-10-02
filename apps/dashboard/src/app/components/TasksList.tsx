import { Task, TaskStatus, useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import { useStore } from '../../store/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useReorderTasks } from '../../hooks/useReorderTasks';
import { useManualDrag } from '../../hooks/useManualDrag';
import * as motion from 'motion/react-client';
import { useUpdateTask } from '../../hooks/useUpdateTask';

function TasksList({ status }: { status: TaskStatus }) {
  const { mutate: reorder } = useReorderTasks();
  const { dragData, setDragData, setOnDragEnd, setEndPosition, date } =
    useStore((state) => state);
  const { data, isLoading, isError, isFetching } = useTasks(date);
  const [sortedTasks, setSortedTasks] = useState<typeof data | []>([]);
  const { handleMouseDown } = useManualDrag();
  const { mutate } = useUpdateTask(date);
  const itemRef = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const tasks = data?.filter((t) => t.status === status);
    if (tasks) {
      const sorted = [...tasks].sort((a, b) => a.index - b.index);
      setSortedTasks(sorted);
    }
  }, [data]);

  const handleDragOver = useCallback(
    (e: React.MouseEvent, overTask: Task | null) => {
      e.preventDefault();
      if (!dragData) return;
      if (overTask) {
        if (overTask._id === dragData._id) return;
        const updated = [...(sortedTasks || [])];
        const dragIdx = updated.findIndex((task) => task._id === dragData._id);
        const overIdx = updated.findIndex((task) => task._id === overTask._id);
        if (dragIdx === -1 || overIdx === -1) return;
        const [dragged] = updated.splice(dragIdx, 1);
        updated.splice(overIdx, 0, dragged);
        updated.forEach((task, index) => {
          task.index = index;
        });
        setSortedTasks(updated);
        setOnDragEnd(() => {
          if (!sortedTasks) return;
          const payload = updated.map((task, index) => ({
            taskId: task._id,
            index,
          }));
          reorder(payload);
          if (dragData.status !== status) {
            mutate({ taskId: dragData._id, task: { status } });
          }
        });
      }

      if (!overTask) {
        // setEndPosition({
        //   y: (e.currentTarget as HTMLElement).offsetTop,
        //   x: (e.currentTarget as HTMLElement).offsetLeft,
        // });
        const isDraggableTaskInArr = sortedTasks?.find(
          (task) => task._id === dragData._id
        );

        if (!isDraggableTaskInArr) {
          if (sortedTasks && sortedTasks.length) {
            const maxIndex = Math.max(...sortedTasks.map((o) => o.index));
            const highest = sortedTasks.find((o) => o.index === maxIndex);
            dragData.index = highest!.index + 1;
          }

          setSortedTasks((prev) =>
            [...(prev || []), dragData].sort((a, b) => a.index - b.index)
          );

          setOnDragEnd(() => {
            mutate({
              taskId: dragData._id,
              task: { status, index: dragData.index },
            });
          });
        }
      }
    },
    [dragData, reorder, sortedTasks, setDragData, setOnDragEnd, itemRef.current]
  );

  const handleMouseMove = () => {
    if (sortedTasks && sortedTasks.length && dragData) {
      const el = itemRef.current[dragData._id]; // <-- теперь берём по id, а не по индексу
      if (el) {
        const targetPosition = {
          y: el.getBoundingClientRect().top || 0,
          x: el.getBoundingClientRect().left || 0,
        };
        setEndPosition(targetPosition);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!dragData) return;
    setOnDragEnd(() => {});
    const tasks = data?.filter((t) => t.status === status);
    if (tasks) {
      const sorted = [...tasks].sort((a, b) => a.index - b.index);
      setSortedTasks(sorted);
    }
  };

  const onDragStart = (e: React.MouseEvent, task: Task) => {
    const target = e.target as HTMLElement;
    setEndPosition({
      y: (e.currentTarget as HTMLElement).offsetTop,
      x: (e.currentTarget as HTMLElement).offsetLeft,
    });
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a')
    ) {
      return;
    }
    handleMouseDown(e, task);
    setSortedTasks((prev) => [
      ...(prev || []).filter((t) => t._id !== task._id),
    ]);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <ul
      className="space-y-2 p-2  border bg-amber-400 flex-1"
      onMouseOver={(e) => handleDragOver(e, null)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {sortedTasks?.length ? (
        sortedTasks.map((task, index) => (
          <motion.li
            ref={(el) => {
              itemRef.current[task._id] = el;
            }}
            key={task._id}
            className={clsx({
              'opacity-30': dragData?._id === task._id,
            })}
            onMouseDown={(e) => onDragStart(e, task)}
            onMouseOver={(e) => handleDragOver(e, task)}
            layout
            transition={spring}
          >
            <TaskItem index={index} task={task} />
          </motion.li>
        ))
      ) : (
        <p>There is no tasks</p>
      )}
    </ul>
  );
}

const spring = {
  damping: 20,
  stiffness: 150,
};

export default TasksList;
