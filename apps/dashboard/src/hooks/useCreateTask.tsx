import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, CreateTaskPayload } from '../api/tasks';
import { useStore } from '../store/store';
import { Task } from './useTasks';

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { date } = useStore(state => state);

  return useMutation({
    mutationFn: (newTask: CreateTaskPayload) => createTask(newTask),

    onMutate: async (newTask: CreateTaskPayload) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', date.toISOString()],
      });

      const previousTasks = queryClient.getQueryData<Task[]>([
        'tasks',
        date.toISOString(),
      ]);

      const optimisticTask: Task = {
        ...newTask,
        _id: `optimistic-${Date.now()}`,
        done: false,
        index: previousTasks?.length ?? 0,
        date: date, // assuming `date` is a `Date` object
      };

      queryClient.setQueryData<Task[]>(['tasks', date.toISOString()], old => [
        ...(old ?? []),
        optimisticTask,
      ]);

      return { previousTasks };
    },

    onError: (_err, _newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(
          ['tasks', date.toISOString()],
          context.previousTasks
        );
      }
    },

    onSuccess: (realTask: Task) => {
      queryClient.setQueryData<Task[]>(['tasks', date.toISOString()], old =>
        (old ?? [])
          .filter(t => !t._id.startsWith('optimistic-'))
          .concat(realTask)
      );

      queryClient.invalidateQueries({ queryKey: ['tasksAmount'] });
    },
  });
};
