import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { markAllNotificationsAsReadService } from "@/services/notificationService";
import type { Notification, Pagination } from "@/types";
import {
 navItemsPetugas,
 navItemsMasyarakat,
 navItemsAdmin,
} from "@/lib/constants";
import { calculateProfileProgress } from "@/lib/utils";

export function useDashboard() {
 const { user, logout } = useAuth();
 const navigate = useNavigate();
 const [navItems, setNavItems] = useState(navItemsMasyarakat);
 const [notifications, setNotifications] = useState<Notification[]>([]);
 const [unreadCount, setUnreadCount] = useState(0);
 const [notifPagination, setNotifPagination] = useState<Pagination | null>(null);
 const [isLoadingMore, setIsLoadingMore] = useState(false);

 const profileProgress = useMemo(() => calculateProfileProgress(user), [user]);

 useEffect(() => {
 if (user?.userType === "petugas") {
 setNavItems(user.level === "admin" ? navItemsAdmin : navItemsPetugas);
 } else if (user?.userType === "masyarakat") {
 setNavItems(navItemsMasyarakat);
 }
 }, [user]);

 const fetchNotifications = useCallback(async (page = 1, append = false) => {
 if (!user) return;
 if (append) setIsLoadingMore(true);
 try {
 const response = await api.get(`/notifications/read?page=${page}&limit=10`);
 if (response.data?.data) {
 setNotifications((prev) => {
 const newData = response.data.data;
 
 if (!append && newData.length > 0 && prev.length > 0) {
 const latestNew = newData[0];
 const latestOld = prev[0];
 if (latestNew.id > latestOld.id && !latestNew.is_read) {
 if (
 localStorage.getItem("elngadu_push_notif") === "true" &&
 "Notification" in window &&
 Notification.permission === "granted"
 ) {
 new Notification("El-Ngadu", { body: latestNew.message });
 }
 }
 }

 return append ? [...prev, ...newData] : newData;
 });
 setUnreadCount(response.data.pagination.unread_count || 0);
 setNotifPagination(response.data.pagination);
 }
 } catch (error) {
 if (axios.isAxiosError(error) && error.response?.status === 401) {
 logout();
 navigate("/login");
 }
 } finally {
 if (append) setIsLoadingMore(false);
 }
 }, [user, logout, navigate]);

 useEffect(() => {
 fetchNotifications(1);
 const intervalId = setInterval(() => fetchNotifications(1), 30000); // 30 detik polling
 return () => clearInterval(intervalId);
 }, [fetchNotifications]);

 const handleLoadMoreNotif = () => {
 if (notifPagination && notifPagination.current_page < notifPagination.total_pages) {
 fetchNotifications(notifPagination.current_page + 1, true);
 }
 };

 const markNotificationAsRead = (id: number) => {
 setNotifications((prev) =>
 prev.map((notif) =>
 notif.id === id ? { ...notif, is_read: true } : notif
 )
 );
 setUnreadCount((prev) => Math.max(0, prev - 1));
 api
 .post("/notifications/mark-as-read", { notification_id: id })
 .catch((err) => console.error(err));
 };

 const handleMarkAllAsRead = async () => {
 const originalNotifications = [...notifications];
 setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
 setUnreadCount(0);
 try {
 await markAllNotificationsAsReadService();
 toast.success("Semua notifikasi telah ditandai dibaca.");
 } catch (error) {
 console.error("Error marking all as read:", error);
 toast.error(
 error instanceof Error ? error.message : "Gagal menandai notifikasi."
 );
 setNotifications(originalNotifications);
 }
 };

 const handleLogout = async () => {
 try {
 await api.post("/auth/logout");
 } catch (error) {
 console.error("Gagal logout dari server:", error);
 } finally {
 logout();
 navigate("/login", { replace: true });
 }
 };

 return {
 user,
 navItems,
 notifications,
 unreadCount,
 notifPagination,
 isLoadingMore,
 profileProgress,
 handleLoadMoreNotif,
 markNotificationAsRead,
 handleMarkAllAsRead,
 handleLogout,
 };
}
