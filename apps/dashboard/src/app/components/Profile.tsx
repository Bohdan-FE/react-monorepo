import clsx from 'clsx';
import { useUser } from '../../hooks/useUser';

function Profile({ full }: { full: boolean }) {
  const { data: user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div
      className={clsx(
        ' px-4 grid transition-all duration-300 z-10 h-34 items-center',
        full
          ? 'grid-cols-[minmax(3.5rem,3.5rem)minmax(auto,1fr)]'
          : 'grid-cols-[minmax(2.2rem,2.2rem)minmax(0px,0fr)]'
      )}
    >
      <div className="aspect-square rounded-full overflow-hidden shrink-0 shadow-small bg-white">
        <img
          className="h-full w-full object-cover object-center"
          src={user.avatarURL || '/jiraiya.png'}
          loading="lazy"
          alt="avatar"
        />
      </div>
      <div className="flex items-center px-4">
        <p className="overflow-hidden whitespace-nowrap">{user.name}</p>
      </div>
    </div>
  );
}

export default Profile;
