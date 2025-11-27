import { ScheduleEvent } from './types';

export const defaultWorkdaySchedule: ScheduleEvent[] = [
  { icon: 'morning', time: '05:30', title: 'Wake', description: 'Quick water + prep (wife watches baby).' },
  { icon: 'run', time: '05:45–06:25', title: 'Run', description: '40 minutes.' },
  { icon: 'morning', time: '06:25–06:50', title: 'Cooldown + Shower', description: '' },
  { icon: 'eat', time: '06:50–07:20', title: 'Breakfast', description: 'Baby handoff / feed (wife).' },
  { icon: 'study', time: '07:20–08:00', title: 'Study', description: 'Chess, concrete, steel, etc. (40 minutes).' },
  { icon: 'morning', time: '08:00–08:30', title: 'Get Ready', description: 'Pack + final baby check.' },
  { icon: 'commute', time: '08:30–09:00', title: 'Commute', description: 'To work.' },
  { icon: 'work', time: '09:00–12:30', title: 'Work', description: 'Deep block.' },
  { icon: 'eat', time: '12:30–13:15', title: 'Lunch + Study', description: 'Finish hour of study (20 minutes).' },
  { icon: 'work', time: '13:15–16:30', title: 'Work', description: 'Meetings/tasks.' },
  { icon: 'work', time: '16:30–17:00', title: 'Wrap-up', description: 'Plan next day.' },
  { icon: 'commute', time: '17:00–17:30', title: 'Commute Home', description: '' },
  { icon: 'gym', time: '17:45–19:00', title: 'Gym', description: 'Near home (recommended).' },
  { icon: 'evening', time: '19:00–19:15', title: 'Shower', description: '' },
  { icon: 'family', time: '19:30–20:15', title: 'Family Dinner', description: 'Both parents.' },
  { icon: 'baby', time: '20:15–21:00', title: 'Baby Routine', description: 'Bath/feed/nap; share tasks.' },
  { icon: 'evening', time: '21:00–21:30', title: 'Chill', description: 'Light prep for next day.' },
  { icon: 'sleep', time: '21:30–05:30', title: 'Bedtime', description: '8 hours sleep.' },
];

export const defaultFridaySchedule: ScheduleEvent[] = [
  { icon: 'morning', time: '06:30', title: 'Wake', description: '' },
  { icon: 'family', time: '07:00–09:00', title: 'Family & Baby Bonding', description: 'Both parents.' },
  { icon: 'sleep', time: '09:30–11:00', title: 'Recovery', description: 'Nap / light mobility.' },
  { icon: 'gym', time: '11:30–13:00', title: 'Flexible Workout', description: 'Longer gym session or family walk.' },
  { icon: 'evening', time: '13:00–17:00', title: 'Errands / Hobby / Naps', description: '' },
  { icon: 'family', time: '17:30–20:30', title: 'Social / Extended Family Dinner', description: '' },
  { icon: 'study', time: 'Evening', title: 'Low-key Study / Prep', description: '30 minutes study or prep for week.' },
];
