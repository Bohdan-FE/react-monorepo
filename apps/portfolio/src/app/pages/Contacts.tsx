import { motion } from 'motion/react';
import ContactForm from '../components/ContactForm';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { GiPositionMarker } from 'react-icons/gi';
function Contacts() {
  return (
    <motion.div
      exit={{ translateZ: 100, opacity: 0 }}
      initial={{ translateZ: -100, opacity: 0 }}
      animate={{ translateZ: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="md:h-screen  min-h-186 md:pt-20 pt-29 pb-8  overflow-hidden transform-3d px-4 md:px-0"
    >
      <div className="grid lg:grid-cols-2 h-full  max-w-7xl mx-auto">
        <motion.div
          className="h-full flex flex-col justify-center md:pb-24 pb-8 md:pl-16 "
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">Get in touch</h1>
          <div className="mt-8 md:mt-16">
            <ul className="space-y-8">
              <li className="flex items-center gap-6">
                <div className="rounded-full size-12 md:size-16 border-2 border-purple flex items-center justify-center shadow-[0_0px_10px_rgba(128,90,213,0.5)]">
                  <MdOutlineMailOutline className="text-3xl md:text-4xl text-purple" />
                </div>
                <div>
                  <p className="font-bold text-xl md:text-2xl">E-mail</p>
                  <a
                    href="mailto:bohdanvivchar@gmail.com"
                    className="text-lg text-white/80 hover:underline"
                  >
                    bohdanvivchar@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-6">
                <div className="rounded-full size-12 md:size-16 border-2 border-purple flex items-center justify-center shadow-[0_0px_10px_rgba(128,90,213,0.5)]">
                  <FaPhoneAlt className="text-2xl md:text-3xl text-purple" />
                </div>
                <div>
                  <p className="font-bold text-xl md:text-2xl">Phone</p>
                  <a
                    href="tel:+421911348794"
                    className="text-lg text-white/80 hover:underline"
                  >
                    +421 911 348 794
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-6">
                <div className="rounded-full size-12 md:size-16 border-2 border-purple flex items-center justify-center shadow-[0_0px_10px_rgba(128,90,213,0.5)]">
                  <GiPositionMarker className="text-3xl md:text-4xl text-purple" />
                </div>
                <div>
                  <p className="font-bold text-xl md:text-2xl">Location</p>
                  <a
                    href="https://www.google.com/maps/place/Bratislava,+Slovakia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-white/80 hover:underline"
                  >
                    Bratislava, Slovakia
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-end md:pr-16 "
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4 }}
        >
          <div className=" md:px-2 md:pt-4 rounded-2xl bg-black/40 w-full backdrop-blur-2xl border-3 border-purple-dark select-none shadow-[0_4px_10px_rgba(128,90,213,0.5)] hover:shadow-[0_6px_30px_rgba(128,90,213,0.7)] transition-shadow duration-300">
            {' '}
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Contacts;
