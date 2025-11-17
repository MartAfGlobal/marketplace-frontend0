const http = require('http');
const axios = require('axios');

const PORT = 4000;

// Simple in-memory server to simulate protected endpoint + refresh endpoint
let refreshCalls = 0;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/accounts/refresh/') {
    refreshCalls++;
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      // First refresh call returns a valid access token; subsequent calls fail
      if (refreshCalls === 1) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ access: 'valid' }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ detail: 'Refresh failed' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/protected') {
    const auth = req.headers['authorization'] || '';
    if (auth === 'Bearer valid') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ detail: 'Token expired' }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, async () => {
  console.log(`Mock server running on http://localhost:${PORT}`);

  // Build axios instance with refresh-queue logic similar to src/lib/axios.ts
  const api = axios.create({ baseURL: `http://localhost:${PORT}`, withCredentials: true });

  let accessToken = null;
  let isRefreshing = false;
  let refreshPromise = null;
  const subscribers = [];
  const subscribe = (cb) => subscribers.push(cb);
  const onRefreshed = (token) => { subscribers.forEach((c) => c(token)); subscribers.length = 0; };

  api.interceptors.request.use((cfg) => {
    if (!cfg.headers) cfg.headers = {};
    if (accessToken) cfg.headers['Authorization'] = `Bearer ${accessToken}`;
    return cfg;
  });

  api.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          subscribe((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      refreshPromise = axios.post(`http://localhost:${PORT}/accounts/refresh/`, {}, { withCredentials: true })
        .then((r) => r.data.access)
        .catch(() => null)
        .finally(() => { isRefreshing = false; });

      const token = await refreshPromise;
      onRefreshed(token);
      if (!token) return Promise.reject(error);
      accessToken = token;
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  });

  // Make N concurrent requests that will initially 401
  const N = 5;
  const requests = Array.from({ length: N }).map(() => api.get('/protected').then(r => r.data).catch(e => ({ error: e.response && e.response.status })))

  const results = await Promise.all(requests);
  console.log('Results:', results);
  console.log('Refresh endpoint was called', refreshCalls, 'time(s)');

  server.close();
});
