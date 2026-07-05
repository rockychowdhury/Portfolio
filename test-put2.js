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
    features[0].isActive = false; // Disable skills
    
    const putReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/features',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }, putRes => {
        let putData = '';
        putRes.on('data', c => putData += c);
        putRes.on('end', () => console.log("PUT Result:", putData));
    });
    putReq.write(JSON.stringify(features));
    putReq.end();
  });
});
req.end();
