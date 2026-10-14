interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      {subtitle && (
        <span className="text-sm font-medium tracking-heading text-amber uppercase">
          {subtitle}
        </span>
      )}
      <h2 className="font-serif-display text-2xl leading-tight text-cream md:text-3xl">{title}</h2>
      <div className={`h-px bg-amber/40 ${align === "center" ? "w-24 self-center" : "w-16"}`} />
    </div>
  );
}
