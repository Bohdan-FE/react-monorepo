import SocialsList from '../components/SocialsList';
import { useTypeLoop } from '../hooks/useTypeSwitch';
import { FiDownload } from 'react-icons/fi';
import { motion } from 'motion/react';

function Home() {
  const text = useTypeLoop(
    'Frontend Developer,',
    'Full Stack Developer,',
    60,
    3000
  );

  return (
    <motion.div
      exit={{ translateZ: 100, opacity: 0 }}
      initial={{ translateZ: -100, opacity: 0 }}
      animate={{ translateZ: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className=" h-screen gap-8 min-h-186 pt-8 overflow-hidden transform-3d"
    >
      <div className="grid grid-cols-2 h-full  max-w-7xl mx-auto">
        <motion.div
          className="h-full flex flex-col justify-center  pl-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-6xl font-semibold mb-2">
            Hi, It's <span className="gradient-text">Bohdan</span>{' '}
          </h1>
          <div className="mb-6 flex">
            <h2 className="text-4xl font-semibold whitespace-nowrap">
              I am a <span className="gradient-text">{text}</span>
            </h2>
            <div className="h-full w-0.5 bg-white animate-blink"></div>
          </div>

          <p className="text-lg mb-6 max-w-md ">
            a passionate developer specializing in creating beautiful and
            functional web applications. <br /> Explore my projects and get in
            touch!
          </p>

          <div className=" mb-8">
            <SocialsList />
          </div>

          <div className="flex  gap-2">
            <a href="#projects" className="button  w-fit ">
              Contact Me
            </a>

            <a
              href=""
              className="button outlined w-fit flex items-center gap-2"
            >
              Download Portfolio <FiDownload />
            </a>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-end pr-12 "
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-full  size-124 relative group  animate-up-down">
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
              className="size-full rounded-full relative z-1 overflow-hidden animated-border"
              style={{
                animationDelay: '0.1s',
              }}
            >
              <img
                className="size-full object-cover object-center"
                src="https://thumbs.dreamstime.com/b/fashion-man-face-c…del-closeup-portrait-young-guy-41172946.jpg?w=992"
                alt=""
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;
