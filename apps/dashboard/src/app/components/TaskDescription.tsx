import { useStore } from '../../store/store';

function TaskDescription() {
  const { selectedTask } = useStore();

  return (
    <div>
      <h2>Task Description</h2>
      <p>{selectedTask?.description}</p>
    </div>
  );
}

export default TaskDescription;
