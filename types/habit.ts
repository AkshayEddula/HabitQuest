// Types for our habit system
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type HabitMetric = 'count' | 'duration' | 'distance';
export type HabitUnit = 'times' | 'minutes' | 'hours' | 'km' | 'miles';

export interface HabitSchedule {
  days: number[]; // 0-6 for days of week
  time?: string; // For reminders
  reminder: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  icon: string; // Icon name from your icon set
  color: string; // Hex color code
  metric: HabitMetric;
  unit: HabitUnit;
  target: number; // Target value (e.g., 10 times, 30 minutes)
  frequency: HabitFrequency;
  schedule: HabitSchedule;
  createdAt: Date;
  archived: boolean;
}

export interface HabitProgress {
  id: string;
  habitId: string;
  userId: string;
  date: string; // ISO date string
  value: number; // Actual progress value
  completed: boolean;
  notes?: string;
}
