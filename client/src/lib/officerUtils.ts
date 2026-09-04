import type { Petugas } from "@/types";

const LEVEL_VARIANTS = { admin: "default", petugas: "secondary" } as const;

export const getLevelVariant = (level?: Petugas["level"] | string | null) => {
  if (!level) return "secondary";
  return LEVEL_VARIANTS[level as keyof typeof LEVEL_VARIANTS] || "secondary";
};

export const formatLevel = (level?: string | null) => {
  if (!level) return "-";
  return level.charAt(0).toUpperCase() + level.slice(1);
};
