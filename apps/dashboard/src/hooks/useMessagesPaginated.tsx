import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PaginatedMessagesResponse } from '../models/Message';
import { fetchMessages } from '../api/messages';
import { useMemo } from 'react';

export const useMessagesPaginated = ({
  userId,
  perPage = 20,
  enabled,
}: {
  userId: string;
  perPage?: number;
  enabled?: boolean;
}) => {
  const query = useInfiniteQuery<
    PaginatedMessagesResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ['messages', userId],
    queryFn: async ({ pageParam }) =>
      fetchMessages(userId, pageParam as number, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined;
    },
    staleTime: 0,
    enabled: !!userId && (enabled ?? true),
    refetchOnMount: 'always',
  });

  const messages = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data?.pages]
  );

  return {
    data: messages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchNext: query.fetchNextPage,
    hasNext: query.hasNextPage,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
