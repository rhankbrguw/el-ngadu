import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import { HelpCircle, LogOut, Moon, Sun } from "lucide-react";
import type { NavItem } from "@/types";

interface MobileSheetProps {
 navItems: NavItem[];
 onLogout: () => void;
}

export default function MobileSheet({
 navItems,
 onLogout,
}: MobileSheetProps) {
 const navigate = useNavigate();
 const { theme, setTheme } = useTheme();

 const toggleTheme = () => {
 setTheme(theme === "dark" ? "light" : "dark");
 };

 return (
 <SheetContent side="left" className="sm:max-w-xs">
 <nav className="grid gap-3 text-lg font-medium pt-4">
 <Link
 to="/dashboard"
 className="group flex items-center gap-3 text-xl font-bold text-primary mb-2"
 >
 <img
 src="/assets/image.png"
 alt="Logo El Ngadu"
 className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
 />
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">ElNgadu</span>
 </Link>

 {navItems.map((item) => (
 <NavLink
 key={item.to}
 to={item.to}
 end={item.to === "/dashboard"}
 className={({ isActive }) =>
 `flex items-center gap-4 px-2.5 py-2 rounded-lg transition-colors ${
 isActive
 ? "bg-primary text-primary-foreground"
 : "text-muted-foreground hover:text-foreground hover:bg-muted"
 }`
 }
 >
 <item.icon className="h-5 w-5" />
 {item.label}
 </NavLink>
 ))}

 <div className="mt-auto pt-4 space-y-2">
 <Button
 onClick={toggleTheme}
 variant="ghost"
 className="w-full justify-start gap-4 text-muted-foreground hover:text-foreground"
 >
 {theme === "dark" ? (
 <Sun className="h-5 w-5" />
 ) : (
 <Moon className="h-5 w-5" />
 )}
 {theme === "dark" ? "Light Mode" : "Dark Mode"}
 </Button>
 <Button
 onClick={() => navigate("/dashboard/help")}
 variant="ghost"
 className="w-full justify-start gap-4 text-muted-foreground hover:text-foreground"
 >
 <HelpCircle className="h-5 w-5" />
 Bantuan
 </Button>
 <Button
 onClick={onLogout}
 variant="ghost"
 className="w-full justify-start gap-4 text-muted-foreground hover:text-destructive"
 >
 <LogOut className="h-5 w-5" />
 Logout
 </Button>
 </div>
 </nav>
 </SheetContent>
 );
}
