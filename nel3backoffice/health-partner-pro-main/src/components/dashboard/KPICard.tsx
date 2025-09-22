import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon, 
  variant = 'default',
  className 
}: KPICardProps) {
  const cardVariants = {
    default: 'kpi-card',
    primary: 'kpi-card-primary',
    success: 'kpi-card-success', 
    warning: 'kpi-card-warning',
    danger: 'kpi-card-danger'
  };

  return (
    <Card className={cn(cardVariants[variant], "animate-fade-in", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-card-foreground">
                {value}
              </p>
              {change && (
                <div className="flex items-center space-x-1">
                  {change.type === 'increase' ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    change.type === 'increase' ? "text-success" : "text-destructive"
                  )}>
                    {change.value}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-full",
            variant === 'primary' && "bg-primary/20 text-primary",
            variant === 'success' && "bg-success/20 text-success",
            variant === 'warning' && "bg-warning/20 text-warning",
            variant === 'danger' && "bg-destructive/20 text-destructive",
            variant === 'default' && "bg-muted text-muted-foreground"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}