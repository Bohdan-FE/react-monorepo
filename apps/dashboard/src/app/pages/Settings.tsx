import { useForm } from 'react-hook-form';
import Input from '../components/ui/Input/Input';
import UploadAvatar from '../components/UpdateAvatar/UpdateAvatar';
import { useUser } from '../../hooks/useUser';
import useUpdateUser from '../../hooks/useUploadAvatar';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Inputs = {
  email: string;
  name: string;
  password: string;
};

function Settings() {
  const { data: user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });
  const [image, setImage] = useState<File | null>(null);
  const {
    mutate: updateUser,
    isError,
    isPending,
    error,
    isSuccess,
  } = useUpdateUser();
  const [showNotifications, setShowNotifications] = useState(
    localStorage.getItem('showNotifications') === 'false' ? false : true
  );

  const onSubmit = (data: Inputs) => {
    updateUser(
      { ...data, file: image || undefined },
      {
        onSuccess: (updatedUser) => {
          reset({
            name: updatedUser.name,
            email: updatedUser.email,
          });

          setImage(null);
        },
      }
    );
  };

  useEffect(() => {
    if (showNotifications) {
      localStorage.setItem('showNotifications', 'true');
    } else {
      localStorage.setItem('showNotifications', 'false');
    }
  }, [showNotifications]);

  return (
    <div className="p-4 h-full">
      <div className=" bg-orange/80 grid grid-cols-2 gap-4 h-full rounded-2xl shadow-big overflow-hidden border-2 border-black backdrop-blur-md">
        <div className=" w-full h-full flex flex-col justify-start p-8 gap-6">
          <p className="text-center font-bold text-3xl uppercase">Profile</p>
          <div></div>
          <UploadAvatar image={image} setImage={setImage} />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className=" flex flex-col ">
              <label htmlFor="name" className="mb-2">
                Change Name
              </label>
              <Input
                id="name"
                autoComplete="off"
                {...register('name', {
                  required: 'Name is required',
                })}
                type="text"
                defaultValue={user?.name}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm pl-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col ">
              <label htmlFor="email" className="mb-2">
                Change Email
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
                defaultValue={user?.email}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm pl-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {isError && (
              <div className="text-red-800 text-sm">
                <p>{error?.response?.data.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={(!isDirty && !image) || !isValid || isPending}
              className={`p-3 bg-blue w-1/2 ml-auto text-white rounded-2xl border-2 border-black active:shadow-none transition-all shadow-small ${
                !isValid || isPending || (!isDirty && !image)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isPending ? 'Loading...' : 'Update Profile'}
            </button>
          </form>
          <div
            className="flex items-center gap-3 cursor-pointer select-none max-w-[18rem] justify-between mt-auto"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <p className="font-medium text-xl">Show notifications</p>
            <div
              className={` w-12 h-6 rounded-full transition-all flex items-center border-black border-2
      ${showNotifications ? 'bg-pink' : 'bg-pink/30 opacity-55'}
    `}
            >
              <div
                className={`
        w-4 h-4 bg-white rounded-full shadow-md transform transition-all
        ${showNotifications ? 'translate-x-6' : 'translate-x-0'}
      `}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-[url('/all-ninja.png')] bg-no-repeat bg-contain bg-right-bottom ">
          {isSuccess && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl p-4 px-8 bg-green-500 shadow-small border-2 border-black mt-25 w-fit mx-auto"
            >
              <p className="text-white text-center  font-semibold text-2xl uppercase ">
                Profile updated successfully!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
