import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div"> & {
  hover?: boolean;
};

export function GlassCard({
  className,
  hover = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 transition-shadow",
        hover && "hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
