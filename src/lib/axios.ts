import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  maxBodyLength: Infinity,
  headers: {
    Accept: "application/json",
  },
});

const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payloadDecoded = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (!payloadDecoded.exp) return false;
    return Date.now() >= payloadDecoded.exp * 1000;
  } catch (e) {
    return true;
  }
};

// Attach token from localStorage on every request and handle FormData correctly
axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
      } else {
        const isPublicUrl = config.url && config.url.includes("/public/");
        if (!isPublicUrl) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
  }

  const isForm =
    config.data instanceof FormData ||
    (config.data &&
      typeof config.data === "object" &&
      typeof config.data.append === "function");

  if (isForm) {
    // Override transformRequest: pass FormData straight through without
    // Axios serializing it (which would turn it into url-encoded form).
    // The browser XHR adapter will then set Content-Type: multipart/form-data
    // with the correct boundary automatically.
    config.transformRequest = [(data: any) => data];

    // Also explicitly unset any Content-Type that may have been pre-set
    // so the browser is free to generate the correct multipart header.
    if (config.headers) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
        config.headers.delete("content-type");
      }
      delete (config.headers as Record<string, any>)["Content-Type"];
      delete (config.headers as Record<string, any>)["content-type"];
    }
  }

  return config;
});

export default axios;
