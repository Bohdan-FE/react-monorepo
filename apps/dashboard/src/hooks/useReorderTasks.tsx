// src/hooks/useReorderTasks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reorderTasks } from '../api/tasks';
import { useStore } from '../store/store';

export const useReorderTasks = () => {
  const queryClient = useQueryClient();
  const date = useStore(state => state.date);

  return useMutation({
    mutationFn: reorderTasks,
    onMutate: async newOrder => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', date.toISOString()],
      });
      const previousTasks = queryClient.getQueryData<any[]>([
        'tasks',
        date.toISOString(),
      ]);

      queryClient.setQueryData(
        ['tasks', date.toISOString()],
        (old: { _id: string; index: number }[] | undefined) =>
          old?.map((task: { _id: string; index: number }) => {
            const updated = newOrder.find(t => t.taskId === task._id);
            return updated ? { ...task, index: updated.index } : task;
          }) ?? []
      );

      return { previousTasks };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousTasks) {
        queryClient.setQueryData(
          ['tasks', date.toISOString()],
          ctx.previousTasks
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', date.toISOString()],
      });
    },
  });
};
