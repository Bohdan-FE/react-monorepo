import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import { useCreateTask } from '../../hooks/useCreateTask';
import { useTasks } from '../../hooks/useTasks';
import clsx from 'clsx';
import { MdDeleteOutline } from 'react-icons/md';
import { useDeleteTask } from '../../hooks/useDeleteTask';

function TaskDescription() {
  const { selectedTask } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { date, selectTask } = useStore();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(date);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { data: tasks } = useTasks(date);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'Create' | 'Update'>('Create');
  const { mutate: deleteTask } = useDeleteTask();

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setSelectedTab('Update');
    } else {
      setTitle('');
      setDescription('');
      setSelectedTab('Create');
    }
  }, [selectedTask]);

  useEffect(() => {
    if (!selectedTask) {
      setIsChanged(false);
      return;
    }
    if (title !== selectedTask.title) {
      setIsChanged(true);
      return;
    }
    if ((selectedTask.description || '') !== description) {
      setIsChanged(true);
      return;
    }
    setIsChanged(false);
  }, [title, description, selectedTask]);

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    updateTask({
      taskId: selectedTask._id,
      task: {
        title,
        description,
      },
      updateSelected: true,
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTask({
      title,
      description,
      date: date.toISOString(),
      index: tasks?.length ? tasks.length : 0,
    });
    setTitle('');
    setDescription('');
  };

  const selectTab = (tab: 'Create' | 'Update') => {
    if (tab === 'Update' && !selectedTask) return;
    if (tab === 'Create') {
      setTitle('');
      setDescription('');
    }
    if (tab === 'Update' && selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
    }
    setSelectedTab(tab);
  };

  return (
    <div className="bg-white/50 rounded-2xl backdrop-blur-md border-4 shadow-big overflow-y-auto">
      <div className="p-2 flex flex-col h-full">
        <div className="mb-2 rounded-2xl grid grid-cols-2  relative border-2  p-2">
          <div
            className={clsx(
              'absolute h-full w-1/2 bg-pink rounded-[0.8rem] transition-all shadow-small ',
              {
                'translate-x-full': selectedTab === 'Update',
              }
            )}
          ></div>
          <button
            className={clsx('relative z-10 transition-colors', {
              'text-white': selectedTab === 'Create',
            })}
            onClick={() => selectTab('Create')}
          >
            NEW
          </button>
          <button
            className={clsx(
              'relative z-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              {
                'text-white': selectedTab === 'Update',
              }
            )}
            onClick={() => selectTab('Update')}
            disabled={!selectedTask}
          >
            SELECTED
          </button>
        </div>
        <form className="flex-1  flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              className="bg-white border p-2 rounded-xl"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="description">Description</label>
            <textarea
              className="bg-white border p-2 rounded-xl flex-1"
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {selectedTab === 'Update' && selectedTask ? (
            <div className="mt-auto flex items-center gap-2">
              <button
                type="button"
                className="bg-red-400 text-white p-2 rounded-xl active:scale-95 active:shadow-none shadow-small flex items-center justify-center"
                onClick={() => {
                  selectTask(null);
                  deleteTask(selectedTask._id);
                }}
              >
                <MdDeleteOutline
                  className="pointer-events-none"
                  color="white"
                />
              </button>
              <button
                type="button"
                className="bg-blue text-white p-2 rounded-xl flex-1 active:scale-95 active:shadow-none shadow-small  disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdateTask}
                disabled={
                  !selectedTask ||
                  !isChanged ||
                  isUpdating ||
                  title?.trim() === ''
                }
              >
                {' '}
                {isUpdating ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          ) : (
            <button
              className="bg-orange text-black p-2 rounded-xl active:scale-95 active:shadow-none shadow-small mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCreateTask}
              disabled={title.trim() === '' || isCreating}
            >
              + Add task
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default TaskDescription;
