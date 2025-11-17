// "use client";

// import { useEffect } from "react";
// import Axios from "axios";
// import { useDispatch } from "react-redux";
// import { setAccessToken } from "@/lib/axios";
// import { tokenActions } from "@/store/token/token-slice";

// export default function AuthInitializer() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     let mounted = true;

//     // Try a silent refresh on app start. If the server has a valid HttpOnly
//     // refresh cookie, it should return a fresh access token. We write the
//     // access token to memory and Redux only – never to a readable cookie.
//     const tryRefresh = async () => {
//       try {
//         // If a non-HttpOnly refresh cookie exists (legacy), include it in the
//         // body as { refresh } so the backend can accept it. Otherwise rely on
//         // the browser sending the HttpOnly cookie via withCredentials.
//         const makeRefreshBody = () => {
//           if (typeof document === "undefined") return {};

//           const cookie = document.cookie || "";
//           if (!cookie) return {};

//           const names = ["refresh", "refreshToken", "refresh_token", "rt"];
//           for (const name of names) {
//             const match = cookie
//               .split(";\n?")
//               .map((c) => c.trim())
//               .find((c) => c.startsWith(name + "="));
//             if (match) {
//               const val = decodeURIComponent(match.split("=")[1] || "");
//               if (val) return { refresh: val };
//             }
//           }

//           return {};
//         };

//         const res = await Axios.post<{ access: string }>(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/refresh`,
//           makeRefreshBody(),
//           { withCredentials: true }
//         );

//         const newAccess = res?.data?.access ?? null;
//         if (mounted && newAccess) {
//           setAccessToken(newAccess);
//           dispatch(tokenActions.setToken(newAccess));
//         }
//       } catch (err) {
//         // silent failure – user will remain logged out. Don't redirect here.
//         // The axios response interceptor will handle refresh-on-demand for
//         // protected requests and will redirect to login only if refresh fails
//         // when required.
//         // console.debug("Silent refresh failed (expected if no cookie):", err);
//       }
//     };

//     tryRefresh();

//     return () => {
//       mounted = false;
//     };
//   }, [dispatch]);

//   return null;
// }
