import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, CreateTaskPayload } from '../api/tasks';
import { useStore } from '../store/store';
import { Task } from './useTasks';
import { TaskAmount } from './useTaskAmount';

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { date, firstDayOfMonth, lastDayOfMonth } = useStore((state) => state);

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
        status: 'todo',
        index: previousTasks?.length ?? 0,
        date: date.toISOString(),
      };

      queryClient.setQueryData<Task[]>(['tasks', date.toISOString()], (old) => [
        ...(old ?? []),
        optimisticTask,
      ]);

      queryClient.setQueryData<TaskAmount[]>(
        ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
        (old) => {
          if (!old) return old;

          return old.map((o) => {
            const oDate = new Date(o.date); // normalize to Date
            if (oDate.toISOString() === date.toISOString()) {
              return {
                ...o,
                totalAmount: o.totalAmount + 1,
                todo: o.todo + 1,
              };
            }
            return o;
          });
        }
      );

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
      queryClient.setQueryData<Task[]>(['tasks', date.toISOString()], (old) =>
        (old ?? [])
          .filter((t) => !t._id.startsWith('optimistic-'))
          .concat(realTask)
      );

      queryClient.invalidateQueries({ queryKey: ['tasksAmount'] });
    },
  });
};
