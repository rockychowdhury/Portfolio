
import connectDB from './lib/db/connect';
import { fetchLeetCodeProfile } from './lib/api/platforms/fetchers';

async function test() {
  const data = await fetchLeetCodeProfile('Rocky20809');
  console.log(JSON.stringify(data?.contests, null, 2));
}

test().then(() => process.exit(0));
