import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/auth';
import { AxiosError } from 'axios';
import { User } from '../models/User';

export const useUser = () => {
  return useQuery<User, AxiosError<{ message: string }>>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem('authToken'),
    refetchOnMount: true,
  });
};
