import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnalysisSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function AnalysisSection({
  title,
  icon,
  children,
  delay = 0,
  className,
}: AnalysisSectionProps) {
  return (
    <div
      className="animate-slide-up"
      style={{
        animationDelay: `${delay * 100}ms`,
        animationFillMode: "both",
      }}
    >
      <div
        className={cn(
          "rounded-lg border border-primary/20 bg-card/40 backdrop-blur-sm p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
          className
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-primary text-2xl">{icon}</div>}
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="space-y-3 text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
