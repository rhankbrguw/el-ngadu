import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User } from "@/types";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

function formatCsvCell(cellValue: unknown): string {
  let cell = cellValue === null || cellValue === undefined ? "" : String(cellValue);
  cell = cell.replace(/"/g, '""');
  return cell.search(/("|,|\n)/g) >= 0 ? `"${cell}"` : cell;
}

function downloadCsvBlob(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCsv<T extends object>(filename: string, rows: T[]): void {
  if (!rows || rows.length === 0) return;
  const separator = ",";
  const keys = Object.keys(rows[0]) as Array<keyof T>;
  const header = keys.join(separator);
  const body = rows.map((r) => keys.map((k) => formatCsvCell(r[k])).join(separator)).join("\n");
  downloadCsvBlob(`${header}\n${body}`, filename);
}


export const calculateProfileProgress = (user: User | null): number => {
 if (!user) return 0;

 let totalFields = 0;
 let filledFields = 0;

 const commonFields = ["username", "telp"];
 totalFields += commonFields.length;
 commonFields.forEach((field) => {
 if (user[field as keyof User]) filledFields++;
 });

 if (user.userType === "masyarakat") {
 const masyarakatFields = ["nama", "nik"];
 totalFields += masyarakatFields.length;
 masyarakatFields.forEach((field) => {
 if (user[field as keyof typeof user]) filledFields++;
 });
 } else if (user.userType === "petugas") {
 const petugasFields = ["nama_petugas", "level"];
 totalFields += petugasFields.length;
 petugasFields.forEach((field) => {
 if (user[field as keyof typeof user]) filledFields++;
 });
 }

  if (totalFields === 0) return 100;

  return Math.round((filledFields / totalFields) * 100);
};

export const timeAgo = (date: string): string => {
  const utcDate = date.endsWith('Z') ? date : date.replace(' ', 'T') + 'Z';
  let seconds = Math.floor((new Date().getTime() - new Date(utcDate).getTime()) / 1000);
  if (seconds < 0) seconds = 0;
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return Math.floor(seconds) + " detik lalu";
};
