import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleAuth } from '../api/auth';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { GoogleLoginResponse } from '../models/User';

const saveAuthDataToLocalStorage = (token: string) => {
  localStorage.setItem('authToken', token);
};

function useGoogleLoginCustom() {
  const [data, setData] = useState<GoogleLoginResponse | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: googleAuth,
    onSuccess: (data) => {
      setData(data);
      if (data.token) {
        saveAuthDataToLocalStorage(data.token);
        queryClient.setQueryData(['user'], data);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      mutate(tokenResponse.access_token);
    },
    onError: (errorResponse) => {
      console.error('Login failed:', errorResponse);
    },
  });

  return { login, data, isPending };
}

export default useGoogleLoginCustom;
