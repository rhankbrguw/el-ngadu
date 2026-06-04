import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

/**
 * Desktop and tablet navigation elements for the landing page.
 * Includes both text links and authentication buttons (text for desktop, icons for tablet).
 */
export function NavbarDesktop() {
  const { LINKS, LOGIN, REGISTER } = LANDING_CONSTANTS.NAVBAR;

  return (
    <>
      <div className="hidden md:flex items-center space-x-8">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-200 group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <div className="hidden lg:flex items-center space-x-3">
        <Button
          asChild
          size="lg"
          className="text-white bg-gray-700 hover:bg-gray-800 transition-all duration-200 font-semibold px-4"
        >
          <Link to="/login">{LOGIN}</Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-4 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Link to="/register">{REGISTER}</Link>
        </Button>
      </div>

      <div className="hidden md:flex lg:hidden items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon">
              <Link to="/login">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{LOGIN}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon">
              <Link to="/register">
                <UserPlus className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{REGISTER}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
