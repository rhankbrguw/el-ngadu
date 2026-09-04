import { useState, useEffect, useCallback } from "react";
import type { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { markAllNotificationsAsReadService } from "@/services/notificationService";
import type { Notification, Pagination, User } from "@/types";
import { NOTIFICATION_POLL_INTERVAL_MS } from "@/lib/constants";
import { APP_MESSAGES } from "@/lib/constants/messages";

function triggerBrowserNotification(newNotif: Notification, oldNotif: Notification) {
  if (newNotif.id > oldNotif.id && !newNotif.is_read) {
    if (localStorage.getItem("elngadu_push_notif") === "true" && "Notification" in window && Notification.permission === "granted") {
      new Notification("El-Ngadu", { body: newNotif.message });
    }
  }
}

export function useDashboardNotifications(user: User | null, logout: () => void, navigate: ReturnType<typeof useNavigate>) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifPagination, setNotifPagination] = useState<Pagination | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchNotifications = useCallback(async (page = 1, append = false) => {
    if (!user) return;
    if (append) setIsLoadingMore(true);
    try {
      const response = await api.get(`/notifications/read?page=${page}&limit=10`);
      if (response.data?.data) {
        setNotifications((prev) => {
          const newData = response.data.data;
          if (!append && newData.length > 0 && prev.length > 0) triggerBrowserNotification(newData[0], prev[0]);
          return append ? [...prev, ...newData] : newData;
        });
        setUnreadCount(response.data.pagination.unread_count || 0);
        setNotifPagination(response.data.pagination);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) { logout(); navigate("/login"); }
    } finally {
      if (append) setIsLoadingMore(false);
    }
  }, [user, logout, navigate]);

  useEffect(() => {
    fetchNotifications(1);
    const intervalId = setInterval(() => fetchNotifications(1), NOTIFICATION_POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const handleLoadMoreNotif = () => {
    if (notifPagination && notifPagination.current_page < notifPagination.total_pages) {
      fetchNotifications(notifPagination.current_page + 1, true);
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    api.post("/notifications/mark-as-read", { notification_id: id }).catch(() => {});
  };

  const handleMarkAllAsRead = async () => {
    const original = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsAsReadService();
      toast.success(APP_MESSAGES.TOAST_MESSAGES.SUCCESS_MARK_ALL_READ);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menandai notifikasi.");
      setNotifications(original);
    }
  };

  return { notifications, unreadCount, notifPagination, isLoadingMore, handleLoadMoreNotif, markNotificationAsRead, handleMarkAllAsRead };
}
