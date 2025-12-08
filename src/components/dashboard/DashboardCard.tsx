import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-2xl p-6 animate-slide-up",
      className
    )}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  return (
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
      {children}
    </div>
  );
}
