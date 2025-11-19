import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

export const MetricCard = ({ label, value, valueColor }: MetricCardProps) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={cn("text-3xl font-bold", valueColor || "text-foreground")}>
          {value}
        </p>
      </div>
    </Card>
  );
};
