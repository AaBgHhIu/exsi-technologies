import { cn } from "@/lib/utils";
interface Props { kicker?: string; title: string; subtitle?: string; className?: string; center?: boolean; }
export function SectionHeading({ kicker, title, subtitle, className, center }: Props) {
  return (
    <div className={cn("max-w-2xl mb-10", center && "mx-auto text-center", className)}>
      {kicker && <p className="text-brand-blue text-xs font-black tracking-[.18em] uppercase mb-2">{kicker}</p>}
      <h2 className="text-brand-navy text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">{title}</h2>
      {subtitle && <p className="text-[#63748a]">{subtitle}</p>}
    </div>
  );
}
