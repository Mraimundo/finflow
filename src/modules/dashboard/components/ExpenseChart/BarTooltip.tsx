import { formatCurrency } from "../../../../shared/lib/utils";
import type { TooltipProps } from "../../types";

export function BarTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">
          {data.name}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
}
