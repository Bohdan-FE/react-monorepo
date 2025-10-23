import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFriend } from '../api/friends';
import { User } from '../models/User';

export const useAcceptFriendship = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, string>({
    mutationFn: (friendId) => addFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
};
