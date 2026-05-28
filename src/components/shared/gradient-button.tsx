import Link from "next/link";
import { cn } from "@/lib/utils";

type GradientButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  onClick?: () => void;
  type?: "button" | "submit";
};

export function GradientButton({
  href,
  children,
  className,
  variant = "primary",
  onClick,
  type = "button",
}: GradientButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300",
    variant === "primary" &&
      "bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02] hover:shadow-cyan-500/40",
    variant === "outline" &&
      "border border-white/20 bg-white/5 backdrop-blur-sm hover:border-cyan-400/40 hover:bg-white/10",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
