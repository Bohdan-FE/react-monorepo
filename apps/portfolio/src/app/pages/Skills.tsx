import SkillCard from '../components/SkillCard';

import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';

function Skills() {
  return (
    <motion.div
      exit={{ translateZ: 100, opacity: 0 }}
      initial={{ translateZ: -100, opacity: 0 }}
      animate={{ translateZ: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={'cards'}
          className="min-h-screen gap-8 pt-22 pb-18 overflow-hidden flex items-center justify-center flex-col "
          exit={{ translateZ: 0, opacity: 0 }}
          initial={{ translateZ: -100, opacity: 0 }}
          animate={{ translateZ: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold md:mb-6 text-white">
            Skills
          </h2>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 w-full perspective-midrange">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <Link to="/skills/styling">
                <SkillCard type="Visual" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateZ: -50 }}
              animate={{ opacity: 1, translateZ: 0 }}
              exit={{ opacity: 0, translateZ: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Link to="/skills/frontend">
                <SkillCard type="Interactivity" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.4 }}
            >
              <Link to="/skills/backend">
                <SkillCard type="Backend" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* <motion.div
            key={'details'}
            className="py-29 relative perspective-distant"
            exit={{ translateZ: 0, opacity: 0 }}
            initial={{ translateZ: -100, opacity: 0 }}
            animate={{ translateZ: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="sticky top-26 ml-4 rounded-full opacity-40 border-white border size-8 flex items-center justify-center cursor-pointer hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.2)] hover:opacity-100 transition-all duration-300 hover:scale-105"
              onClick={() => setOpenedCard(null)}
            >
              <IoMdArrowRoundBack />
            </button>

            {renderOpenedCard()}
          </motion.div> */}
      </AnimatePresence>
    </motion.div>
  );
}

export default Skills;
