import { PaginatedUsersResponse } from '../models/User';
import api from './api';

export const fetchUsers = async (
  page: number,
  per_page: number
): Promise<PaginatedUsersResponse> => {
  const axiosResponse = await api.get(`/users`, {
    params: {
      page,
      per_page,
    },
  });
  return axiosResponse.data;
};
