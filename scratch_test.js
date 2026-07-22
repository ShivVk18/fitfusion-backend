import dotenv from 'dotenv';
dotenv.config();
import { dashboardService } from './src/services/dashboardService.js';

async function main() {
  try {
    const data = await dashboardService.getDashboardData('e4ee7b2d-996f-4a16-a33a-815adecf94d4');
    console.log('DASHBOARD DATA:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to get dashboard data:', err);
  }
}

main();
