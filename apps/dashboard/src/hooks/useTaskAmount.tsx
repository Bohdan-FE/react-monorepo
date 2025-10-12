import { useQuery } from '@tanstack/react-query';
import { fetchAmountOfTasks } from '../api/tasks';

export interface TaskAmount {
  date: string;
  totalAmount: number;
  in_progress: number;
  done: number;
  todo: number;
}

interface UseTasksAmountProps {
  startDate?: Date;
  endDate?: Date;
  enabled?: boolean;
}

export const useTasksAmount = ({ startDate, endDate }: UseTasksAmountProps) => {
  return useQuery<TaskAmount[]>({
    queryKey: ['tasksAmount', startDate, endDate],
    queryFn: () =>
      fetchAmountOfTasks({
        startDate: startDate!,
        endDate: endDate!,
      }),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};
