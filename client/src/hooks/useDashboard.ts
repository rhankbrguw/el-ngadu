import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { navItemsPetugas, navItemsMasyarakat, navItemsAdmin } from "@/lib/constants";
import { calculateProfileProgress } from "@/lib/utils";
import { useDashboardStats } from "./useDashboardStats";
import { useDashboardNotifications } from "./useDashboardNotifications";

function getNavItemsForUser(user: ReturnType<typeof useAuth>["user"]) {
  if (user?.userType === "petugas") {
    return user.level === "admin" ? navItemsAdmin : navItemsPetugas;
  }
  return navItemsMasyarakat;
}

function useDashboardNav(user: ReturnType<typeof useAuth>["user"]) {
  const [navItems, setNavItems] = useState(navItemsMasyarakat);
  useEffect(() => { setNavItems(getNavItemsForUser(user)); }, [user]);
  return navItems;
}

export function useDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = useDashboardNav(user);
  const profileProgress = useMemo(() => calculateProfileProgress(user), [user]);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); }
    catch (err) { void err; }
    finally { logout(); navigate("/login", { replace: true }); }
  };


  const notif = useDashboardNotifications(user, logout, navigate);
  const statsData = useDashboardStats(user);

  return { user, navItems, profileProgress, handleLogout, ...statsData, ...notif };
}


