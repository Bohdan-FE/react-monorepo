import { useForm } from 'react-hook-form';
import ModalLayout from '../../layout/ModalLayout';
import { useCreateTask } from '../../../hooks/useCreateTask';
import { useStore } from '../../../store/store';
import { useTasks } from '../../../hooks/useTasks';

function CreateTaskModal() {
  const { register, handleSubmit } = useForm();
  const { mutate: createTask } = useCreateTask();
  const date = useStore((state) => state.date);
  const { data: tasks } = useTasks(date);

  const onSubmit = (data: any) => {
    const taskData = {
      ...data,
      date: date.toISOString(),
      index: tasks?.length ? tasks?.length : 0,
    };
    createTask(taskData);
  };

  return (
    <ModalLayout>
      <div>
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input id="title" {...register('title', { required: true })} />
            <label htmlFor="description">Task Description</label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Enter task description"
            ></textarea>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
    </ModalLayout>
  );
}

export default CreateTaskModal;
