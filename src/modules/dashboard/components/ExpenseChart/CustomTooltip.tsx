import { formatCurrency } from "../../../../shared/lib/utils";
import type { TooltipProps } from "../../types";

export function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl backdrop-blur-sm">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">
          {data.name}
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
          {formatCurrency(data.value)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {data.percentage}% do total
        </p>
      </div>
    );
  }
  return null;
}
