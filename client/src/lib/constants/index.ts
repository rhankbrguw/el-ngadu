import {
  LayoutDashboard,
  FileText,
  History,
  Users,
  ShieldCheck,
  BarChart3,
  Bot
} from "lucide-react";
import type { NavItem } from "@/types";

export * from "./admin";
export * from "./auth";
export * from "./complaints";
export * from "./dashboard";
export * from "./landing";

export const navItemsMasyarakat: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/create-complaint", label: "Buat Pengaduan", icon: FileText },
  { to: "/dashboard/history", label: "Riwayat", icon: History },
];

export const navItemsPetugas: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/manage-complaints", label: "Kelola Pengaduan", icon: FileText },
];

export const navItemsAdmin: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/manage-complaints", label: "Kelola Pengaduan", icon: FileText },
  { to: "/dashboard/manage-officers", label: "Kelola Petugas", icon: ShieldCheck },
  { to: "/dashboard/manage-citizens", label: "Kelola Masyarakat", icon: Users },
  { to: "/dashboard/reports", label: "Laporan", icon: BarChart3 },
];
