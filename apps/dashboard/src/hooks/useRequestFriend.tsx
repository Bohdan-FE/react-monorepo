import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '../models/User';
import { useStore } from '../store/store';

export const useRequestFriend = () => {
  const queryClient = useQueryClient();
  const emit = useStore((state) => state.emit);
  const once = useStore((state) => state.once);
  const isConnected = useStore((state) => state.isConnected);
  const off = useStore((state) => state.off);

  return useMutation<User, Error, string>({
    mutationFn: (friendId) =>
      new Promise((resolve, reject) => {
        if (!isConnected) return reject(new Error('Socket not connected'));

        emit('sendFriendRequest', friendId);

        const onSuccess = (data: any) => {
          if (data?.data) resolve(data.data);
          else resolve(data);
          cleanup();
        };

        const onError = (err: any) => {
          reject(new Error(err.message || 'Failed to send friend request'));
          cleanup();
        };

        once('friendRequestSent', onSuccess);
        once('error', onError);

        const cleanup = () => {
          off('friendRequestSent', onSuccess);
          off('error', onError);
        };
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
