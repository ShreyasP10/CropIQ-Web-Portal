import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div"> & {
  hover?: boolean;
  glow?: boolean;
  variant?: "glass" | "solid" | "elevated";
};

export function GlassCard({
  className,
  hover = false,
  glow = false,
  variant = "solid",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variant === "glass" &&
          "border border-white/10 bg-white/5 shadow-lg backdrop-blur-lg dark:bg-white/5",
        variant === "solid" &&
          "border border-border/60 bg-card shadow-sm",
        variant === "elevated" &&
          "border border-border/40 bg-card shadow-md",
        hover && "hover:-translate-y-1 hover:shadow-lg",
        glow && "ring-1 ring-cyan-400/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
