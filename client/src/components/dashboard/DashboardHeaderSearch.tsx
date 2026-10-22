import { useState, useEffect, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { User, Petugas } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { DASHBOARD_STRINGS } from "@/lib/constants/dashboard";

interface HeaderSearchProps {
  user: User | null;
}

export default function DashboardHeaderSearch({ user }: HeaderSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState(APP_MESSAGES.COMMON.SEARCH_PLACEHOLDER);
  const [searchContext, setSearchContext] = useState("pengaduan");

  const isAdmin = user?.userType === "petugas" && (user as Petugas).level === "admin";

  useEffect(() => {
    const query = searchParams.get("q");
    const typeParam = searchParams.get("type");
    setSearchQuery(query ?? "");

    if (isAdmin && (location.pathname.includes("/manage-officers") || (location.pathname.includes("/search") && typeParam === "petugas"))) {
      setSearchPlaceholder(DASHBOARD_STRINGS.SEARCH_PLACEHOLDER_OFFICER);
      setSearchContext("petugas");
    } else if (isAdmin && (location.pathname.includes("/manage-citizens") || (location.pathname.includes("/search") && typeParam === "masyarakat"))) {
      setSearchPlaceholder(DASHBOARD_STRINGS.SEARCH_PLACEHOLDER_CITIZEN);
      setSearchContext("masyarakat");
    } else {
      setSearchPlaceholder(DASHBOARD_STRINGS.SEARCH_PLACEHOLDER_COMPLAINT);
      setSearchContext("pengaduan");
    }
  }, [location.pathname, searchParams, isAdmin]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      if (location.pathname === "/dashboard/search") {
        const defaultRoute = user?.userType === "masyarakat"
          ? "/dashboard/history"
          : searchContext === "petugas"
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
  }, [searchQuery, searchContext, location.pathname, navigate, user?.userType]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}&type=${searchContext}`);
    }
  };

  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg bg-background pl-8 pr-8 h-8 text-xs md:w-60 lg:w-72"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Hapus pencarian"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>
    </div>
  );
}
