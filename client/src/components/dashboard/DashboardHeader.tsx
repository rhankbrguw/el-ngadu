import { useState, useEffect, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, Search } from "lucide-react";
import MobileSheet from "./MobileSheet";
import Notifications from "./Notifications";
import UserNav from "./UserNav";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Cari...");
  const [searchContext, setSearchContext] = useState("pengaduan");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    } else {
      setSearchQuery("");
    }

    if (location.pathname.includes("/manage-officers")) {
      setSearchPlaceholder("Cari petugas...");
      setSearchContext("petugas");
    } else if (location.pathname.includes("/manage-citizens")) {
      setSearchPlaceholder("Cari masyarakat...");
      setSearchContext("masyarakat");
    } else {
      setSearchPlaceholder("Cari pengaduan...");
      setSearchContext("pengaduan");
    }
  }, [location.pathname, searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}&context=${searchContext}`);
    } else {
      if (searchContext === "petugas") {
        navigate("/dashboard/manage-officers");
      } else if (searchContext === "masyarakat") {
        navigate("/dashboard/manage-citizens");
      } else if (location.pathname.includes("/manage-complaints")) {
        navigate("/dashboard/manage-complaints");
      } else if (location.pathname.includes("/history")) {
        navigate("/dashboard/history");
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <MobileSheet
          navItems={navItems}
          userLevel={user?.level}
          onLogout={handleLogout}
        />
      </Sheet>

      <div className="relative ml-auto flex-1 md:grow-0">
        <form onSubmit={handleSearch}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-background pl-8 md:w-[250px] lg:w-[336px]"
          />
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

      <UserNav
        user={user}
        profileProgress={profileProgress}
        onLogout={handleLogout}
      />
    </header>
  );
}
