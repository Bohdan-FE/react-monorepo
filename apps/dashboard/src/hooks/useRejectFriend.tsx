import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '../models/User';
import { useStore } from '../store/store';

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();
  const socket = useStore((state) => state.socket);

  return useMutation<User, Error, string>({
    mutationFn: (friendId) =>
      new Promise((resolve, reject) => {
        if (!socket) return reject(new Error('Socket not connected'));

        // Emit event to reject a friend request
        socket.emit('rejectFriendRequest', friendId);

        const onSuccess = (data: any) => {
          resolve(data?.data || data);
          cleanup();
        };

        const onError = (err: any) => {
          reject(new Error(err.message || 'Failed to reject friend request'));
          cleanup();
        };

        // Listen for one-time responses
        socket.once('friendRequestRejected', onSuccess);
        socket.once('error', onError);

        const cleanup = () => {
          socket.off('friendRequestRejected', onSuccess);
          socket.off('error', onError);
        };
      }),

    onSuccess: () => {
      // refresh the list after rejecting
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
