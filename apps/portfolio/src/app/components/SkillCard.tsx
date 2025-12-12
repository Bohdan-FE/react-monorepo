import { MdOutlineColorLens } from 'react-icons/md';
import { IoCodeSlash } from 'react-icons/io5';
import { PiBracketsCurlyBold } from 'react-icons/pi';

interface SkillCardProps {
  type: 'Visual' | 'Interactivity' | 'Backend';
}

function SkillCard({ type }: SkillCardProps) {
  let title: string;
  switch (type) {
    case 'Visual':
      title = 'Styling & Animations';
      break;
    case 'Interactivity':
      title = 'Interactivity & State';
      break;
    case 'Backend':
      title = 'Backend';
      break;
  }

  let description: string;
  switch (type) {
    case 'Visual':
      description =
        'Building clean, responsive, and visually engaging interfaces using modern CSS, animations, and component-based styling. I focus on creating smooth interactions, polished layouts, and a consistent visual experience across devices.';
      break;
    case 'Interactivity':
      description =
        'Implementing client-side logic, state management, and data handling to make applications dynamic and intuitive. I integrate APIs, manage complex workflows, and ensure the UI responds efficiently to user actions.';
      break;
    case 'Backend':
      description =
        'Developing secure and reliable server-side functionality, including APIs, authentication, and database operations. I build scalable backend architecture that ensures strong performance, smooth communication, and stable application behavior.';
      break;
  }

  let icon;
  switch (type) {
    case 'Visual':
      icon = <MdOutlineColorLens className="text-purple-500 text-7xl" />;
      break;

    case 'Interactivity':
      icon = <IoCodeSlash className="text-purple-500 text-7xl" />;
      break;

    case 'Backend':
      icon = (
        <PiBracketsCurlyBold className="text-purple-500 text-7xl  block" />
      );
      break;
  }

  return (
    <div className="w-86 h-112  mx-auto rounded-2xl bg-black/20 group  backdrop-blur-md relative hover:shadow-[0_0_25px_10px_rgba(255,255,255,0.2)] shadow-[0_0_15px_5px_rgba(255,255,255,0.1)]  flex items-center justify-center gap-4 flex-col p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="inset-0 absolute size-full border-3 border-purple rounded-2xl blur-[3px] group-hover:blur-[1px] transition "></div>
      <div className=" flex flex-col h-full ">
        <div className="flex flex-col items-center justify-center gap-2 flex-1">
          <div className="h-16 flex items-center icon-shadow mb-2">{icon}</div>

          <p className="text-white/80 text-2xl font-bold text-center">
            {title}
          </p>
        </div>
        <div className="w-full h-0.5 rounded-2xl bg-white/20 mb-8"></div>
        <div className="flex-1">
          <p className="text-white/70 text-center">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default SkillCard;
