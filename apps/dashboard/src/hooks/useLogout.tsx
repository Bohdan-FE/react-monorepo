import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth';

const removeAuthDataFromLocalStorage = () => {
  localStorage.removeItem('authToken');
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation<any>({
    mutationFn: () => logout(),
    onSuccess: () => {
      removeAuthDataFromLocalStorage();
      queryClient.setQueryData(['user'], null);
    },
  });
};
