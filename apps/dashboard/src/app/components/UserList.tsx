import { InfiniteScrollContainer } from '@acme/ui';
import useUsersPaginated from '../../hooks/useUsersPaginated';
import { UserFilter } from '../../models/User';
import UserBox from './UserBox/UserBox';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UserListProps {
  filter?: UserFilter;
  search?: string;
}

function UserList({ filter, search }: UserListProps) {
  const {
    data: users,
    hasNext,
    fetchNext,
    isFetchingNextPage,
  } = useUsersPaginated(filter || 'all', search || '');
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.resetQueries({ queryKey: ['users', filter, search] });
    };
  }, []);

  return (
    <>
      <ul className="space-y-2 pr-4 py-4">
        {users.map((user) => (
          <li key={user._id}>
            <UserBox user={user} />
          </li>
        ))}
        <InfiniteScrollContainer loadMore={fetchNext} hasNext={hasNext} />
      </ul>
      {isFetchingNextPage && <div className="loader mx-auto mt-4"></div>}
    </>
  );
}

export default UserList;
