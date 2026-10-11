"use client";

import Cookies from "js-cookie";

const authStorageKeys = [
  "accessToken",
  "token",
  "refreshToken",
  "refresh",
  "refresh_token",
];

const authCookieKeys = ["accessToken", "token", "refreshToken", "userAuthId"];

// Clear every supported storage location so logout cannot be undone by a stale token or persisted Redux state.
export const clearStoredAuthTokens = () => {
  if (typeof window === "undefined") return;

  authStorageKeys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Remove the Redux Persist entry that can rehydrate the token after reload.
  localStorage.removeItem("persist:token");

  authCookieKeys.forEach((key) => Cookies.remove(key));
};
