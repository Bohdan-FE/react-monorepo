export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    totalPages: number;
  };
}
