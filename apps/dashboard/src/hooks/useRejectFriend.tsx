import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectFriendRequest } from '../api/friends';
import { User } from '../models/User';

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, string>({
    mutationFn: (friendId) => rejectFriendRequest(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
