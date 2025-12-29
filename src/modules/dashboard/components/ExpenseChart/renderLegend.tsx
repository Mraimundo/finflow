import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";

interface LegendProps {
  payload?: readonly LegendPayload[];
}

export function renderLegend(props: LegendProps) {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-lg border border-gray-200/60 dark:border-gray-700/60 shadow-sm backdrop-blur-sm"
        >
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
