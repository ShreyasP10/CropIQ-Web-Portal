import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div"> & {
  hover?: boolean;
  glow?: boolean;
};

export function GlassCard({
  className,
  hover = false,
  glow = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl",
        "dark:border-white/10 dark:bg-white/5",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-cyan-500/10",
        glow && "ring-1 ring-cyan-400/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
