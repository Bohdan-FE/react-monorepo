// hooks/useUsers.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedUsersResponse, UserFilter } from '../models/User';
import { AxiosError } from 'axios';
import { fetchUsers } from '../api/users';

export const useUsersPaginated = (
  filter: UserFilter = 'all',
  search: string = '',
  perPage = 10
) => {
  const query = useInfiniteQuery<
    PaginatedUsersResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ['users', filter, search],
    queryFn: ({ pageParam }) =>
      fetchUsers(pageParam as number, perPage, filter, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // If current page is last, return undefined
      return lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem('authToken'),
  });

  // Flatten users from all loaded pages
  const users = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    data: users,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchNext: query.fetchNextPage,
    hasNext: query.hasNextPage,
    error: query.error,
  };
};

export default useUsersPaginated;
