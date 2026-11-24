import { cn } from "@/lib/utils";
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("bg-[#eef5fb] text-[#45617e] rounded-full px-3 py-1 text-xs font-bold", className)}>
      {children}
    </span>
  );
}
