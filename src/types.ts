/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  avatarColor: string; // Tailwind bg class color like 'bg-purple-500'
  textColor: string; // Tailwind text color like 'text-white'
  role: string;
  initials: string;
  password?: string; // Operator passcode for login
}

export interface Note {
  id: string;
  authorName: string;
  content: string;
  createdAt: string; // ISO timestamp or formatted
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedUsers: string[]; // List of user IDs
  dueDate: string; // YYYY-MM-DD format
  notes: Note[];
  createdAt: string;
  chatMessages?: ChatMessage[]; // Real-time chat messages
}

export interface ChatMessage {
  id: string;
  taskId: string;
  senderId: string;
  senderName: string;
  messageText: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    type: string;
    size: string;
    base64?: string; // Stored payload
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string; // Formatted date or time
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'urgent';
}
