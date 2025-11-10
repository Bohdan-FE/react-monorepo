import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '../models/User';
import { useStore } from '../store/store';

export const useAcceptFriendship = () => {
  const queryClient = useQueryClient();
  const socket = useStore((state) => state.socket);

  return useMutation<User, Error, string>({
    mutationFn: (friendId) =>
      new Promise((resolve, reject) => {
        if (!socket) return reject(new Error('Socket not connected'));

        // send event to the server
        socket.emit('acceptFriendRequest', friendId);

        // wait for confirmation
        const onSuccess = (data: any) => {
          resolve(data?.data || data);
          cleanup();
        };

        const onError = (err: any) => {
          reject(new Error(err.message || 'Failed to accept friend request'));
          cleanup();
        };

        socket.once('friendRequestAccepted', onSuccess);
        socket.once('error', onError);

        const cleanup = () => {
          socket.off('friendRequestAccepted', onSuccess);
          socket.off('error', onError);
        };
      }),

    onSuccess: () => {
      // refresh friend list or user data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
