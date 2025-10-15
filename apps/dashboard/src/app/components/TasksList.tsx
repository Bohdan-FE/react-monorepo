import { Task, TaskStatus, useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import { useStore } from '../../store/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useReorderTasks } from '../../hooks/useReorderTasks';
import { useManualDrag } from '../../hooks/useManualDrag';
import * as motion from 'motion/react-client';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import { useQueryClient } from '@tanstack/react-query';
import { throttle } from 'lodash';
import { AnimationGeneratorType } from 'motion/react';

function TasksList({ status }: { status: TaskStatus }) {
  const { mutate: reorder } = useReorderTasks();
  const dragData = useStore((state) => state.dragData);
  const setDragData = useStore((state) => state.setDragData);
  const setOnDragEnd = useStore((state) => state.setOnDragEnd);
  const setEndPosition = useStore((state) => state.setEndPosition);
  const date = useStore((state) => state.date);
  const { data, isLoading, isError } = useTasks(date);
  const queryClient = useQueryClient();
  const [sortedTasks, setSortedTasks] = useState<typeof data | []>([]);
  const { handleMouseDown } = useManualDrag();
  const { mutate: updateTask } = useUpdateTask(date);
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
  }, [data, status, dragData?.status]);

  const handleDragOverTask = useCallback(
    throttle((e: React.MouseEvent, targetTask: Task) => {
      e.preventDefault();
      if (!dragData || dragData._id === targetTask._id) return;
      setSortedTasks((prev) => {
        if (!prev) return prev;
        const dragDataIndex = prev.findIndex((t) => t._id === dragData._id);
        const targetIndex = prev.findIndex((t) => t._id === targetTask._id);
        if (
          dragDataIndex === -1 ||
          targetIndex === -1 ||
          dragDataIndex === targetIndex
        ) {
          return prev;
        }
        const newTasks = [...prev];
        const [moved] = newTasks.splice(dragDataIndex, 1);
        newTasks.splice(targetIndex, 0, moved);
        return newTasks;
      });

      setOnDragEnd(() => {});
    }, 250),
    [dragData]
  );

  const handleDragOverList = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!dragData) return;
    if (dragData.status !== status) {
      dragData.status = status;
      const lastIndex = sortedTasks?.length
        ? sortedTasks[sortedTasks.length - 1].index
        : 0;
      dragData.index = lastIndex + 1;
      setSortedTasks((prev) => {
        if (!prev) return prev;
        const newTasks = [...prev, dragData];
        return newTasks;
      });
      setOnDragEnd(() => {
        updateTask({
          taskId: dragData._id,
          task: { status, index: dragData.index },
        });
      });
    }
  };

  const handleMouseMove = () => {
    // if (sortedTasks && sortedTasks.length && dragData) {
    //   const el = itemRef.current[dragData._id];
    //   if (el) {
    //     const targetPosition = {
    //       y: el.getBoundingClientRect().top || 0,
    //       x: el.getBoundingClientRect().left || 0,
    //     };
    //     setEndPosition(targetPosition);
    //   }
    // }
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
            key={task._id + status}
            className={clsx('w-[calc(100%-0.2rem)] rounded-xl relative py-1', {
              'opacity-10 z-2 ': dragData?._id === task._id,
            })}
            onMouseDown={(e) => onDragStart(e, task)}
            onMouseOver={(e) => handleDragOverTask(e, task)}
            layout
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
  type: 'spring' as AnimationGeneratorType,
  stiffness: 1400, // higher = faster
  damping: 160, // lower = less resistance, snappier motion
  mass: 0.8, // slightly lighter for crispness
};

export default TasksList;
