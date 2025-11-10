import { GoogleLoginResponse } from '../models/User';
import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginPayload) => {
  const axiosResponse = await api.post(`/auth/login`, {
    email,
    password,
  });
  return axiosResponse.data;
};

export const register = async ({ name, email, password }: RegisterPayload) => {
  const axiosResponse = await api.post(`/auth/register`, {
    name,
    email,
    password,
  });

  return axiosResponse.data;
};

export const googleAuth = async (
  access_token: string
): Promise<GoogleLoginResponse> => {
  const res = await api.post('/auth/google', {
    access_token,
  });
  return res.data;
};

export const fetchUser = async () => {
  const axiosResponse = await api.get(`/auth/current`);
  return axiosResponse.data;
};

export const logout = async () => {
  const axiosResponse = await api.post(`/auth/logout`);
  return axiosResponse.data;
};
