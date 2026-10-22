import { useLocation } from "react-router-dom";
import { PAGE_TITLES, ROUTE_TITLE_MAP } from "@/lib/constants/titles";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function resolveTitleByPathname(pathname: string): string {
  if (ROUTE_TITLE_MAP[pathname]) {
    return ROUTE_TITLE_MAP[pathname];
  }

  if (pathname.startsWith("/dashboard/history/") || pathname.startsWith("/dashboard/complaints/")) {
    return PAGE_TITLES.COMPLAINT_DETAIL;
  }

  return PAGE_TITLES.NOT_FOUND;
}

export default function DocumentTitleHandler(): null {
  const { pathname } = useLocation();
  const title = resolveTitleByPathname(pathname);

  useDocumentTitle(title);

  return null;
}
