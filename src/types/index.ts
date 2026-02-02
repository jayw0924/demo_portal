export type TaskPriority = 'Low' | 'Mid' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Review' | 'Approved';

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  completed: boolean;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Demo {
  id: string;
  name: string;
  client: string;
  demoUrl: string;
  thumbnailUrl: string;
  category: string;
  priority: number;
  status: string;
  comments: Comment[];
  createdAt: string;
}
