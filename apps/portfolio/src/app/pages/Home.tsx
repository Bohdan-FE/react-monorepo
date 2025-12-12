import SocialsList from '../components/SocialsList';
import { useTypeLoop } from '../hooks/useTypeSwitch';
import { FiDownload } from 'react-icons/fi';
import { motion } from 'motion/react';
import { useModal } from '../context/modal-context';
import ContactModal from '../components/ContactModal';

function Home() {
  const text = useTypeLoop(
    'Frontend Developer,',
    'Full Stack Developer,',
    60,
    3000
  );
  const { openModal } = useModal();

  return (
    <motion.div
      exit={{ translateZ: 100, opacity: 0 }}
      initial={{ translateZ: -100, opacity: 0 }}
      animate={{ translateZ: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="md:h-screen gap-8 md:min-h-186 min-h-screen pt-32 md:pt-8 overflow-hidden transform-3d"
    >
      <div className="flex flex-col-reverse justify-center md:grid md:grid-cols-2 h-full min-h-[calc(100vh-8rem)] max-w-7xl mx-auto px-5 md:px-0 pb-29 md:pb-0">
        <motion.div
          className="md:h-full flex flex-col md:justify-center mt-12  md:pl-12 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-6xl font-semibold mb-1 md:mb-2">
            Hi, It's <span className="gradient-text">Bohdan</span>{' '}
          </h1>
          <div className="mb-4 md:mb-6 flex">
            <h2 className="text-2xl md:text-4xl font-semibold whitespace-nowrap">
              I am a <span className="gradient-text">{text}</span>
            </h2>
            <div className="h-full w-0.5 bg-white animate-blink"></div>
          </div>

          <p className="md:text-lg mb-6 max-w-md ">
            a passionate developer specializing in creating beautiful and
            functional web applications. <br /> Explore my projects and get in
            touch!
          </p>

          <div className=" mb-8 ">
            <SocialsList />
          </div>

          <div className="flex  gap-2">
            <button
              onClick={() => openModal(<ContactModal />)}
              className="button w-fit  whitespace-nowrap flex-1 md:flex-0 justify-center"
            >
              Contact Me
            </button>

            <a className="button outlined w-fit flex items-center gap-2 whitespace-nowrap flex-1 md:flex-0 justify-center">
              Download CV <FiDownload className="hidden md:block" />
            </a>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-end md:pr-12 flex-1 md:flex-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-full size-[60vw] mx-auto  md:size-112 relative group  animate-up-down md:mt-42">
            <img
              className="w-full object-cover object-center absolute top-0 left-1/2 translate-x-[-50%] -translate-y-15 md:-translate-y-40 z-20 selection-none pointer-events-none "
              src="/me2.png"
              alt=""
            />
            <div
              className="size-[115%] absolute top-1/2 left-1/2 translate-[-50%] border blur-[2px] rounded-[12rem] animate-spin-slow border-purple "
              style={{
                animationDuration: '15.5s',
              }}
            ></div>
            <div
              className="size-[111%] absolute top-1/2 left-1/2 translate-[-50%] border blur-[1px] rounded-[10rem] animate-spin-slow border-purple-dark"
              style={{
                animationDuration: '21.5s',
              }}
            ></div>
            <div
              className="size-[110%] absolute top-1/2 left-1/2 translate-[-50%] border blur-[2px] rounded-[8rem] animate-spin-slow border-blue-light "
              style={{
                animationDuration: '19.5s',
              }}
            ></div>

            <div className="conical-bg size-[102%] blur-xl rounded-full absolute top-1/2 left-1/2 translate-[-50%]   group-hover:scale-105 transition-all duration-500 ease-in-out animated-border"></div>
            <div className="conical-bg size-[calc(100%+10px)] rounded-full absolute top-1/2 left-1/2 translate-[-50%]  transition-all duration-500 ease-in-out animated-border"></div>
            <div
              className="size-full rounded-full relative z-1 overflow-hidden animated-border "
              style={{
                animationDelay: '0.1s',
              }}
            >
              <div className="size-full bg-size-[100%_auto] bg-position-[center_-3.75rem]  md:bg-position-[center_-10rem] bg-no-repeat">
                <img
                  className="w-full object-[center_-3.75rem] md:object-[100%_-10rem]  opacity-100 pointer-events-none select-none"
                  src="/me.png"
                  alt="me"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;
