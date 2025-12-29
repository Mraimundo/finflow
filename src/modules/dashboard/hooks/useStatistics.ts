import { useMemo } from "react";
import type { ChartData as OriginalChartData } from "recharts/types/state/chartDataSlice";

type ChartData = OriginalChartData & { percentage?: number; values?: number[] };

export const useStatistics = (data: ChartData[]) => {
  return useMemo(() => {
    const total = data.reduce(
      (sum, item) =>
        sum +
        (Array.isArray(item.values)
          ? item.values.reduce((vSum, v) => vSum + v, 0)
          : 0),
      0
    );
    const averagePercentage =
      data.reduce((sum, item) => sum + (item.percentage ?? 0), 0) / data.length
        ? Math.round(
            data.reduce((sum, item) => sum + (item.percentage ?? 0), 0) /
              data.length
          )
        : 0;

    return {
      topPercentage: data[0]?.percentage ?? 0,
      total,
      averagePercentage,
    };
  }, [data]);
};
