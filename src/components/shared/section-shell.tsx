import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children: React.ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: SectionShellProps) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl px-4 py-16 md:py-20", className)}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} align={align} />
      <div className="mt-10">{children}</div>
    </section>
  );
}
