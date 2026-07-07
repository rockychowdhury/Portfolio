const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/features',
  method: 'GET'
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const features = JSON.parse(data);
    console.log("Current features:", features.map(f => `${f.name}: ${f.isActive} (${f.order})`));
  });
});
req.end();
