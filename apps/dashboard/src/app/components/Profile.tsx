import { useUser } from '../../hooks/useUser';

function Profile() {
  const { data: user } = useUser();

  if (!user) {
    return <div className="p-8">Please Login</div>;
  }

  return (
    <div className="flex items-center gap-4 p-8 px-4">
      <div className="w-14 aspect-square rounded-full overflow-hidden shrink-0">
        <img
          className="h-full w-full object-cover object-center"
          src="https://m.media-amazon.com/images/I/51d9TO-CgbL.jpg"
          loading="lazy"
          alt="avatar"
        />
      </div>
      <p>{user.name}</p>
    </div>
  );
}

export default Profile;
