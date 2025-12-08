import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  titleVariant?: "primary" | "success" | "warning" | "destructive";
  columns: Column<T>[];
  data: T[];
  rowClassName?: (row: T) => string;
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  titleVariant = "primary",
  columns,
  data,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div
        className={cn(
          "px-4 py-2",
          titleVariant === "primary" && "bg-primary text-primary-foreground",
          titleVariant === "success" && "bg-success text-success-foreground",
          titleVariant === "warning" && "bg-warning text-warning-foreground",
          titleVariant === "destructive" && "bg-destructive text-destructive-foreground"
        )}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-3 py-2 text-left font-semibold text-muted-foreground",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    rowClassName?.(row)
                  )}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn("px-3 py-2.5", col.className)}>
                      {col.render
                        ? col.render(row[col.key as keyof T], row)
                        : String(row[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-muted-foreground">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
