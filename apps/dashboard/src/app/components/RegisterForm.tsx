import { useForm } from 'react-hook-form';
import { useRegister } from '../../hooks/useRegister';
import { JSX, useState } from 'react';
import LoginForm from './LoginForm';

type Inputs = {
  email: string;
  password: string;
  name: string;
};

function RegisterForm({
  setActiveModal,
}: {
  setActiveModal: (modal: JSX.Element) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: 'onChange',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const { mutate: registerFn, error } = useRegister();

  const onSubmit = (data: Inputs) => {
    registerFn(data, {
      onSuccess: () => {
        setIsRegistered(true);
      },
    });
  };

  return (
    <div>
      {!isRegistered ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters long',
              },
            })}
            type="text"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            type="email"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

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
      ) : (
        <div>
          <h1 className="text-green-500">Registration Successful!</h1>
          <button onClick={() => setActiveModal(<LoginForm />)}>
            go to login
          </button>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
