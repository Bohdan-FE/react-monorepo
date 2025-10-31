import { useEffect, useState } from 'react';
import UserList from '../UserList';
import { UserFilter as UserFilterType } from '../../../models/User';
import { IoIosArrowDown } from 'react-icons/io';

function UserFilter() {
  const [filter, setFilter] = useState<UserFilterType>('friends');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');

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
    <div className="p-4 w-full max-w-[25.25rem] flex flex-col">
      <div className="relative w-fit ml-auto min-w-[11.625rem] mb-3">
        <div
          className="flex items-center justify-between gap-2  p-2 rounded-xl bg-blue-dark text-white  shadow-small  cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="font-semibold"> {getFilterName(filter)} </p>
          <IoIosArrowDown className="font-semibold" />
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+0.2rem)] left-0 flex flex-col gap-2 w-full rounded-xl shadow-small bg-white overflow-hidden">
            {Object.values(UserFilterType).map((filterOption) => (
              <button
                key={filterOption}
                className="p-2 text-start hover:bg-blue-light transition-colors whitespace-nowrap"
                onClick={() => selectFilter(filterOption)}
              >
                {getFilterName(filterOption)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pr-4 mb-2">
        <input
          className="px-2 py-2 rounded-xl border-2 outline-0 w-full"
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
