import { Project } from '../data/projects';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import { motion } from 'motion/react';
import 'swiper/css';
import { IoEarthOutline } from 'react-icons/io5';

function ProjectCard({ project }: { project: Project }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <motion.div
      layout
      layoutId={project.title}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,

        transition: {
          duration: 0.5,
        },
      }}
      exit={{
        opacity: 0,

        transition: { duration: 0.5 },
      }}
      className="rounded-2xl bg-black/40  backdrop-blur-2xl border-3 border-purple-dark select-none shadow-[0_4px_10px_rgba(128,90,213,0.5)] hover:shadow-[0_6px_30px_rgba(128,90,213,0.7)] transition-shadow duration-300 p-2 flex flex-col w-full overflow-hidden"
    >
      <div className="w-full aspect-video  rounded-xl overflow-hidden border border-white shrink-0 cursor-grab relative">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-full"
        >
          {project.images.map((image, index) => (
            <SwiperSlide key={index} className="h-full relative">
              <ImageWithLoading
                src={image}
                alt={`${project.title} screenshot ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex gap-2 justify-center my-2">
        {project.images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              activeIndex === index ? 'bg-purple-dark' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      <div className="p-2 flex-1 flex flex-col">
        <h3 className="text-2xl font-semibold mb-3 gradient-text">
          {project.title}
        </h3>
        <p className="text-sm mb-5 line-clamp-4 text-white/80">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <a
            className="items-center grid grid-cols-[minmax(0,auto)minmax(0,0fr)] rounded-3xl border border-white/40 h-7 hover:grid-cols-[minmax(0,auto)minmax(0,1fr)] transition-all duration-300 cursor-pointer opacity-50 hover:opacity-100"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="size-6.5 flex items-center justify-center">
              <IoEarthOutline />
            </div>
            <div className="overflow-hidden h-full flex items-center">
              <p className="px-2 pr-4 font-thin italic">Visit</p>
            </div>
          </a>
          <div className="flex items-center justify-end gap-2 ">
            {project.technologies.map((tech, index) => (
              <img
                key={index}
                className="w-[2rem]"
                src={tech === 'zustand' ? `/${tech}.svg` : `/${tech}.png`}
                alt={tech}
                style={{ filter: tech === 'nextjs' ? 'invert(1)' : 'none' }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ImageWithLoading({ src, alt }: { src: string; alt: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20 animate-pulse">
          <div className="w-full h-full bg-black/80 rounded-lg"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

export default ProjectCard;
