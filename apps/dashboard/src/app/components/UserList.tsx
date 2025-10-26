import { InfinityScrollContainer } from '@acme/ui';
import useUsersPaginated from '../../hooks/useUsersPaginated';
import { UserFilter } from '../../models/User';
import UserBox from './UserBox/UserBox';

interface UserListProps {
  filter?: UserFilter;
  search?: string;
}

function UserList({ filter, search }: UserListProps) {
  const {
    data: users,
    hasNext,
    fetchNext,
    isFetching,
  } = useUsersPaginated(filter || 'all', search || '');

  return (
    <InfinityScrollContainer loadMore={fetchNext} hasMore={hasNext}>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id}>
            <UserBox user={user} />
          </li>
        ))}
      </ul>
      {isFetching && <div className="loader mx-auto mt-4"></div>}
    </InfinityScrollContainer>
  );
}

export default UserList;
