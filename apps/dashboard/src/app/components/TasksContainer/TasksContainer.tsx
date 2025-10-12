import TasksList from '../TasksList';

function TasksContainer({ type }: { type: 'todo' | 'in_progress' | 'done' }) {
  let bgColor: string;
  let imageSrc: string;
  let title: string;
  let titleColor: string;

  switch (type) {
    case 'todo':
      titleColor = 'bg-orange';
      bgColor = 'bg-orange/50';
      imageSrc = '/naruto-full.png';
      title = 'To Do';
      break;
    case 'in_progress':
      titleColor = 'bg-pink';
      bgColor = 'bg-pink/50';
      imageSrc = '/sakura-full.png';
      title = 'In Progress';
      break;
    case 'done':
      titleColor = 'bg-blue';
      bgColor = 'bg-blue/50';
      imageSrc = '/sasuke-full.png';
      title = 'Done';
      break;
    default:
      title = '';
      bgColor = '';
      titleColor = '';
      imageSrc = '';
  }

  return (
    <div
      className={`shadow-big border-4 ${bgColor} backdrop-blur-md flex flex-col rounded-2xl relative p-2 flex-1 shrink-1`}
    >
      <div className="absolute bottom-0 right-4 h-[75%] w-fit">
        <img className="h-full" src={imageSrc} alt="" />
      </div>
      <div className={`p-2 rounded-2xl ${titleColor} border-2 shadow-small`}>
        <p className="text-center font-semibold uppercase text-white">
          {title}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto w-full my-2">
        <TasksList status={type} />
      </div>
    </div>
  );
}

export default TasksContainer;
