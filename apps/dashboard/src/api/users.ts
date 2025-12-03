import { PaginatedUsersResponse, UserFilter } from '../models/User';
import api from './api';

export const fetchUsers = async (
  page: number,
  per_page: number,
  filter: UserFilter = 'all',
  search = ''
): Promise<PaginatedUsersResponse> => {
  const axiosResponse = await api.get(`/users`, {
    params: {
      page,
      per_page,
      filter,
      search,
    },
  });
  return axiosResponse.data;
};
