import { PaginatedFriendsResponse, User } from '../models/User';
import api from './api';

export const fetchFriends = async (
  page: number,
  per_page: number
): Promise<PaginatedFriendsResponse> => {
  const axiosResponse = await api.get(`/friends`, {
    params: {
      page,
      per_page,
    },
  });
  return axiosResponse.data;
};

export const addFriend = async (friendId: string): Promise<User> => {
  const axiosResponse = await api.post(`/friends/accept/${friendId}`);
  return axiosResponse.data;
};

export const removeFriend = async (friendId: string): Promise<User> => {
  const axiosResponse = await api.delete(`/friends/${friendId}`);
  return axiosResponse.data;
};

export const requestFriend = async (friendId: string): Promise<User> => {
  const axiosResponse = await api.post(`/friends/request/${friendId}`);
  return axiosResponse.data;
};

export const rejectFriendRequest = async (friendId: string): Promise<User> => {
  const axiosResponse = await api.post(`/friends/reject/${friendId}`);
  return axiosResponse.data;
};
