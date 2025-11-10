import { FcGoogle } from 'react-icons/fc';

function GoogleLoginButton({
  login,
  isPending,
}: {
  login: () => void;
  isPending: boolean;
}) {
  return (
    <button
      onClick={() => login()}
      disabled={isPending}
      className={`p-3 bg-blue-light text-black rounded-2xl border-2 border-black transition-all shadow-small flex items-center justify-center ${
        isPending ? 'opacity-70 cursor-not-allowed' : 'active:shadow-none'
      }`}
    >
      <FcGoogle className="text-[1.25rem] mr-2" />
      <span>{isPending ? 'Signing in...' : 'Google'}</span>
    </button>
  );
}

export default GoogleLoginButton;
