import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, UpdateUserPayload } from '../api/auth';
import { User } from '../models/User';
import { AxiosError } from 'axios';

function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, AxiosError<{ message: string }>, UpdateUserPayload>({
    mutationFn: (data: UpdateUserPayload) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export default useUpdateUser;
