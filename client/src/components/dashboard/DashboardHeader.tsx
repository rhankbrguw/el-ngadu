import { useState, useEffect, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, Search, X } from "lucide-react";
import MobileSheet from "./MobileSheet";
import Notifications from "./Notifications";
import UserNav from "./UserNav";
import type { User, Notification, NavItem, Pagination } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { DASHBOARD_STRINGS } from "@/lib/constants/dashboard";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState(APP_MESSAGES.COMMON.SEARCH_PLACEHOLDER);
  const [searchContext, setSearchContext] = useState("pengaduan");

  useEffect(() => {
    const query = searchParams.get("q");
    const typeParam = searchParams.get("type");
    setSearchQuery(query ?? "");

    if (location.pathname.includes("/manage-officers") || (location.pathname.includes("/search") && typeParam === "petugas")) {
      setSearchPlaceholder(DASHBOARD_STRINGS.SEARCH_PLACEHOLDER_OFFICER);
      setSearchContext("petugas");
    } else if (location.pathname.includes("/manage-citizens") || (location.pathname.includes("/search") && typeParam === "masyarakat")) {
      setSearchPlaceholder(DASHBOARD_STRINGS.SEARCH_PLACEHOLDER_CITIZEN);
      setSearchContext("masyarakat");
    } else if (location.pathname.includes("/manage-complaints") || location.pathname.includes("/history") || (location.pathname.includes("/search") && typeParam === "pengaduan")) {
      setSearchPlaceholder(DASHBOARD_STRINGS.SEARCH_PLACEHOLDER_COMPLAINT);
      setSearchContext("pengaduan");
    }
  }, [location.pathname, searchParams]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      if (location.pathname === "/dashboard/search") {
        const defaultRoute = searchContext === "petugas"
          ? "/dashboard/manage-officers"
          : searchContext === "masyarakat"
          ? "/dashboard/manage-citizens"
          : "/dashboard/manage-complaints";
        navigate(defaultRoute, { replace: true });
      }
      return;
    }

    const timer = setTimeout(() => {
      const targetUrl = `/dashboard/search?q=${encodeURIComponent(trimmed)}&type=${searchContext}`;
      navigate(targetUrl, { replace: location.pathname === "/dashboard/search" });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchContext, location.pathname, navigate]);

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}&type=${searchContext}`);
    }
  };

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

      <div className="relative ml-auto flex-1 md:grow-0">
        <form onSubmit={handleSearch}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-background pl-8 pr-8 md:w-64 lg:w-80"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

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
