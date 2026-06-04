import { Outlet } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
 const {
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
 } = useDashboard();

 if (!user) {
 return null;
 }

 return (
 <TooltipProvider>
 <div className="flex min-h-screen w-full flex-col bg-muted/40">
 <DashboardSidebar navItems={navItems} onLogout={handleLogout} />
 <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-64 transition-all duration-300 ease-in-out">
 <DashboardHeader
 user={user}
 navItems={navItems}
 notifications={notifications}
 unreadCount={unreadCount}
 notifPagination={notifPagination}
 isLoadingMoreNotif={isLoadingMore}
 onLoadMoreNotif={handleLoadMoreNotif}
 markNotificationAsRead={markNotificationAsRead}
 handleMarkAllAsRead={handleMarkAllAsRead}
 profileProgress={profileProgress}
 handleLogout={handleLogout}
 />
 <main className="flex-1 gap-4 p-4 sm:px-4 sm:py-0 md:gap-5 w-full max-w-full overflow-hidden">
 <Outlet />
 </main>
 </div>
 </div>
 </TooltipProvider>
 );
}
