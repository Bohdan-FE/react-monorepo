import { Project } from '../data/projects';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import 'swiper/css';

function ProjectCard({ project }: { project: Project }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="rounded-2xl bg-black/40 backdrop-blur-2xl border-3 border-purple-dark select-none shadow-[0_4px_10px_rgba(128,90,213,0.5)] hover:shadow-[0_6px_30px_rgba(128,90,213,0.7)] transition-shadow duration-300 p-2 flex flex-col">
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-white shrink-0 cursor-grab relative">
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
        <div className="flex items-center justify-end gap-2 mt-auto">
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
