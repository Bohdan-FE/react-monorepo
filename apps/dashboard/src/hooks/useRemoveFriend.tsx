import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '../models/User';
import { useStore } from '../store/store';

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  const socket = useStore((state) => state.socket);

  return useMutation<User, Error, string>({
    mutationFn: (friendId) =>
      new Promise((resolve, reject) => {
        if (!socket) return reject(new Error('Socket not connected'));

        socket.emit('removeFriend', friendId);

        const onSuccess = (data: any) => {
          if (data?.data) resolve(data.data);
          else resolve(data);
          cleanup();
        };

        const onError = (err: any) => {
          reject(new Error(err.message || 'Failed to remove friend'));
          cleanup();
        };

        // Listen once for server responses
        socket.once('friendRemoved', onSuccess);
        socket.once('error', onError);

        const cleanup = () => {
          socket.off('friendRemoved', onSuccess);
          socket.off('error', onError);
        };
      }),

    onSuccess: () => {
      // Re-fetch the updated list of users/friends
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
