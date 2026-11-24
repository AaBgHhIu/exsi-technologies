import { cn } from "@/lib/utils";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Variant, string> = {
  primary: "text-white font-bold rounded-full px-5 py-3 inline-flex items-center gap-2 transition-all hover:-translate-y-0.5",
  outline: "font-bold rounded-full px-5 py-3 inline-flex items-center gap-2 border transition-colors",
  ghost: "font-semibold inline-flex items-center gap-2 transition-colors",
};

export function Button({ variant = "primary", href, children, className, ...props }: ButtonProps) {
  const cls = cn(styles[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls}
        style={variant === "primary" ? { background: "linear-gradient(110deg,#0878d1,#0755a3)", boxShadow: "0 10px 24px rgba(8,120,209,.22)" } : undefined}>
        {children}
      </Link>
    );
  }
  return <button className={cls} {...props}
    style={variant === "primary" ? { background: "linear-gradient(110deg,#0878d1,#0755a3)", boxShadow: "0 10px 24px rgba(8,120,209,.22)" } : undefined}>
    {children}
  </button>;
}
