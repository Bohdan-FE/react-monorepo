import { Task, TaskStatus, useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import { useStore } from '../../store/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useReorderTasks } from '../../hooks/useReorderTasks';
import { useManualDrag } from '../../hooks/useManualDrag';
import * as motion from 'motion/react-client';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import { useQueryClient } from '@tanstack/react-query';

function TasksList({ status }: { status: TaskStatus }) {
  const { mutate: reorder } = useReorderTasks();
  const { dragData, setDragData, setOnDragEnd, setEndPosition, date } =
    useStore((state) => state);
  const { data, isLoading, isError, isFetching } = useTasks(date);
  const queryClient = useQueryClient();
  const [sortedTasks, setSortedTasks] = useState<typeof data | []>([]);
  const { handleMouseDown } = useManualDrag();
  const { mutate } = useUpdateTask(date);
  const itemRef = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    setSortedTasks((prev) => {
      const tasks = data?.filter((t) => t.status === status);
      if (tasks) {
        const sorted = [...tasks].sort((a, b) => a.index - b.index);
        return sorted;
      }
      return prev;
    });
  }, [data, dragData?.status, status]);

  const handleDragOver = useCallback(
    (e: React.MouseEvent, overTask: Task | null) => {
      e.preventDefault();

      if (!dragData) return;

      if (dragData.status !== status) {
        const taskKey = ['tasks', date.toISOString()];
        queryClient.setQueryData<Task[]>(taskKey, (old) => {
          const dragTaskIndex = (old ?? []).findIndex(
            (t) => t._id === dragData._id
          );
          if (dragTaskIndex !== -1) {
            (old ?? [])[dragTaskIndex].status = status;
          }
          return old;
        });

        setDragData({ ...dragData, status });
      }

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

        // const taskKey = ['tasks', date.toISOString()];
        // queryClient.setQueryData<Task[]>(taskKey, (old) => {
        //   const filtered = (old ?? []).filter((t) => t.status !== status);
        //   return [...filtered, ...updated].sort((a, b) => a.index - b.index);
        // });

        setOnDragEnd(() => {
          if (!sortedTasks) return;
          const payload = updated.map((task, index) => ({
            taskId: task._id,
            index,
            status,
          }));
          reorder(payload);
          if (dragData.status !== status) {
            mutate({ taskId: dragData._id, task: { status } });
          }
        });
      }

      if (!overTask) {
        dragData.status !== status && setDragData({ ...dragData, status });

        const isDraggableTaskInArr = sortedTasks?.find(
          (task) => task._id === dragData._id
        );

        if (!isDraggableTaskInArr) {
          if (sortedTasks && sortedTasks.length) {
            const maxIndex = Math.max(...sortedTasks.map((o) => o.index));
            const highest = sortedTasks.find((o) => o.index === maxIndex);
            dragData.index = highest!.index + 1;
            const taskKey = ['tasks', date.toISOString()];
            queryClient.setQueryData<Task[]>(taskKey, (old) => {
              const dragTaskIndex = (old ?? []).findIndex(
                (t) => t._id === dragData._id
              );
              if (dragTaskIndex !== -1) {
                (old ?? [])[dragTaskIndex].index = dragData.index;
              }
              return old;
            });
          }

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
      const el = itemRef.current[dragData._id];
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
  };

  const onDragStart = (e: React.MouseEvent, task: Task) => {
    const target = e.target as HTMLElement;
    if (!target.closest('svg') && !target.closest('use')) return;

    handleMouseDown(e, task);
    setSortedTasks((prev) => [
      ...(prev || []).filter((t) => t._id !== task._id),
    ]);
    setEndPosition({
      y: (e.currentTarget as HTMLElement).getBoundingClientRect().top,
      x: (e.currentTarget as HTMLElement).getBoundingClientRect().left,
    });
  };

  if (isLoading) return <div className="flex-1">Loading...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <ul
      className="  overflow-y-auto scroll-p-8 relative z-[1] h-full"
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
            className={clsx('w-[calc(100%-0.2rem)] rounded-xl py-1', {
              'opacity-30 z-10': dragData?._id === task._id,
            })}
            onMouseDown={(e) => onDragStart(e, task)}
            onMouseOver={(e) => handleDragOver(e, task)}
            layout={dragData?._id !== task._id}
            transition={spring}
          >
            <TaskItem index={index} task={task} />
          </motion.li>
        ))
      ) : (
        <div className="flex items-center justify-center ">
          <p>There is no tasks</p>
        </div>
      )}
    </ul>
  );
}

const spring = {
  damping: 20,
  stiffness: 150,
};

export default TasksList;
