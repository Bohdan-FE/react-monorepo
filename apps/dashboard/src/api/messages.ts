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

export const getUnreadMessagesCount = async (): Promise<{
  unreadCount: number;
}> => {
  const axiosResponse = await api.get(`/messages/unread/count`);
  return axiosResponse.data;
};

export const uploadImageMessage = async (
  file: File
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const axiosResponse = await api.post('/messages/image', formData);
  return axiosResponse.data;
};
