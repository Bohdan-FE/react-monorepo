import { PaginatedMessagesResponse } from '../models/Message';
import api from './api';

export const fetchMessages = async (
  userId: string,
  page: number,
  per_page: number
): Promise<PaginatedMessagesResponse> => {
  const axiosResponse = await api.get(`/messages/${userId}`, {
    params: {
      page,
      per_page,
    },
  });
  return axiosResponse.data;
};
