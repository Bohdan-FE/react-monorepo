import { useForm } from 'react-hook-form';
import { useRegister } from '../../hooks/useRegister';
import Input from './ui/Input/Input';
import { useLogin } from '../../hooks/useLogin';

type Inputs = {
  email: string;
  password: string;
  name: string;
  'repeat-password': string;
};

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<Inputs>({
    mode: 'onChange',
  });
  const {
    mutate: registerFn,
    error: registerError,
    isPending: isRegisterPending,
  } = useRegister();
  const {
    mutate: login,
    error: loginError,
    isPending: isLoginPending,
  } = useLogin();

  const onSubmit = (data: Inputs) => {
    registerFn(data, {
      onSuccess: () => {
        login({ email: data.email, password: data.password });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <p className=" text-[2.5rem] font-DMSans font-bold">
        Create your account
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className=" flex flex-col ">
          <label htmlFor="name" className="mb-2">
            Shinobi Name
          </label>
          <Input
            id="name"
            autoComplete="off"
            {...register('name', {
              required: 'Name is required',
            })}
            type="text"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm pl-2">{errors.name.message}</p>
          )}
        </div>

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

        {(registerError || loginError) && (
          <div className="text-red-500 text-sm">
            <p>
              {registerError?.response?.data.message ||
                loginError?.response?.data.message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isRegisterPending || isLoginPending}
          className={`p-3 bg-orange text-white rounded-2xl border-2 border-black active:shadow-none transition-all shadow-small ${
            !isValid || isRegisterPending || isLoginPending
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {isRegisterPending || isLoginPending
            ? 'Loading...'
            : 'Enter the Village'}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
