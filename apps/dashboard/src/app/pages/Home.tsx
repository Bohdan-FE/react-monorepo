import { useMemo, useState } from 'react';
import { TaskAmount, useTasksAmount } from '../../hooks/useTaskAmount';
import { getWeekRange, WeekRange } from '../../utils/getWeekFromDay';
import Calendar from '../components/Calendar';
import Graph from '../components/Graph/Graph';

import TaskDescription from '../components/TaskDescription';

import clsx from 'clsx';

import TasksContainer from '../components/TasksContainer/TasksContainer';
import DonutGraphContainer from '../components/DonatGraphContainer/DonatGraphContainer';
import { LayoutGroup } from 'motion/react';
import LineGraphContainer from '../components/LineGraphContainer/LineGraphContainer';

function Home() {
  return (
    <div className="flex h-full">
      <div className="flex-1 w-full h-full flex flex-col gap-4 p-4">
        <div className="grid grid-rows-2 h-full gap-4 ">
          <div className="grid grid-cols-4 gap-4 h-full">
            <Calendar />
            <LineGraphContainer />
            <DonutGraphContainer />
          </div>
          <div
            className={clsx('grid grid-cols-4 grid-rows-[100%] gap-4 h-full')}
          >
            <TaskDescription />
            <LayoutGroup>
              <TasksContainer type="todo" />
              <TasksContainer type="in_progress" />
              <TasksContainer type="done" />
            </LayoutGroup>
          </div>
        </div>
      </div>

      {/* <div className="h-full flex flex-col shrink-0 ">
        <Calendar />
        <div className="bg-white h-full">{user && <TasksList status='' />}</div>
      </div> */}
    </div>
  );
}

export default Home;
