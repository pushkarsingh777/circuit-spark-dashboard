import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yybvlcesispomzmflnup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YnZsY2VzaXNwb216bWZsbnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDk5NTAsImV4cCI6MjA3OTIyNTk1MH0.YgiYR5gUnVaTcZmOUCUKk9kI9AVMRJaaTG26vZYeSi0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TestResult {
  id: string;
  mcb_type: string;
  fault_current: number;
  power_factor: number;
  trip_time: number;
  result: 'pass' | 'fail';
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
}
