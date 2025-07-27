import { Task, useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import { useStore } from '../../store/store';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useReorderTasks } from '../../hooks/useReorderTasks';
import { useManualDrag } from '../../hooks/useManualDrag';
import * as motion from 'motion/react-client';

function TasksList() {
  const { data: tasks, isLoading, isError } = useTasks();
  const { mutate: reorder } = useReorderTasks();
  const { dragData, setDragData, setOnDragEnd, setEndPosition } = useStore(
    state => state
  );
  const [sortedTasks, setSortedTasks] = useState<typeof tasks | []>([]);
  const { handleMouseDown } = useManualDrag();

  useEffect(() => {
    if (tasks) {
      const sorted = [...tasks].sort((a, b) => a.index - b.index);
      setSortedTasks(sorted);
    }
  }, [tasks]);

  const handleDragOver = useCallback(
    (e: React.MouseEvent, overTask: Task | null) => {
      e.preventDefault();

      if (!dragData) return;

      if (overTask) {
        setEndPosition({
          y: (e.currentTarget as HTMLElement).offsetTop,
          x: (e.currentTarget as HTMLElement).offsetLeft,
        });
        const updated = [...(sortedTasks || [])];
        const dragIdx = updated.findIndex(task => task._id === dragData._id);
        const overIdx = updated.findIndex(task => task._id === overTask._id);
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
        });
      }

      if (!overTask) {
        if (!sortedTasks?.find(task => task._id === dragData._id)) {
          setSortedTasks(prev =>
            [...(prev || []), dragData].sort((a, b) => a.index - b.index)
          );
        }
      }
    },
    [dragData, reorder, sortedTasks, setDragData, setOnDragEnd]
  );

  const onDragStart = (e: React.MouseEvent, task: Task) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a')
    ) {
      return;
    }
    handleMouseDown(e, task);
    setSortedTasks(prev => [...(prev || []).filter(t => t._id !== task._id)]);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <ul
      className="space-y-2 p-2 h-full"
      onMouseOver={e => handleDragOver(e, null)}
    >
      {sortedTasks?.length ? (
        sortedTasks.map((task, index) => (
          <motion.li
            key={task._id}
            className={clsx({
              'opacity-0': dragData?._id === task._id,
            })}
            onMouseDown={e => onDragStart(e, task)}
            onMouseOver={e => handleDragOver(e, task)}
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
