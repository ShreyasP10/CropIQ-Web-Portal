import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-700 uppercase dark:text-cyan-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <div className={cn("mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 animate-gradient-shift", align === "center" && "mx-auto")} />
      {description ? (
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
