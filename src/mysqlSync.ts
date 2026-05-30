/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, User, Notification } from './types';

export interface MySQLStatusResponse {
  connected: boolean;
  message: string;
  database?: string;
  host?: string;
  error?: string;
  hint?: string;
}

export interface MySQLDataResponse {
  success: boolean;
  tasks?: Task[];
  users?: User[];
  notifications?: Notification[];
  error?: string;
}

/**
 * Checks if the PHP MySQL bridge api.php is alive and configured correctly
 */
export async function checkMySQLStatus(apiUrl: string = 'api.php'): Promise<MySQLStatusResponse> {
  try {
    const response = await fetch(`${apiUrl}?action=status`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      return { 
        connected: false, 
        message: `HTTP error! status: ${response.status}`,
        error: `서버 응답 오류 (HTTP ${response.status})` 
      };
    }
    
    const data = await response.json();
    if (data.status === 'success') {
      return {
        connected: true,
        message: data.message || 'متصل به مای اس کیو ال',
        database: data.database,
        host: data.host
      };
    } else {
      return {
        connected: false,
        message: data.error || 'پیکربندی دیتابیس صحیح نیست',
        error: data.error,
        hint: data.hint
      };
    }
  } catch (err) {
    return {
      connected: false,
      message: 'برنامه در حالت محلی (LocalStorage) فعال است.',
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * Pulls all tasks, users, and notifications from the MySQL database
 */
export async function fetchMySQLData(apiUrl: string = 'api.php'): Promise<MySQLDataResponse> {
  try {
    const response = await fetch(`${apiUrl}?action=get_all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === 'success') {
      return {
        success: true,
        tasks: data.tasks || [],
        users: data.users || [],
        notifications: data.notifications || []
      };
    } else {
      throw new Error(data.error || 'خطا در بارگذاری داده‌ها');
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * Pushes bulk lists (tasks, users, notifications) to MySQL database for live storage
 */
export async function syncAllToMySQL(
  apiUrl: string = 'api.php',
  data: { tasks: Task[]; users: User[]; notifications: Notification[] }
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(`${apiUrl}?action=sync_all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (result.status === 'success') {
      return { success: true, message: result.message };
    } else {
      throw new Error(result.error || 'خطا در همگام‌سازی اطلاعات');
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}
