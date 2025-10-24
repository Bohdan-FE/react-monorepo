export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
} as const;

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

export interface Message {
  _id: string;
  from: string;
  to: string;
  message: string;
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
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
