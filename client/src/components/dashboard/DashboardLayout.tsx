import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/hooks/useDashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import SupportChatWidget from "./SupportChatWidget";
import { Bot, X } from "lucide-react";

interface SupportButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SupportChatButton = ({ isOpen, onToggle }: SupportButtonProps) => (
  <button 
    onClick={onToggle}
    className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
    title="Bantuan AI"
  >
    {isOpen ? (
      <X className="h-6 w-6 transition-transform rotate-90 group-hover:rotate-180" />
    ) : (
      <Bot className="h-6 w-6 group-hover:animate-bounce" />
    )}
  </button>
);

const DashboardMainContent = () => {
  const location = useLocation();
  return (
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
  );
};

const DashboardHeaderWrapper = ({ dashboard }: { dashboard: ReturnType<typeof useDashboard> }) => {
  if (!dashboard.user) return null;
  return (
    <DashboardHeader
      user={dashboard.user}
      navItems={dashboard.navItems}
      notifications={dashboard.notifications}
      unreadCount={dashboard.unreadCount}
      notifPagination={dashboard.notifPagination}
      isLoadingMoreNotif={dashboard.isLoadingMore}
      onLoadMoreNotif={dashboard.handleLoadMoreNotif}
      markNotificationAsRead={dashboard.markNotificationAsRead}
      handleMarkAllAsRead={dashboard.handleMarkAllAsRead}
      profileProgress={dashboard.profileProgress}
      handleLogout={dashboard.handleLogout}
    />
  );
};

export default function DashboardLayout() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const dashboard = useDashboard();

  if (!dashboard.user) return null;

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DashboardSidebar navItems={dashboard.navItems} onLogout={dashboard.handleLogout} />
        <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-64 transition-all duration-300 ease-in-out">
          <DashboardHeaderWrapper dashboard={dashboard} />
          <DashboardMainContent />
        </div>
        <SupportChatWidget isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        <SupportChatButton isOpen={isAIChatOpen} onToggle={() => setIsAIChatOpen(!isAIChatOpen)} />
      </div>
    </TooltipProvider>
  );
}


