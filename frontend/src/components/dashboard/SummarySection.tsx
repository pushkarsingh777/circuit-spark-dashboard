interface SummaryItem {
  label: string;
  value: string;
}

interface SummarySectionProps {
  title: string;
  items: SummaryItem[];
  highlightLast?: boolean;
}

export function SummarySection({ title, items, highlightLast = false }: SummarySectionProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="bg-primary text-primary-foreground px-4 py-2">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}:</span>
            <span
              className={
                highlightLast && index === items.length - 1
                  ? "font-semibold text-success"
                  : "font-medium text-foreground"
              }
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
