import { IoReorderFour } from 'react-icons/io5';
import { useDeleteTask } from '../../hooks/useDeleteTask';
import { Task } from '../../hooks/useTasks';
import { useStore } from '../../store/store';
import clsx from 'clsx';
import { MdDeleteOutline } from 'react-icons/md';

function TaskItem({ task, index }: { task: Task; index: number }) {
  const { mutate: deleteTask } = useDeleteTask();
  const { selectTask, selectedTask } = useStore();

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteTask(task._id);
    if (selectedTask?._id === task._id) {
      selectTask(null);
    }
  };

  return (
    <div
      className={clsx(
        'flex gap-1 items-center p-2 py-3 relative w-full rounded-xl cursor-pointer border-1 transition shadow-small',
        {
          'bg-blue-dark text-white': selectedTask?._id === task._id,
          'bg-white': selectedTask?._id !== task._id,
        }
      )}
      onClick={() => selectTask(task)}
    >
      <span>{index + 1}.</span>

      <p className="truncate capitalize text-sm">{task.title}</p>
      <button
        className="ml-auto shrink-0 hover:scale-110 transition"
        type="button"
        onClick={(e) => handleDeleteTask(e)}
      >
        <MdDeleteOutline className="pointer-events-none" />
      </button>
      <div className="cursor-move shrink-0">
        <IoReorderFour id="drag-handle" />
      </div>
    </div>
  );
}

export default TaskItem;
