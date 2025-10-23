export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
export enum RelationshipStatus {
  None = 'none',
  RequestReceived = 'request_received',
  RequestSent = 'request_sent',
  Friend = 'friend',
}

export enum FriendshipStatus {
  Accepted = 'accepted',
  Pending = 'pending',
  Rejected = 'rejected',
}

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

export interface PaginatedFriendsResponse {
  data: (User & {
    friendshipStatus: FriendshipStatus;
    isRequester: boolean;
  })[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    totalPages: number;
  };
}
