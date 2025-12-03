import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, LoginPayload } from '../api/auth';
import { AxiosError } from 'axios';

type AuthResponse = {
  token: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

const saveAuthDataToLocalStorage = (data: AuthResponse) => {
  localStorage.setItem('authToken', data.token);
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AuthResponse,
    AxiosError<{ message: string }>,
    LoginPayload
  >({
    mutationFn: (payload) => login(payload),
    onSuccess: (data) => {
      saveAuthDataToLocalStorage(data);
      queryClient.setQueryData(['user'], data);
    },
  });
};
