import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/tasks';

export interface Task {
  _id: string;
  description: string;
  done: boolean;
  index: number;
  date: Date;
}

export const useTasks = (date: Date) => {
  return useQuery<Task[]>({
    queryKey: ['tasks', date.toISOString()],
    queryFn: () => fetchTasks({ date }),
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });
};
