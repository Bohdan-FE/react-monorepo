import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/useLogin';
import Input from './ui/Input/Input';

type Inputs = {
  email: string;
  password: string;
};

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: 'onChange', // enables real-time validation
  });

  const { mutate: login, error, isPending } = useLogin();

  const onSubmit = (data: Inputs) => {
    login(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className=" text-[2.5rem] font-DMSans font-bold">Accaunt Login</p>
      <p className=" font-DMSans">Welcome back Shinobi!</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className=" flex flex-col ">
          <label htmlFor="email" className="mb-2">
            Shinobi ID (Email)
          </label>
          <Input
            id="email"
            autoComplete="off"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            type="email"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm pl-2">{errors.email.message}</p>
          )}
        </div>

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

        {error && (
          <div className="text-red-500 text-sm">
            <p>{error.response?.data.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isPending}
          className={`p-3 bg-orange text-white rounded-2xl border-2 border-black active:shadow-none transition-all shadow-small ${
            !isValid || isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPending ? 'Loading...' : 'Enter the Village'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
