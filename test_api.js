const http = require('http');

const data = JSON.stringify({
  userSkills: ['FastAPI', 'Python'],
  targetSalaryLPA: 80
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/time-to-yield',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
