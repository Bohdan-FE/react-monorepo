import { useForm } from 'react-hook-form';
import Input from '../components/ui/Input/Input';
import UploadAvatar from '../components/UpdateAvatar/UpdateAvatar';
import { useUser } from '../../hooks/useUser';
import useUpdateUser from '../../hooks/useUploadAvatar';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMinus } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';

type Inputs = {
  name: string;
  'repeat-newPassword': string;
  oldPassword: string;
  newPassword: string;
};

function Settings() {
  const { data: user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
    resetField,
  } = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
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
  const [changeIsOpen, setChangeIsOpen] = useState(false);

  const onSubmit = (data: Inputs) => {
    updateUser(
      {
        name: data.name,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        file: image || undefined,
      },
      {
        onSuccess: (updatedUser) => {
          reset({
            name: updatedUser.name,
            oldPassword: '',
            newPassword: '',
            'repeat-newPassword': '',
          });
          setChangeIsOpen(false);
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

  useEffect(() => {
    if (!changeIsOpen) {
      resetField('oldPassword');
      resetField('newPassword');
      resetField('repeat-newPassword');
    }
  }, [changeIsOpen]);

  return (
    <div className="p-4 h-full">
      <div className=" bg-orange/80 grid grid-cols-2 gap-4 h-full rounded-2xl shadow-big overflow-hidden border-2 border-black backdrop-blur-md overflow-y-auto">
        <div className=" w-full h-full flex flex-col justify-start p-5 px-7 gap-6">
          <div className="flex items-end justify-between">
            <UploadAvatar image={image} setImage={setImage} />
            <div
              className="flex items-center gap-6 cursor-pointer select-none max-w-[18rem] justify-between mt-auto"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <p className="font-medium ">Show notifications</p>
              <div
                className={` w-12 h-5 rounded-full transition-all flex items-center border-black border-2 ${
                  showNotifications ? 'bg-pink' : 'bg-pink/30 opacity-55'
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-all ${
                    showNotifications ? 'translate-x-7' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
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

            <div className="flex items-center justify-between">
              <p>Change Password</p>
              <div
                className="size-[2rem] rounded-md bg-pink border-2 border-black active:scale-95 active:shadow-none transition-all shadow-small flex items-center justify-center text-white cursor-pointer"
                onClick={() => setChangeIsOpen((prev) => !prev)}
              >
                {changeIsOpen ? <FiMinus /> : <FaPlus />}
              </div>
            </div>

            {changeIsOpen && (
              <div className="p-3 border-2 rounded-xl space-y-2">
                <div className=" flex flex-col">
                  <label htmlFor="oldPassword" className="mb-2">
                    Old Password
                  </label>
                  <div>
                    <Input
                      {...register('oldPassword', {
                        required: changeIsOpen ? 'Password is required' : false,
                        minLength: changeIsOpen
                          ? {
                              value: 6,
                              message:
                                'Password must be at least 6 characters long',
                            }
                          : undefined,
                      })}
                      type="password"
                      autoComplete="off"
                      placeholder="Enter your old password"
                    />
                  </div>

                  {errors.oldPassword && (
                    <p className="text-red-500 text-sm pl-2">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div className=" flex flex-col">
                  <label htmlFor="newPassword" className="mb-2">
                    New Password
                  </label>
                  <div>
                    <Input
                      {...register('newPassword', {
                        required: changeIsOpen ? 'Password is required' : false,
                        minLength: changeIsOpen
                          ? {
                              value: 6,
                              message:
                                'Password must be at least 6 characters long',
                            }
                          : undefined,
                      })}
                      type="password"
                      autoComplete="off"
                      placeholder="Enter your new password"
                    />
                  </div>

                  {errors.newPassword && (
                    <p className="text-red-500 text-sm pl-2">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className=" flex flex-col">
                  <label htmlFor="repeat-newPassword" className="mb-2">
                    Repeat New Password
                  </label>
                  <div>
                    <Input
                      {...register('repeat-newPassword', {
                        required: changeIsOpen
                          ? 'Please repeat your password'
                          : false,
                        validate: changeIsOpen
                          ? (value) =>
                              value === watch('newPassword') ||
                              'Passwords do not match'
                          : undefined,
                      })}
                      type="password"
                      autoComplete="off"
                      placeholder="Repeat your password"
                    />
                  </div>

                  {errors['repeat-newPassword'] && (
                    <p className="text-red-500 text-sm pl-2">
                      {errors['repeat-newPassword'].message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {isError && (
              <div className="text-red-800 text-sm">
                <p>{error?.response?.data.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={(!isDirty && !image) || !isValid || isPending}
              className={`p-2  bg-blue w-1/2 ml-auto mt-4 text-white rounded-2xl border-2 border-black active:shadow-none transition-all shadow-small ${
                !isValid || isPending || (!isDirty && !image)
                  ? 'opacity-50 pointer-events-none cursor-not-allowed'
                  : ''
              }`}
            >
              {isPending ? 'Loading...' : 'Update Profile'}
            </button>
          </form>
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
