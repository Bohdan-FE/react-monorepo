import { motion } from 'motion/react';

interface TechnologyCardProps {
  title: string;
  children: React.ReactNode;
  imageSrc: string;
  animation?: 'left' | 'right' | 'down';
}

function TechnologyCard({
  title,
  children,
  imageSrc,
  animation,
}: TechnologyCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: animation === 'left' ? -50 : animation === 'right' ? 50 : 0,
        y: animation === 'down' ? 50 : 0,
      }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ margin: '0px 0px -200px 0px', once: true }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 15px 5px rgba(128,0,128,0.5)',
        transition: {
          scale: { duration: 0.2 },
          boxShadow: { duration: 0.3 },
          transform: { duration: 0.5 },
        },
      }}
      className=" items-center border-3  rounded-3xl border-purple/30  bg-black/10 backdrop-blur-md w-[calc(50%-3rem)]  "
    >
      <div className="gap-6 p-8 py-12 flex flex-col items-center  rounded-3xl size-full inset-shadow-[0_0_45px_rgba(128,0,128,0.5)]">
        <div className="h-20">
          <img
            className="h-full "
            style={{
              filter:
                imageSrc === '/nx.png' ||
                imageSrc === '/nextjs.png' ||
                imageSrc === '/rest.svg' ||
                imageSrc === '/ws.png' ||
                imageSrc === '/vercel.svg' ||
                imageSrc === '/render.png'
                  ? 'invert(1)'
                  : undefined,
            }}
            src={imageSrc}
            alt={title}
          />
        </div>

        <h4 className="text-3xl font-bold gradient-text text-center">
          {title}
        </h4>

        <div>{children}</div>
      </div>
    </motion.div>
  );
}

export default TechnologyCard;
