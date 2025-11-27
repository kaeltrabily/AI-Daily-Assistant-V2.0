import React from 'react';
import type { ScheduleEvent } from '../types';
import * as Icons from './IconComponents';

interface EventBlockProps {
  event: ScheduleEvent;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    work: Icons.WorkIcon,
    run: Icons.RunIcon,
    gym: Icons.GymIcon,
    sleep: Icons.SleepIcon,
    family: Icons.FamilyIcon,
    study: Icons.StudyIcon,
    commute: Icons.CommuteIcon,
    baby: Icons.BabyIcon,
    eat: Icons.EatIcon,
    morning: Icons.MorningIcon,
    evening: Icons.EveningIcon,
    default: Icons.DefaultIcon,
};

const colorMap: { [key: string]: { bg: string, text: string, darkBg: string, darkText: string } } = {
    work: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/40', darkText: 'dark:text-blue-300' },
    run: { bg: 'bg-orange-100', text: 'text-orange-700', darkBg: 'dark:bg-orange-900/40', darkText: 'dark:text-orange-300' },
    gym: { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/40', darkText: 'dark:text-red-300' },
    sleep: { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900/40', darkText: 'dark:text-indigo-300' },
    family: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-900/40', darkText: 'dark:text-emerald-300' },
    study: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/40', darkText: 'dark:text-amber-300' },
    commute: { bg: 'bg-slate-200', text: 'text-slate-700', darkBg: 'dark:bg-slate-700/50', darkText: 'dark:text-slate-300' },
    baby: { bg: 'bg-pink-100', text: 'text-pink-700', darkBg: 'dark:bg-pink-900/40', darkText: 'dark:text-pink-300' },
    eat: { bg: 'bg-teal-100', text: 'text-teal-700', darkBg: 'dark:bg-teal-900/40', darkText: 'dark:text-teal-300' },
    morning: { bg: 'bg-sky-100', text: 'text-sky-700', darkBg: 'dark:bg-sky-900/40', darkText: 'dark:text-sky-300' },
    evening: { bg: 'bg-violet-100', text: 'text-violet-700', darkBg: 'dark:bg-violet-900/40', darkText: 'dark:text-violet-300' },
    default: { bg: 'bg-gray-100', text: 'text-gray-700', darkBg: 'dark:bg-gray-800', darkText: 'dark:text-gray-300' },
};

export const EventBlock: React.FC<EventBlockProps> = ({ event }) => {
  const iconKey = event.icon.toLowerCase();
  const IconComponent = iconMap[iconKey] || iconMap.default;
  const colors = colorMap[iconKey] || colorMap.default;

  return (
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700 transition-colors hover:shadow-md duration-200">
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${colors.bg} ${colors.darkBg}`}>
        <IconComponent className={`w-6 h-6 transition-colors ${colors.text} ${colors.darkText}`} />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{event.title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{event.time}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{event.description}</p>
      </div>
    </div>
  );
};
