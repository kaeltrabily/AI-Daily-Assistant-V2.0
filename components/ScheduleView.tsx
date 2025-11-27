import React from 'react';
import type { ScheduleEvent } from '../types';
import { EventBlock } from './EventBlock';

interface ScheduleViewProps {
  schedule: ScheduleEvent[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">No schedule available for this day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedule.map((event, index) => (
        <EventBlock key={index} event={event} />
      ))}
    </div>
  );
};