import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, UpdateTaskPayload } from '../api/tasks';
import { useStore } from '../store/store';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { date } = useStore(state => state);

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

      const previousTasks = queryClient.getQueryData<any[]>([
        'tasks',
        date.toISOString(),
      ]);

      queryClient.setQueryData<any[]>(
        ['tasks', date.toISOString()],
        old => old?.map(t => (t._id === taskId ? { ...t, ...task } : t)) ?? []
      );

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
