
// // Assuming we can use native fetch in node 18+

async function checkCodeforces() {
  const username = '__Cipher__'; // Assuming this is the username based on earlier logs
  const res = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
  const data = await res.json();
  
  if (data.status !== 'OK') {
    console.log('Failed to fetch:', data);
    return;
  }
  
  const okSubmissions = data.result.filter(sub => sub.verdict === 'OK');
  
  const byContestIndex = new Set();
  const byName = new Set();
  
  okSubmissions.forEach(sub => {
    byContestIndex.add(`${sub.problem.contestId}-${sub.problem.index}`);
    byName.add(sub.problem.name);
  });
  
  console.log(`Total OK submissions: ${okSubmissions.length}`);
  console.log(`Unique by contestId-index: ${byContestIndex.size}`);
  console.log(`Unique by problem name: ${byName.size}`);
}

checkCodeforces();
