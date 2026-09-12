import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import type { Notification, Pagination } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { POLLING_INTERVAL_MS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

interface NotificationsProps {
 notifications: Notification[];
 unreadCount: number;
 pagination?: Pagination | null;
 isLoadingMore?: boolean;
 onLoadMore?: () => void;
 onMarkAsRead: (id: number) => void;
 onMarkAllAsRead: () => void;
}

const isNotificationUnread = (n: Notification) =>
  n.is_read === false || n.is_read === 0 || n.is_read === "0";

interface NotificationItemProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
}

function NotificationItem({ notification, onSelect }: NotificationItemProps) {
  const unread = isNotificationUnread(notification);
  return (
    <DropdownMenuItem
      className={`flex items-start gap-3 p-3 cursor-pointer ${unread ? "bg-muted/50" : ""}`}
      onSelect={() => onSelect(notification)}
      onClick={() => onSelect(notification)}
    >
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-tight">{notification.message}</p>
        <p className="text-xs text-muted-foreground">{timeAgo(notification.created_at)}</p>
      </div>
      {unread && <div className="h-2 w-2 bg-primary rounded-full mt-1 self-center" />}
    </DropdownMenuItem>
  );
}

export default function Notifications({
  notifications,
  unreadCount,
  pagination,
  isLoadingMore,
  onLoadMore,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsProps) {
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (isNotificationUnread(notification)) {
      onMarkAsRead(notification.id);
    }
    if (notification.link_url) {
      navigate(notification.link_url);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">{APP_MESSAGES.SETTINGS.NOTIFICATIONS}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifikasi
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllAsRead();
              }}
            >
              <CheckCheck className="h-3 w-3" />
              Tandai semua
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-dropdown overflow-y-auto pb-2">
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onSelect={handleNotificationClick}
                />
              ))}
 
              {pagination && pagination.current_page < pagination.total_pages && (
                <div className="px-3 pt-3 flex justify-center">
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={(e) => { e.preventDefault(); onLoadMore?.(); }} disabled={isLoadingMore}>
                    {isLoadingMore ? <><Loader2 className="h-3 w-3 mr-2 animate-spin" />{APP_MESSAGES.COMMON.LOADING}</> : "Muat lebih banyak"}
                  </Button>
                </div>
              )}
 </>
 ) : (
 <div className="text-center text-sm text-muted-foreground p-5">
 <p>Tidak ada notifikasi baru.</p>
 </div>
 )}
 </div>
 </DropdownMenuContent>
 </DropdownMenu>
 );
}
