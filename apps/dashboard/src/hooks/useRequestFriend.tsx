import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestFriend } from '../api/friends';
import { User } from '../models/User';

export const useRequestFriend = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, string>({
    mutationFn: (friendId) => requestFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
