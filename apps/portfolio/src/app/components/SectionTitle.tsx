import { motion } from 'motion/react';
import { useMemo } from 'react';

export function SectionTitle({ children }: { children: React.ReactNode }) {
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);
  return (
    <div className="overflow-hidden w-fit mx-auto mb-6 md:mb-12">
      <motion.h3
        className=" text-3xl md:text-4xl text-center font-semibold"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{
          margin: isMobile ? '0px 0px -50px 0px' : '0px 0px -200px 0px',
          once: true,
        }}
      >
        {children}
      </motion.h3>
    </div>
  );
}
