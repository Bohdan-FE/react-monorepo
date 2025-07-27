export interface WeekRange {
  monday: Date;
  sunday: Date;
}

export function getWeekRange(date: Date): WeekRange {
  const day = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Adjust so Monday is the first day of the week
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
}
