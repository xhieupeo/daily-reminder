import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Task } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey: string = '';

export function getSupabaseConfig(): SupabaseConfig | null {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  const localUrl =
    localStorage.getItem('anime_pixel_supabase_url') ||
    localStorage.getItem('xuan_hieu_supabase_url');
  const localKey =
    localStorage.getItem('anime_pixel_supabase_key') ||
    localStorage.getItem('xuan_hieu_supabase_key');

  const url = (envUrl || localUrl || '').trim().replace(/\/$/, '');
  const anonKey = (envKey || localKey || '').trim();

  if (url && anonKey) {
    return { url, anonKey };
  }
  return null;
}

export function saveLocalSupabaseCredentials(url: string, anonKey: string): void {
  const cleanUrl = url.trim().replace(/\/$/, '');
  const cleanKey = anonKey.trim();

  if (cleanUrl) {
    localStorage.setItem('anime_pixel_supabase_url', cleanUrl);
    localStorage.setItem('xuan_hieu_supabase_url', cleanUrl);
  } else {
    localStorage.removeItem('anime_pixel_supabase_url');
    localStorage.removeItem('xuan_hieu_supabase_url');
  }

  if (cleanKey) {
    localStorage.setItem('anime_pixel_supabase_key', cleanKey);
    localStorage.setItem('xuan_hieu_supabase_key', cleanKey);
  } else {
    localStorage.removeItem('anime_pixel_supabase_key');
    localStorage.removeItem('xuan_hieu_supabase_key');
  }

  // Invalidate cached client
  cachedClient = null;
  cachedConfigKey = '';
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) {
    cachedClient = null;
    cachedConfigKey = '';
    return null;
  }

  const configKey = `${config.url}::${config.anonKey}`;
  if (cachedClient && cachedConfigKey === configKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
      },
    });
    cachedConfigKey = configKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export const supabaseService = {
  isConfigured(): boolean {
    return getSupabaseConfig() !== null;
  },

  async testConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const cleanUrl = url.trim().replace(/\/$/, '');
      const cleanKey = anonKey.trim();
      const testClient = createClient(cleanUrl, cleanKey, {
        auth: { persistSession: false },
      });

      const { error } = await testClient.from('tasks').select('id').limit(1);

      if (error) {
        if (error.code === '42P01') {
          return {
            success: false,
            message: 'Connected to Supabase, but the "tasks" table does not exist yet. Please run the SQL setup script!',
          };
        }
        return { success: false, message: `Error: ${error.message}` };
      }

      return { success: true, message: 'Successfully connected to Supabase tasks database!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to connect. Check URL & Key.' };
    }
  },

  async fetchTasks(): Promise<Task[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('tasks')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn('Supabase fetchTasks error:', error.message);
        return [];
      }

      return (data as Task[]) || [];
    } catch (err) {
      console.warn('Supabase fetchTasks exception:', err);
      return [];
    }
  },

  async upsertTask(task: Task): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('tasks')
        .upsert(task, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase upsertTask error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase upsertTask failed:', err);
    }
  },

  async deleteTask(id: string): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase deleteTask error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase deleteTask failed:', err);
    }
  },

  async syncAllTasks(localTasks: Task[]): Promise<Task[]> {
    const client = getSupabaseClient();
    if (!client) return localTasks;

    try {
      const remoteTasks = await this.fetchTasks();

      const taskMap = new Map<string, Task>();

      // Load local tasks
      localTasks.forEach((t) => taskMap.set(t.id, t));

      // Merge remote tasks (prefer newer createdAt)
      remoteTasks.forEach((t) => {
        const existing = taskMap.get(t.id);
        if (!existing || t.createdAt >= existing.createdAt) {
          taskMap.set(t.id, t);
        }
      });

      const merged = Array.from(taskMap.values());

      // If local has tasks that aren't on remote yet, push them up
      if (localTasks.length > 0) {
        await client.from('tasks').upsert(merged, { onConflict: 'id' });
      }

      return merged;
    } catch (err) {
      console.warn('Supabase syncAllTasks fallback to local:', err);
      return localTasks;
    }
  },

  subscribeToChanges(onRemoteChange: () => void): () => void {
    const client = getSupabaseClient();
    if (!client) return () => {};

    try {
      const channel = client
        .channel('public:tasks')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          () => {
            onRemoteChange();
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Failed to subscribe to Supabase changes:', err);
      return () => {};
    }
  },
};
