import { TaskStatus } from '../hooks/useTasks';
import api from './api';

export interface CreateTaskPayload {
  description?: string;
  title: string;
  date: string;
  index: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  index?: number;
  status?: TaskStatus;
  date?: Date;
}

export const fetchTasks = async ({ date }: { date: Date }) => {
  const axiosResponse = await api.get(`/tasks`, {
    params: { date },
  });
  return axiosResponse.data;
};

export const createTask = async (task: CreateTaskPayload) => {
  const axiosResponse = await api.post(`/tasks`, task);
  return axiosResponse.data;
};

export const updateTask = async (taskId: string, task: UpdateTaskPayload) => {
  const axiosResponse = await api.patch(`/tasks/${taskId}`, task);
  return axiosResponse.data;
};

export const deleteTask = async (taskId: string) => {
  const axiosResponse = await api.delete(`/tasks/${taskId}`);
  return axiosResponse.data;
};

export const fetchAmountOfTasks = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const axiosResponse = await api.get(`/tasks/amount`, {
    params: {
      startDate,
      endDate,
    },
  });
  return axiosResponse.data;
};

export const reorderTasks = async (
  tasks: { taskId: string; index: number; status: TaskStatus }[]
) => {
  const axiosResponse = await api.patch(`/tasks/reorder`, { tasks });
  return axiosResponse.data;
};
