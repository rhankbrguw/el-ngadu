import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const TOAST_ICONS = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="h-4 w-4 text-destructive shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
  info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
  loading: <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />,
};

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Default to top-center on mobile/tablet portrait, top-right on desktop
  const responsivePosition = isDesktop ? "top-right" : "top-center";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={props.position || responsivePosition}
      closeButton={props.closeButton ?? true}
      richColors={props.richColors ?? true}
      visibleToasts={props.visibleToasts ?? 4}
      duration={props.duration ?? 4000}
      mobileOffset={props.mobileOffset ?? 16}
      offset={props.offset ?? 16}
      gap={8}
      icons={TOAST_ICONS}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-foreground group-[.toaster]:border-border/80 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:p-3.5 sm:group-[.toaster]:p-4",
          description: "group-[.toast]:text-muted-foreground text-xs leading-relaxed mt-0.5",
          title: "font-semibold text-xs sm:text-sm text-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
          closeButton:
            "group-[.toast]:bg-background/80 group-[.toast]:hover:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:text-foreground group-[.toast]:border-border/60 group-[.toast]:rounded-full transition-colors",
        },
      }}
      {...props}
    />
  );
};
