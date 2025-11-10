import { useEffect, useState } from 'react';
import UserList from '../UserList';
import { UserFilter as UserFilterType } from '../../../models/User';
import { IoIosArrowDown } from 'react-icons/io';
import clsx from 'clsx';
import { useSearchParams } from 'react-router';

function UserFilter() {
  const [filter, setFilter] = useState<UserFilterType>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [params] = useSearchParams();

  useEffect(() => {
    const filter = params.get('filter') as UserFilterType;
    if (filter) {
      setFilter(filter);
    }
  }, [params]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(input);
    }, 500);

    return () => clearTimeout(handler);
  }, [input]);

  const getFilterName = (filter: UserFilterType) => {
    switch (filter) {
      case 'all':
        return 'All Users';
      case 'friends':
        return 'Friends';
      case 'non-friends':
        return 'Non-Friends';
      case 'request_sent':
        return 'Requests Sent';
      case 'request_received':
        return 'Requests Received';
      default:
        return 'All Users';
    }
  };

  const selectFilter = (filterOption: UserFilterType) => {
    setFilter(filterOption);
    setIsOpen(false);
  };

  return (
    <div className="p-4 pr-0 w-full max-w-[25.25rem] flex flex-col bg-pink/70 rounded-2xl shadow-big border-2">
      <div className="relative w-fit ml-auto min-w-[11.625rem] mb-3 pr-4 z-10">
        <div
          className="flex items-center justify-between gap-2  p-2 rounded-xl bg-blue-dark text-white  shadow-small  cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="font-semibold"> {getFilterName(filter)} </p>
          <IoIosArrowDown className="font-semibold" />
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+0.4rem)] right-4 flex flex-col w-full rounded-xl shadow-small bg-white overflow-hidden">
            {Object.values(UserFilterType).map((filterOption) => (
              <button
                key={filterOption}
                className={clsx(
                  'p-2 text-start hover:bg-blue-light transition-colors whitespace-nowrap',
                  {
                    'bg-blue-dark text-white pointer-events-none':
                      filter === filterOption,
                  }
                )}
                onClick={() => selectFilter(filterOption)}
              >
                {getFilterName(filterOption)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-2 pr-4">
        <input
          className="px-2 py-2 rounded-xl border-2 outline-0 w-full !bg-white"
          type="text"
          placeholder="Search users..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <UserList filter={filter} search={search} />
      </div>
    </div>
  );
}

export default UserFilter;
