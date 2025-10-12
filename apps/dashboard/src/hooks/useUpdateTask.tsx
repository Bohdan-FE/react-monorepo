import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, UpdateTaskPayload } from '../api/tasks';
import { Task } from './useTasks';
import { TaskAmount } from './useTaskAmount';
import { useStore } from '../store/store';

export const useUpdateTask = (date: Date) => {
  const queryClient = useQueryClient();
  const { firstDayOfMonth, lastDayOfMonth, selectTask } = useStore();

  return useMutation({
    mutationFn: ({
      taskId,
      task,
      updateSelected,
    }: {
      taskId: string;
      task: UpdateTaskPayload;
      updateSelected?: boolean;
    }) => updateTask(taskId, task),

    onMutate: async ({ taskId, task }) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', date.toISOString()],
      });

      await queryClient.cancelQueries({
        queryKey: ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
      });

      const previousTasks = queryClient.getQueryData<Task[]>([
        'tasks',
        date.toISOString(),
      ]);

      const oldDate = date;
      const newDate = task.date ? new Date(task.date) : oldDate;

      const oldDateNormalized = oldDate.setHours(0, 0, 0, 0);
      const newDateNormalized = newDate.setHours(0, 0, 0, 0);

      const movedTask = previousTasks?.find((t) => t._id === taskId);

      queryClient.setQueryData<Task[]>(
        ['tasks', oldDate.toISOString()],
        (old) => {
          if (!old) return [];
          return old.filter((t) => {
            const taskDate = new Date(t.date).setHours(0, 0, 0, 0);
            if (t._id === taskId && taskDate === oldDateNormalized) {
              return false;
            }
            return true;
          });
        }
      );

      if (movedTask) {
        // queryClient.setQueryData<TaskAmount[]>(
        //   ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
        //   (old) => {
        //     if (!old) return old;
        //     const oldStatus = movedTask.status;
        //     const newStatus = task.status ? task.status : oldStatus;
        //     console.log({ oldStatus, newStatus });
        //     if (oldStatus !== newStatus) {
        //       const dayData = old.find(
        //         (o) =>
        //           new Date(o.date).setHours(0, 0, 0, 0) === oldDateNormalized
        //       );

        //       if (dayData) {
        //         dayData[oldStatus] = Math.max(0, dayData[oldStatus] - 1);
        //         dayData[newStatus] = (dayData[newStatus] || 0) + 1;
        //         return [...old, dayData];
        //       }
        //     }
        //     return old;
        //   }
        // );

        queryClient.setQueryData<Task[]>(
          ['tasks', newDate.toISOString()],
          (old) => (old ? [...old, movedTask] : [movedTask])
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
                  return {
                    ...o,
                    totalAmount: o.totalAmount - 1,
                    in_progress: o.in_progress ? o.in_progress - 1 : 0,
                    done: o.done ? o.done - 1 : 0,
                    todo: o.todo ? o.todo - 1 : 0,
                  };
                }
                return o;
              })
              .filter((o) => o.totalAmount !== 0);
          }
        );

        queryClient.setQueryData<TaskAmount[]>(
          ['tasksAmount', firstDayOfMonth, lastDayOfMonth],
          (old) => {
            if (!old) {
              return old;
            }

            let found = false;
            const updated = old.map((o) => {
              const oDateNormalized = new Date(o.date).setHours(0, 0, 0, 0);
              if (oDateNormalized === newDateNormalized) {
                found = true;
                return { ...o, totalAmount: o.totalAmount + 1 };
              }
              return o;
            });

            if (!found) {
              updated.push({
                date: new Date(newDateNormalized).toISOString(),
                totalAmount: 1,
                in_progress: 0,
                done: 0,
                todo: 1,
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

    onSuccess: (task, variables) => {
      if (variables.updateSelected) {
        selectTask(task);
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
