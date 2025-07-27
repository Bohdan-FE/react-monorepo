import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/tasks';
import { useStore } from '../store/store'; // optional if you need date
import { Task } from './useTasks';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { date } = useStore(); // only needed if you're using ['tasks', date] as queryKey

  const taskKey = ['tasks', date.toISOString()]; // adjust if you're scoping by date

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: taskKey });

      const previousTasks = queryClient.getQueryData<any[]>(taskKey);

      queryClient.setQueryData<Task[]>(taskKey, old =>
        (old ?? []).filter(task => task._id !== taskId)
      );

      return { previousTasks };
    },

    onError: (_error, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKey, context.previousTasks);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasksAmount'] });
    },
  });
};
