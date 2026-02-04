import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  maxBodyLength: Infinity,
  headers: {
    Accept: "application/json",
  },
});

// ✅ CRITICAL FIX
axios.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let the browser set multipart boundary
    delete config.headers?.["Content-Type"];
  }
  return config;
});

export default axios;
