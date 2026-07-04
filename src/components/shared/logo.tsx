import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
};

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-green-500 shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
        <Image
          src="/cropiq-logo.png"
          alt={SITE_CONFIG.name}
          width={36}
          height={36}
          className="h-5 w-5 rounded-lg object-contain"
        />
      </span>
      {showText ? (
        <span className="text-lg font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
          <span className="gradient-text">{SITE_CONFIG.name}</span>
        </span>
      ) : null}
    </Link>
  );
}
