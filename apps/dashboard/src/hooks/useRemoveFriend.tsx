import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeFriend } from '../api/friends';
import { User } from '../models/User';

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, string>({
    mutationFn: (friendId) => removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
