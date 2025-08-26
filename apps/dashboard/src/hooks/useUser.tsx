import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/auth';
import { AxiosError } from 'axios';

type FetchUserResponse = {
  email: string;
  name: string;
};

export const useUser = () => {
  return useQuery<FetchUserResponse, AxiosError<{ message: string }>>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem('authToken'),
  });
};
