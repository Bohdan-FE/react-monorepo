import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Input({ type, ...props }: { type: string; [key: string]: any }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="border-2 rounded-xl bg-white flex items-center">
      <input
        {...props}
        className="p-3 focus:outline-none outline-none text-[1.25rem] w-full h-full"
        type={
          type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type
        }
      />
      {type === 'password' && (
        <button
          type="button"
          className="mr-3"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <FiEyeOff className="text-[1.25rem]" />
          ) : (
            <FiEye className="text-[1.25rem]" />
          )}
        </button>
      )}
    </div>
  );
}

export default Input;
