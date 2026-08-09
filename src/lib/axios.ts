import Axios from "axios";
import { clearStoredAuthTokens } from "@/utils/authStorage";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  maxBodyLength: Infinity,
  headers: {
    Accept: "application/json",
  },
});

// Remove default Content-Type for POST/PUT/PATCH to prevent Axios from defaulting to application/x-www-form-urlencoded
delete (Axios.defaults.headers as any).post?.["Content-Type"];
delete (Axios.defaults.headers as any).put?.["Content-Type"];
delete (Axios.defaults.headers as any).patch?.["Content-Type"];

delete (axios.defaults.headers as any).post?.["Content-Type"];
delete (axios.defaults.headers as any).put?.["Content-Type"];
delete (axios.defaults.headers as any).patch?.["Content-Type"];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken =
    typeof window !== "undefined"
      ? localStorage.getItem("refreshToken") ||
        localStorage.getItem("refresh") ||
        localStorage.getItem("refresh_token")
      : null;

  if (!refreshToken) {
    clearStoredAuthTokens();
    throw new Error("No refresh token available in storage.");
  }

  try {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const res = await Axios.post<{
      access?: string;
      access_token?: string;
      refresh?: string;
      refresh_token?: string;
    }>(
      `${baseURL}/accounts/refresh`,
      { refresh: refreshToken, refresh_token: refreshToken },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    const newAccessToken = res?.data?.access || res?.data?.access_token;
    const newRefreshToken = res?.data?.refresh || res?.data?.refresh_token;

    if (!newAccessToken) {
      throw new Error("Refresh token endpoint did not return a new access token.");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("token", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
    }

    return newAccessToken;
  } catch (err) {
    clearStoredAuthTokens();
    throw err;
  }
};

// Request Interceptor: Attach bearer token if present
axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) {
      const isPublicUrl = config.url && config.url.includes("/public/");
      if (!isPublicUrl) {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
  }

  const isForm =
    (typeof FormData !== "undefined" && config.data instanceof FormData) ||
    config.data?.constructor?.name === "FormData" ||
    (config.data &&
      typeof config.data === "object" &&
      typeof config.data.append === "function") ||
    (typeof Symbol !== "undefined" &&
      config.data &&
      config.data[Symbol.toStringTag] === "FormData");

  if (isForm) {
    config.transformRequest = [(data: any) => data];

    if (config.headers) {
      if (typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Content-Type", undefined);
        (config.headers as any).set("content-type", undefined);
      }
      if (typeof (config.headers as any).delete === "function") {
        (config.headers as any).delete("Content-Type");
        (config.headers as any).delete("content-type");
        (config.headers as any).delete("Content-type");
      }
      delete (config.headers as Record<string, any>)["Content-Type"];
      delete (config.headers as Record<string, any>)["content-type"];
      delete (config.headers as Record<string, any>)["Content-type"];
    }
  }

  return config;
});

// Response Interceptor: Automatically refresh access token on 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest =
      originalRequest?.url?.includes("/accounts/refresh") ||
      originalRequest?.url?.includes("/accounts/login") ||
      originalRequest?.url?.includes("/accounts/admin/login/");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
