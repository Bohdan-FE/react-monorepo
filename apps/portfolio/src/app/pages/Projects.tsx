import ProjectCard from '../components/ProjectCard';
import { PROJECTS_DATA } from '../data/projects';

function Projects() {
  const data = PROJECTS_DATA;

  return (
    <div className="py-38 max-w-7xl mx-auto ">
      <div className="overflow-hidden  mb-12">
        <h2 className="text-6xl font-bold mb-6 text-white text-center">
          Projects
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {data.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}

export default Projects;
