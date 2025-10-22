export interface Message {
  _id: string;
  from: string;
  to: string;
  message: string;
  createdAt?: string;
}

export interface PaginatedMessagesResponse {
  data: Message[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    totalPages: number;
  };
}
