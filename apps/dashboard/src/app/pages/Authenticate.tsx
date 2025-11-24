import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router';

import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';
import useGoogleLoginCustom from '../../hooks/useGoogleLoginCustom';
import RegisterForm from '../components/RegisterForm';
import CreatePassword from '../components/CreatePassword/CreatePassword';
import AnimatedDecor from '../components/ui/AnimatedDecor/AnimatedDecor';

const STEPS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  CREATE_PASSWORD: 'create password',
} as const;

type Step = (typeof STEPS)[keyof typeof STEPS];

function Authenticate() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { login, data, isPending } = useGoogleLoginCustom();

  const [step, setStep] = useState<Step>(STEPS.LOGIN);

  useEffect(() => {
    if (data && !data?.token) {
      setStep(STEPS.CREATE_PASSWORD);
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="h-screen grid grid-cols-2  relative gap-10 p-4  bg-yellow-light overflow-hidden">
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
        <p className="max-w-md font-DMSans">
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
      <div className="relative">
        <AnimatedDecor />
        <div className="max-w-[29rem] flex flex-col justify-center gap-4 w-full mx-auto h-full z-2 relative">
          {step === STEPS.LOGIN && <LoginForm />}
          {step === STEPS.SIGNUP && <RegisterForm />}
          {step === STEPS.CREATE_PASSWORD && data && (
            <CreatePassword
              credentials={{ email: data.email, name: data.name }}
            />
          )}

          {step !== STEPS.CREATE_PASSWORD && (
            <>
              <p className="text-center">
                {step === STEPS.LOGIN && <> Don't have an account? </>}
                {step === STEPS.SIGNUP && <> Already have an account? </>}
                {step === STEPS.LOGIN && (
                  <button
                    className="text-blue-500"
                    onClick={() => setStep(STEPS.SIGNUP)}
                  >
                    Sign up
                  </button>
                )}
                {step === STEPS.SIGNUP && (
                  <button
                    className="text-blue-500"
                    onClick={() => setStep(STEPS.LOGIN)}
                  >
                    Log in
                  </button>
                )}
              </p>

              <div className="flex gap-2 items-center">
                <div className="h-[0.125rem] w-full bg-black/15"></div>
                <p className=" whitespace-nowrap text-black/50 text-sm">
                  Or continue with
                </p>
                <div className="h-[0.125rem] w-full bg-black/15"></div>
              </div>

              <GoogleLoginButton login={login} isPending={isPending} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Authenticate;
