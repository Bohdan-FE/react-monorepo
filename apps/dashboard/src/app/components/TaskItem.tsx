import { useDeleteTask } from '../../hooks/useDeleteTask';
import { Task } from '../../hooks/useTasks';
import { useUpdateTask } from '../../hooks/useUpdateTask';

function TaskItem({ task, index }: { task: Task; index: number }) {
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const handleChange = () => {
    updateTask({
      taskId: task._id,
      task: {
        done: !task.done,
      },
    });
  };

  return (
    <div className='flex gap-3 items-center p-4 rounded-md bg-gray-300 "'>
      <span>{index + 1}</span>
      <input
        className="cursor-pointer"
        type="checkbox"
        onChange={handleChange}
        checked={task.done}
      />
      <label htmlFor={task._id}>{task.description}</label>
      <button className="ml-auto" onClick={() => deleteTask(task._id)}>
        delete
      </button>
    </div>
  );
}

export default TaskItem;
