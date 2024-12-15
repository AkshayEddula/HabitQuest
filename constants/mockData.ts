import { Habit } from '../types/habit';

export const MOCK_HABITS: Record<string, Habit[]> = {
  daily: [
    {
      id: '1',
      userId: 'user123',
      title: 'Morning Run',
      description: 'Early morning jog for better health',
      icon: 'fitness',
      color: '#FF6B6B',
      metric: 'distance',
      unit: 'km',
      target: 5,
      frequency: 'daily',
      schedule: {
        days: [1, 2, 3, 4, 5],
        time: '06:00',
        reminder: false
      },
      createdAt: new Date(),
      archived: false
    },
    {
      id: '2',
      userId: 'user123',
      title: 'Meditation',
      description: 'Mindfulness meditation',
      icon: 'book',
      color: '#4ECDC4',
      metric: 'duration',
      unit: 'minutes',
      target: 15,
      frequency: 'daily',
      schedule: { days: [0, 1, 2, 3, 4, 5, 6], time: '07:00', reminder: false },
      createdAt: new Date(),
      archived: false
    },
  ],
  weekly: [
    {
      id: '3',
      userId: 'user123',
      title: 'Read Books',
      description: 'Read for personal growth',
      icon: 'book',
      color: '#6C63FF',
      metric: 'duration',
      unit: 'hours',
      target: 5,
      frequency: 'weekly',
      schedule: { days: [1, 3, 5], time: '20:00', reminder: false },
      createdAt: new Date(),
      archived: false
    },
    {
      id: '4',
      userId: 'user123',
      title: 'Swimming',
      description: 'Pool workout',
      icon: 'water',
      color: '#45B7D1',
      metric: 'duration',
      unit: 'minutes',
      target: 45,
      frequency: 'weekly',
      schedule: { days: [2, 4], time: '18:00', reminder: false },
      createdAt: new Date(),
      archived: false
    },
  ],
  monthly: [
    {
      id: '5',
      userId: 'user123',
      title: 'Monthly Review',
      description: 'Review goals and progress',
      icon: 'stats-chart',
      color: '#FED766',
      metric: 'count',
      unit: 'times',
      target: 1,
      frequency: 'monthly',
      schedule: { days: [1], time: '10:00', reminder: false },
      createdAt: new Date(),
      archived: false
    },
  ],
};

export const MOCK_PROGRESS = {
  // Format: 'yyyy-MM-dd': { habitId: value }
  [new Date().toISOString().split('T')[0]]: {
    '1': 3, // 3km run today
    '2': 10, // 10 minutes meditation
  },
  // Add more mock progress...
};
