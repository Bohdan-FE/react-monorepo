import { useDeleteTask } from '../../hooks/useDeleteTask';
import { Task } from '../../hooks/useTasks';

function TaskItem({ task, index }: { task: Task; index: number }) {
  const { mutate: deleteTask } = useDeleteTask();

  return (
    <div className='flex gap-3 items-center p-4 rounded-md bg-gray-300 "'>
      <span>{index + 1}</span>

      <label htmlFor={task._id}>{task.title}</label>
      <button className="ml-auto" onClick={() => deleteTask(task._id)}>
        delete
      </button>
    </div>
  );
}

export default TaskItem;
