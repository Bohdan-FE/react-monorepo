import { Message } from './Message';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastSeen: string;
  relationshipStatus?: RelationshipStatus;
  lastMessage?: Message;
}

export const RelationshipStatus = {
  NONE: 'none',
  REQUEST_RECEIVED: 'request_received',
  REQUEST_SENT: 'request_sent',
  FRIEND: 'friend',
} as const;

export type RelationshipStatus =
  (typeof RelationshipStatus)[keyof typeof RelationshipStatus];

export interface PaginatedUsersResponse {
  data: (User & {
    relationshipStatus: RelationshipStatus;
  })[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    totalPages: number;
  };
}

export const UserFilter = {
  all: 'all',
  friends: 'friends',
  nonFriends: 'non-friends',
  requestSent: 'request_sent',
  requestReceived: 'request_received',
} as const;

export type UserFilter = (typeof UserFilter)[keyof typeof UserFilter];
