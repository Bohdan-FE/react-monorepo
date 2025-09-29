import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/tasks';
import { useStore } from '../store/store'; // optional if you need date
import { Task } from './useTasks';
import { TaskAmount } from './useTaskAmount';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { date, firstDayOfMonth, lastDayOfMonth } = useStore(); // only needed if you're using ['tasks', date] as queryKey

  const taskKey = ['tasks', date.toISOString()]; // adjust if you're scoping by date

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: taskKey });

      const previousTasks = queryClient.getQueryData<any[]>(taskKey);

      queryClient.setQueryData<Task[]>(taskKey, (old) =>
        (old ?? []).filter((task) => task._id !== taskId)
      );
      queryClient.setQueryData<TaskAmount[]>(
        ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
        (old) => {
          if (!old) return old;

          return old
            .map((o) => {
              const oDate = new Date(o.date); // normalize to Date
              if (oDate.toISOString() === date.toISOString()) {
                return {
                  ...o,
                  amount: o.amount - 1,
                };
              }
              return o;
            })
            .filter((o) => o.amount !== 0);
        }
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
