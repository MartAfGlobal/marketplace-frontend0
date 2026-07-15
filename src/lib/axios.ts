import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  maxBodyLength: Infinity,
  headers: {
    Accept: "application/json",
  },
});

// Remove default Content-Type headers for post, put, patch requests on this instance
if (axios.defaults.headers) {
  const methods = ["post", "put", "patch"] as const;
  methods.forEach((method) => {
    const headers = axios.defaults.headers[method] as any;
    if (headers) {
      if (typeof headers.delete === "function") {
        headers.delete("Content-Type");
        headers.delete("content-type");
      } else {
        delete headers["Content-Type"];
        delete headers["content-type"];
      }
    }
  });
}

// Attach token from localStorage on every request
axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const isForm = config.data && (
    config.data instanceof FormData ||
    config.data.constructor?.name === "FormData" ||
    (typeof config.data === "object" && typeof config.data.append === "function")
  );

  if (isForm) {
    if (config.headers) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
        config.headers.delete("content-type");
      } else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }
  }

  return config;
});

export default axios;
