import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/hooks/useDashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import SupportChatWidget from "./SupportChatWidget";
import { Bot, X } from "lucide-react";

export default function DashboardLayout() {
 const [isAIChatOpen, setIsAIChatOpen] = useState(false);
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

 const location = useLocation();

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
  <main className="flex-1 p-4 sm:px-4 sm:py-0 w-full max-w-full overflow-hidden">
  <div className="grid w-full h-full">
    <AnimatePresence>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="col-start-1 row-start-1 w-full h-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  </div>
  </main>
 </div>
 <SupportChatWidget isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
 <button 
  onClick={() => setIsAIChatOpen(!isAIChatOpen)}
  className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
  title="Bantuan AI"
 >
  {isAIChatOpen ? (
    <X className="h-6 w-6 transition-transform rotate-90 group-hover:rotate-180" />
  ) : (
    <Bot className="h-6 w-6 group-hover:animate-bounce" />
  )}
 </button>
 </div>
 </TooltipProvider>
 );
}
