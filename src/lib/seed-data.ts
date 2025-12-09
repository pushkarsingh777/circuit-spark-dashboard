import { supabase } from './supabase';

export async function seedDummyData() {
  // Check if data already exists
  const { count } = await supabase.from('test_results').select('*', { count: 'exact', head: true });
  
  if (count && count > 0) {
    console.log('Data already exists, skipping seed');
    return;
  }

  // Insert dummy test results
  const testResults = [
    { mcb_type: 'B', fault_current: 6, power_factor: 0.85, trip_time: 45, result: 'pass' },
    { mcb_type: 'C', fault_current: 10, power_factor: 0.90, trip_time: 38, result: 'pass' },
    { mcb_type: 'D', fault_current: 16, power_factor: 0.80, trip_time: 52, result: 'fail' },
    { mcb_type: 'B', fault_current: 20, power_factor: 0.95, trip_time: 41, result: 'pass' },
    { mcb_type: 'C', fault_current: 25, power_factor: 0.85, trip_time: 55, result: 'fail' },
    { mcb_type: 'B', fault_current: 32, power_factor: 1.00, trip_time: 35, result: 'pass' },
    { mcb_type: 'D', fault_current: 6, power_factor: 0.90, trip_time: 48, result: 'pass' },
    { mcb_type: 'C', fault_current: 10, power_factor: 0.85, trip_time: 42, result: 'pass' },
  ];

  const { error: testError } = await supabase.from('test_results').insert(testResults);
  if (testError) console.error('Error seeding test results:', testError);

  // Insert dummy activity logs
  const activityLogs = [
    { action: 'Test Started', details: 'MCB Type B at 6kA' },
    { action: 'Test Completed', details: 'Result: PASS - Trip time 45ms' },
    { action: 'Test Started', details: 'MCB Type C at 10kA' },
    { action: 'Test Completed', details: 'Result: PASS - Trip time 38ms' },
    { action: 'Test Failed', details: 'MCB Type D exceeded threshold' },
  ];

  const { error: activityError } = await supabase.from('activity_logs').insert(activityLogs);
  if (activityError) console.error('Error seeding activity logs:', activityError);

  console.log('Dummy data seeded successfully');
}
