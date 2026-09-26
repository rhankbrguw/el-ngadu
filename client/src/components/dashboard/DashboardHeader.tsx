import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import MobileSheet from "./MobileSheet";
import Notifications from "./Notifications";
import UserNav from "./UserNav";
import DashboardHeaderSearch from "./DashboardHeaderSearch";
import type { User, Notification, NavItem, Pagination } from "@/types";

interface DashboardHeaderProps {
  user: User | null;
  navItems: NavItem[];
  notifications: Notification[];
  unreadCount: number;
  notifPagination?: Pagination | null;
  isLoadingMoreNotif?: boolean;
  onLoadMoreNotif?: () => void;
  markNotificationAsRead: (id: number) => void;
  handleMarkAllAsRead: () => void;
  profileProgress: number;
  handleLogout: () => void;
}

export default function DashboardHeader({
  user,
  navItems,
  notifications,
  unreadCount,
  notifPagination,
  isLoadingMoreNotif,
  onLoadMoreNotif,
  markNotificationAsRead,
  handleMarkAllAsRead,
  profileProgress,
  handleLogout,
}: DashboardHeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        <MobileSheet navItems={navItems} onLogout={handleLogout} onClose={() => setIsMobileOpen(false)} />
      </Sheet>

      <DashboardHeaderSearch user={user} />

      <Notifications
        notifications={notifications}
        unreadCount={unreadCount}
        pagination={notifPagination}
        isLoadingMore={isLoadingMoreNotif}
        onLoadMore={onLoadMoreNotif}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <UserNav user={user} profileProgress={profileProgress} onLogout={handleLogout} />
    </header>
  );
}

