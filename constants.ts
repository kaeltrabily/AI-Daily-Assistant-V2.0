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
