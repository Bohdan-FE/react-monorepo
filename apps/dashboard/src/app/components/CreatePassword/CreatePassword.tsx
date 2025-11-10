import { useForm } from 'react-hook-form';
import Input from '../ui/Input/Input';
import { useRegister } from '../../../hooks/useRegister';
import { useLogin } from '../../../hooks/useLogin';

interface Inputs {
  password: string;
  'repeat-password': string;
}

function CreatePassword({
  credentials,
}: {
  credentials: { email: string; name: string };
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: 'onChange',
  });
  const {
    mutate: registerFn,
    error,
    isPending: isRegisterPending,
  } = useRegister();
  const { mutate: login, isPending: isLoginPending } = useLogin();

  const onSubmit = (data: Inputs) => {
    registerFn(
      { password: data.password, ...credentials },
      {
        onSuccess: () => {
          login({ email: credentials.email, password: data.password });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <p className=" text-[2.5rem] font-DMSans font-bold">Create password</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className=" flex flex-col">
          <label htmlFor="password" className="mb-2">
            Secret Jutsu (Password)
          </label>
          <div>
            <Input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
              type="password"
              autoComplete="off"
              placeholder="Enter your password"
            />
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm pl-2">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className=" flex flex-col">
          <label htmlFor="repeat-password" className="mb-2">
            Repeat Secret Jutsu (Password)
          </label>
          <div>
            <Input
              {...register('repeat-password', {
                required: 'Please repeat your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
              type="password"
              autoComplete="off"
              placeholder="Repeat your password"
            />
          </div>

          {errors['repeat-password'] && (
            <p className="text-red-500 text-sm pl-2">
              {errors['repeat-password'].message}
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            <p>{error.response?.data.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isRegisterPending || isLoginPending}
          className={`p-3 bg-orange text-white rounded-2xl border-2 border-black active:shadow-none transition-all shadow-small ${
            !isValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isRegisterPending || isLoginPending
            ? 'Creating Account...'
            : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default CreatePassword;
