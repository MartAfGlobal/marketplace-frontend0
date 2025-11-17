const axios = require('axios');

const url = 'https://marketplace-backend-hm4q.onrender.com/accounts/refresh';

(async () => {
  try {
    console.log('POST', url);
    const res = await axios.post(url, {}, { timeout: 10000 });
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    console.log('Body:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      console.error('No response received. Request details:', err.request._header || err.request);
    } else {
      console.error('Error creating request:', err.message);
    }
    process.exitCode = 1;
  }
})();
