"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { clearAdminAccess, setAdminAccess } from "@/store/admin/access/adminAccessSlice";
import type { PermissionAction, PermissionCategoryKey } from "@/types/admin";

/**
 * What the signed-in staff member may do, from the server's own matrix. Use it to
 * hide menus and buttons; the API enforces the same rules on every request, so
 * this is a convenience for the person, never the security boundary.
 */
export function useAdminAccess() {
  const { access, loaded } = useSelector((state: RootState) => state.adminAccess);

  const can = useCallback(
    (category: PermissionCategoryKey, action: PermissionAction = "view") =>
      !!access && (access.is_full_access || !!access.permissions?.[category]?.[action]),
    [access],
  );

  return { access, loaded, role: access?.role ?? null, isFullAccess: !!access?.is_full_access, can };
}

/** Fetch the access matrix for the current session (call once, from the admin layout). */
export function useLoadAdminAccess() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    if (!token) {
      dispatch(clearAdminAccess());
      return;
    }
    sendHttpRequest({
      requestConfig: {
        url: "/departments/me/access/",
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (res: any) => dispatch(setAdminAccess(res?.data ?? null)),
      // Fail closed: no matrix means no restricted menus, not all of them.
      errorRes: () => dispatch(setAdminAccess(null)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
}
