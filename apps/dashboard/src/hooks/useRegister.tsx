import { useMutation } from '@tanstack/react-query';
import { register, RegisterPayload } from '../api/auth';
import { AxiosError } from 'axios';

type RegisterResponse = {
  email: string;
  name: string;
  avatar: string;
};

export const useRegister = () => {
  return useMutation<
    RegisterResponse,
    AxiosError<{ message: string }>,
    RegisterPayload
  >({
    mutationFn: payload => register(payload),
  });
};
