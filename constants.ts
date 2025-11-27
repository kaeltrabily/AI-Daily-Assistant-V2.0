import { Type } from '@google/genai';

const eventProperties = {
  icon: {
    type: Type.STRING,
    description: 'An icon name from the list: work, run, gym, sleep, family, study, commute, baby, eat, morning, evening.',
  },
  time: {
    type: Type.STRING,
    description: 'The time of the event, e.g., "06:00 - 06:30".',
  },
  title: {
    type: Type.STRING,
    description: 'A short, descriptive title for the event.',
  },
  description: {
    type: Type.STRING,
    description: 'A brief description of the event, including who is responsible for baby care if relevant.',
  },
};

export const scheduleSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: eventProperties,
    required: ['icon', 'time', 'title', 'description'],
  },
};

export const chatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    responseMessage: {
      type: Type.STRING,
      description: "The natural language response to the user. Answer their question, or confirm the schedule change.",
    },
    updatedSchedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: eventProperties,
        required: ['icon', 'time', 'title', 'description'],
      },
      description: "The complete list of schedule events. If the user only asked a question, return the original schedule unchanged. If they asked for a change, return the modified schedule.",
    },
  },
  required: ['responseMessage', 'updatedSchedule'],
};

export const createSchedulePrompt = (day: 'today' | 'tomorrow'): string => `
You are my daily-life assistant. Your task is to produce a practical, ready-to-use daily schedule for me based on the provided constraints.
The output MUST be a valid JSON array of schedule events, conforming to the provided schema. Do not include any other text or markdown.

Generate the schedule for: ${day}.
If it is a workday (Saturday-Thursday), use the workday constraints. If it's a Friday, create a more relaxed day-off schedule.

User facts & constraints (do not change):
- Baby: 6-week-old daughter.
- Partner (wife) is present and available to share care.
- Work: 9:00 -> 17:00, Saturday–Thursday.
- Commute: 30 minutes each way.
- Exercise: prefers a run before work and gym after work.
- Reading/Study: an hour to study chess, or concrete, steel, etc.
- Family: dinner with family every workday evening.
- Sleep: requires at least 8 hours nightly.

For each event in the schedule, provide an icon, time, title, and description.
Propose reasonable defaults where needed. For example, assume the gym is near the office for efficiency.
Ensure the schedule is logical and accounts for all constraints, including commute times and baby care handoffs.
`;
