/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useFinancialStore } from "../../../shared/store/financialStore";
import { getColorForIndex } from "../utils/getColorForIndex";
import { calculatePercentage } from "../utils/calculatePercentage";

export const useChartData = (dataType: any) => {
  const transactions = useFinancialStore((state) => state.transactions);

  return useMemo(() => {
    const filteredTransactions = transactions.filter(
      (t) => t.type === dataType
    );
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    const groupedData = filteredTransactions.reduce(
      (acc: Map<string, number>, transaction) => {
        const currentValue = acc.get(transaction.category) || 0;
        acc.set(transaction.category, currentValue + transaction.amount);
        return acc;
      },
      new Map()
    );

    const chartData = Array.from(groupedData.entries()).map(
      ([category, value], index) => ({
        name: category,
        value,
        color: getColorForIndex(index, dataType),
        percentage: calculatePercentage(value, total),
      })
    );

    return chartData.sort((a, b) => b.value - a.value);
  }, [transactions, dataType]);
};
