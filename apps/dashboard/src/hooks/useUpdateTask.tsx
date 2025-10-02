import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, UpdateTaskPayload } from '../api/tasks';
import { Task } from './useTasks';
import { TaskAmount } from './useTaskAmount';
import { useStore } from '../store/store';

export const useUpdateTask = (date: Date) => {
  const queryClient = useQueryClient();
  const { firstDayOfMonth, lastDayOfMonth } = useStore();
  return useMutation({
    mutationFn: ({
      taskId,
      task,
    }: {
      taskId: string;
      task: UpdateTaskPayload;
    }) => updateTask(taskId, task),

    onMutate: async ({ taskId, task }) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', date.toISOString()],
      });

      await queryClient.cancelQueries({
        queryKey: ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
      });

      const previousTasks = queryClient.getQueryData<any[]>([
        'tasks',
        date.toISOString(),
      ]);

      const oldDate = date;
      const newDate = task.date ? new Date(task.date) : oldDate;

      const oldDateNormalized = oldDate.setHours(0, 0, 0, 0);
      const newDateNormalized = newDate.setHours(0, 0, 0, 0);

      let movedTask: Task | null = null;

      queryClient.setQueryData<Task[]>(
        ['tasks', oldDate.toISOString()],
        (old) => {
          if (!old) return [];
          return old.filter((t) => {
            const taskDate = new Date(t.date).setHours(0, 0, 0, 0);
            if (t._id === taskId && taskDate === oldDateNormalized) {
              movedTask = { ...t, ...task, date: newDate.toISOString() };
              return false;
            }
            return true;
          });
        }
      );

      // 2. Добавляем в новую дату (если нашли в старой)
      if (movedTask) {
        queryClient.setQueryData<Task[]>(
          ['tasks', newDate.toISOString()],
          (old) => (old ? [...old, movedTask!] : [movedTask!])
        );
      }
      if (oldDateNormalized !== newDateNormalized) {
        queryClient.setQueryData<TaskAmount[]>(
          ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
          (old) => {
            if (!old) return old;
            return old
              .map((o) => {
                const oDate = new Date(o.date).setHours(0, 0, 0, 0);
                if (oDate === oldDateNormalized) {
                  return { ...o, amount: o.amount - 1 };
                }
                return o;
              })
              .filter((o) => o.amount !== 0);
          }
        );

        queryClient.setQueryData<TaskAmount[]>(
          ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
          (old) => {
            if (!old) {
              return [
                { date: new Date(newDateNormalized).toISOString(), amount: 1 },
              ];
            }

            let found = false;
            const updated = old.map((o) => {
              const oDateNormalized = new Date(o.date).setHours(0, 0, 0, 0);
              if (oDateNormalized === newDateNormalized) {
                found = true;
                return { ...o, amount: o.amount + 1 };
              }
              return o;
            });

            if (!found) {
              updated.push({
                date: new Date(newDateNormalized).toISOString(),
                amount: 1,
              });
            }

            updated.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            return updated;
          }
        );
      }

      return { previousTasks };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['tasks', date.toISOString()],
          context.previousTasks
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      queryClient.invalidateQueries({
        queryKey: ['tasksAmount'],
      });
    },
  });
};
