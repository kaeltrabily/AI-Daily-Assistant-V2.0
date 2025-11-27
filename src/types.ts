export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ScheduleEvent {
  icon: string;
  time: string;
  title: string;
  description: string;
}

export interface WeatherInfo {
  temp: string;
  condition: string;
  location: string;
}