import { useQuery } from '@tanstack/react-query';
import { getUnreadMessagesCount } from '../api/messages';

function useUnreadMessagesCount() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['unreadMessagesCount'],
    queryFn: getUnreadMessagesCount,
  });

  return {
    data: data?.unreadCount || 0,
    isLoading,
    error,
  };
}

export default useUnreadMessagesCount;
