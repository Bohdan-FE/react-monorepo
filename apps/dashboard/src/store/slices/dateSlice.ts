import { StateCreator } from 'zustand';

type StoreState = {
  date: Date;
  year: number;
  month: number;
  firstDayOfMonth: Date;
  lastDayOfMonth: Date;
};

type StoreActions = {
  setDate: (date: Date) => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
};

export type DateStore = StoreState & StoreActions;

export const createDateSlice: StateCreator<DateStore, [], [], DateStore> = (
  set,
  get
) => {
  const initialDate = new Date(new Date().setHours(0, 0, 0, 0));
  const initialYear = initialDate.getFullYear();
  const initialMonth = initialDate.getMonth();
  const initialFirstDay = new Date(initialYear, initialMonth, 1);
  const initialLastDay = new Date(initialYear, initialMonth + 1, 0);

  return {
    date: initialDate,
    year: initialYear,
    month: initialMonth,
    firstDayOfMonth: initialFirstDay,
    lastDayOfMonth: initialLastDay,

    setDate: (date: Date) => {
      const newDate = new Date(date.setHours(0, 0, 0, 0));
      const year = newDate.getFullYear();
      const month = newDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const state = get();

      if (
        state.firstDayOfMonth.getTime() === firstDay.getTime() &&
        state.lastDayOfMonth.getTime() === lastDay.getTime()
      ) {
        set({
          date: newDate,
          year,
          month,
        });
        return;
      }
      set({
        date: newDate,
        year,
        month,
        firstDayOfMonth: firstDay,
        lastDayOfMonth: lastDay,
      });
    },

    setMonth: (month: number) => {
      const date = new Date(get().date);
      date.setMonth(month);
      get().setDate(date);
    },

    setYear: (year: number) => {
      const date = new Date(get().date);
      date.setFullYear(year);
      get().setDate(date);
    },

    goToPreviousMonth: () => {
      const date = new Date(get().date);
      date.setMonth(date.getMonth() - 1);
      get().setDate(date);
    },

    goToNextMonth: () => {
      const date = new Date(get().date);
      date.setMonth(date.getMonth() + 1);
      get().setDate(date);
    },
  };
};
