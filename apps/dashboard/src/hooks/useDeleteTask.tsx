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

      const previousTasks = queryClient.getQueryData<Task[]>(taskKey);

      queryClient.setQueryData<Task[]>(taskKey, (old) =>
        (old ?? []).filter((task) => task._id !== taskId)
      );
      queryClient.setQueryData<TaskAmount[]>(
        ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
        (old) => {
          if (!old) return old;

          return old
            .map((o) => {
              const oDate = new Date(o.date);

              const deletedTask = previousTasks?.find((t) => t._id === taskId);

              if (oDate.toISOString() === date.toISOString()) {
                return {
                  ...o,
                  totalAmount: o.totalAmount - 1,
                  in_progress:
                    deletedTask?.status === 'in_progress'
                      ? o.in_progress - 1
                      : o.in_progress,
                  done: deletedTask?.status === 'done' ? o.done - 1 : o.done,
                  todo: deletedTask?.status === 'todo' ? o.todo - 1 : o.todo,
                };
              }
              return o;
            })
            .filter((o) => o.totalAmount !== 0);
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
