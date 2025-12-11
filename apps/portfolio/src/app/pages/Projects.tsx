import { AnimatePresence } from 'motion/react';
import ProjectCard from '../components/ProjectCard';
import { PROJECTS_DATA } from '../data/projects';
import { useState } from 'react';
import { motion } from 'motion/react';

function Projects() {
  const data = PROJECTS_DATA;
  const [filter, setFilter] = useState('All');

  const filteredData =
    filter === 'All'
      ? data
      : data.filter((project) => {
          if (filter === 'React') {
            return (
              project.technologies.includes('react') ||
              project.technologies.includes('nextjs')
            );
          }
          if (filter === 'Angular') {
            return project.technologies.includes('angular');
          }
          return true;
        });

  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-29 max-w-7xl mx-auto"
    >
      <div className="overflow-hidden  mb-6">
        <h2 className="text-6xl font-bold mb-6 text-white text-center">
          Projects
        </h2>
      </div>

      <div className="flex justify-end mb-6 px-4">
        <ul className="flex items-center gap-3">
          <li
            className={`cursor-pointer ${
              filter === 'All' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            onClick={() => setFilter('All')}
          >
            All
          </li>
          <li
            className={`cursor-pointer ${
              filter === 'React' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            onClick={() => setFilter('React')}
          >
            React
          </li>
          <li
            className={`cursor-pointer ${
              filter === 'Angular' ? 'font-bold text-white' : 'text-gray-400'
            }`}
            onClick={() => setFilter('Angular')}
          >
            Angular
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredData.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Projects;
