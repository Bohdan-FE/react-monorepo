import { useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router';

function Authenticate() {
  const { data: user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="h-screen grid grid-cols-2  relative gap-10 p-4  bg-amber-50">
      <div className="h-full  relative flex flex-col justify-center overflow-hidden gap-8 p-6 rounded-2xl shadow-big border-2 bg-blue-dark text-white border-black">
        <div className="flex justify-between">
          <img
            className="w-[15rem] -rotate-6 shrink-0"
            src="naruto-logo.png"
            alt=""
          />
          <img
            className="drop-shadow-[1px_1px_5px_rgba(0,0,0,0.5)] w-[15rem]"
            src="surikens.png"
            alt=""
          />
        </div>

        <p className="font-black text-[3.5rem] leading-none capitalize  mt-auto">
          Begin your shinobi journey.
        </p>
        <p className=" max-w-md font-DMSans">
          Welcome back. Log in to continue your mission and connect with fellow
          ninjas in the Hidden Leaf Village
        </p>
        <div className="h-[42%] flex mt-auto items-end">
          <img className="h-[75%]" src="/rocklee-full.png" alt="" />
          <img className="h-[90%]" src="/sai-full.png" alt="" />
          <img className="h-[85%]" src="/hinata-full.png" alt="" />
          <img className="h-[95%]" src="/kiba-full.png" alt="" />
          <img className="h-[85%]" src="/ino-full.png" alt="" />
          <img className="h-[90%]" src="/tenten-full.png" alt="" />
        </div>
      </div>
      <div className="flex flex-col justify-center p-32 backdrop-blur-2xl">
        <LoginForm />
      </div>
    </div>
  );
}

export default Authenticate;
