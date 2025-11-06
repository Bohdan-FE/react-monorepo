import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/useLogin';

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

  const { mutate: login, error } = useLogin();

  const onSubmit = (data: Inputs) => {
    login(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className=" text-[2.5rem] font-DMSans font-bold">Accaunt Login</p>
      <p className=" font-DMSans">Welcome back Shinobi!</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className=" flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            type="email"
            placeholder="Enter your email address"
            className="p-3 border-2 border-white/30 rounded-sm !bg-black/30 focus:outline-none outline-none text-[1.25rem]"
          />
        </div>

        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          })}
          type="password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        {error && (
          <div className="text-red-500">
            <p>{error.response?.data.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className={`p-3 bg-blue-300 ${
            !isValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
