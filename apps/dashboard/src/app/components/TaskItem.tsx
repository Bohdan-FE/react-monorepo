import { IoReorderFour } from 'react-icons/io5';
import { useDeleteTask } from '../../hooks/useDeleteTask';
import { Task } from '../../hooks/useTasks';
import { useStore } from '../../store/store';
import Fire from './Fire/Fire';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import clsx from 'clsx';

function TaskItem({ task, index }: { task: Task; index: number }) {
  const { mutate: deleteTask } = useDeleteTask();
  const { selectTask } = useStore();
  const taskRef = useRef<HTMLDivElement>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = (taskId: string) => {
    setIsDeleting(true);

    setTimeout(() => {
      gsap.to(taskRef.current, {
        bottom: '100%',
        duration: 2,
        ease: 'none',
        onComplete: () => {
          // deleteTask(taskId);
        },
      });
    });
  };

  return (
    <div
      className={clsx(
        'flex gap-3 items-center p-4 rounded-md bg-white relative transit transition-all duration-[2s] ease-[none]'
      )}
      style={{
        clipPath: isDeleting
          ? 'polygon(0 0, 100% 0%, 100% 0, 0 0)'
          : 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
      }}
      onClick={() => selectTask(task)}
    >
      <span>{index + 1}</span>

      <label htmlFor={task._id}>{task.title}</label>
      <button className="ml-auto" onClick={() => onDelete(task._id)}>
        delete
      </button>
      <div className="cursor-move ml-auto">
        <IoReorderFour id="drag-handle" />
      </div>
      {isDeleting && (
        <div
          ref={taskRef}
          className={clsx(
            'absolute w-full left-[-0.3rem] h-[5%] bottom-0 flex '
          )}
        >
          <Fire color="black" />
          <Fire color="black" />
          <Fire color="black" />
          <Fire color="black" />
          <Fire color="black" />
          <Fire color="black" />
          <Fire color="black" />
        </div>
      )}
    </div>
  );
}

export default TaskItem;
