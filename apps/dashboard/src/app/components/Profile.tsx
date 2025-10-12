import clsx from 'clsx';
import { useUser } from '../../hooks/useUser';

function Profile({ full }: { full: boolean }) {
  const { data: user } = useUser();

  if (!user) {
    return;
  }

  return (
    <div
      className={clsx(
        ' py-8 px-4 grid transition-all duration-300 z-10',
        full
          ? 'grid-cols-[minmax(3.5rem,3.5rem)minmax(auto,1fr)]'
          : 'grid-cols-[minmax(2rem,1rem)minmax(0px,0fr)]'
      )}
    >
      <div className="aspect-square rounded-full overflow-hidden shrink-0 shadow-small">
        <img
          className="h-full w-full object-cover object-center"
          src="https://m.media-amazon.com/images/I/51d9TO-CgbL.jpg"
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
