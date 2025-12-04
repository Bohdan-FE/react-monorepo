import { Task, TaskStatus, useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import { useStore } from '../../store/store';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useReorderTasks } from '../../hooks/useReorderTasks';
import { useManualDrag } from '../../hooks/useManualDrag';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimationGeneratorName } from 'motion/react';
import throttle from 'lodash/throttle';

function TasksList({ status }: { status: TaskStatus }) {
  const { mutate: reorder, isPending } = useReorderTasks();
  const dragData = useStore((state) => state.dragData);
  const setDragData = useStore((state) => state.setDragData);
  const setOnDragEnd = useStore((state) => state.setOnDragEnd);
  const setEndPosition = useStore((state) => state.setEndPosition);
  const date = useStore((state) => state.date);
  const { data, isLoading, isError, isFetching } = useTasks(date);
  const queryClient = useQueryClient();
  const [sortedTasks, setSortedTasks] = useState<typeof data | []>([]);
  const { handleMouseDown } = useManualDrag();
  const itemRef = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    setSortedTasks((prev) => {
      if (!data) return prev;
      const tasks = data.filter((t) => t.status === status);
      if (tasks) {
        const sorted = [...tasks].sort((a, b) => a.index - b.index);
        return sorted;
      }
      return prev;
    });
  }, [data, status]);

  const handleDragOverTask = (e: React.MouseEvent, overTask: Task) => {
    if (!dragData) return;
    if (dragData._id === overTask._id) return;
    if (isFetching || isPending) return;
    const newOrder = [...(sortedTasks || [])];
    const dragIndex = newOrder.findIndex((t) => t._id === dragData._id);
    const overIndex = newOrder.findIndex((t) => t._id === overTask._id);
    const [draggedItem] = newOrder.splice(dragIndex, 1);
    newOrder.splice(overIndex, 0, draggedItem);
    newOrder.map((task, index) => ({ ...task, index, status }));

    setSortedTasks(newOrder);

    setOnDragEnd(() => {
      const payload = newOrder.map((task, index) => ({
        taskId: task._id,
        status: task.status,
        index: index,
      }));
      reorder(payload);
    });
  };

  const handleDragOverList = throttle((e: React.MouseEvent) => {
    if (!dragData || !data) return;
    if (isFetching || isPending) return;

    if (dragData.status !== status) {
      setDragData({ ...dragData, status });
      setSortedTasks((prev) => {
        return prev
          ? [...prev, { ...dragData, status, index: prev.length }]
          : [{ ...dragData, status, index: 0 }];
      });

      queryClient.setQueryData(
        ['tasks', date.toISOString()],
        (old: Task[] | undefined) => {
          if (!old) return old;
          const withoutDragged = old.filter((t) => t._id !== dragData._id);
          return [
            ...withoutDragged,
            { ...dragData, status, index: withoutDragged.length },
          ];
        }
      );

      setOnDragEnd(() => {
        if (!sortedTasks) return;

        reorder([
          ...sortedTasks.map((task, index) => ({
            taskId: task._id,
            status: task.status,
            index: index,
          })),
          { taskId: dragData._id, status, index: sortedTasks.length },
        ]);
      });
    }
  }, 100);

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
  };

  if (isLoading) return <div className="flex-1">Loading...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <ul
      className=" overflow-y-auto scroll-p-8 relative z-[1] h-full"
      onMouseOver={(e) => handleDragOverList(e)}
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
            className={clsx('w-[calc(100%-0.2rem)] rounded-xl relative py-1 ')}
            onMouseDown={(e) => onDragStart(e, task)}
            onMouseOver={(e) => handleDragOverTask(e, task)}
            layout
            layoutId={'task-item-' + task._id}
            animate={{
              opacity: dragData?._id === task._id ? 0.1 : 1,
              zIndex: 2,
            }}
            transition={{
              damping: 20,
              stiffness: 150,
              duration: task._id === dragData?._id ? 0 : 0.1,
            }}
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

export default TasksList;
