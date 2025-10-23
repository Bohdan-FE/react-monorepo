import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { fetchFriends } from '../api/friends';
import { PaginatedFriendsResponse, User } from '../models/User';

export const useFriendsPaginated = (perPage = 20) => {
  const query = useInfiniteQuery<
    PaginatedFriendsResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ['friends'],
    queryFn: ({ pageParam = 1 }) => fetchFriends(pageParam as number, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem('authToken'),
  });

  const friends = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    data: friends,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchNext: query.fetchNextPage,
    hasNext: query.hasNextPage,
    error: query.error,
  };
};
