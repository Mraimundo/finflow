import { useFinancialStore } from "../store/financialStore";
import { dayjs } from "../lib/dayjs-config";
import { FinancialDateUtils } from "../store/financialStore";

export const useFinancialData = () => {
  const { transactions, salary } = useFinancialStore();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = salary + totalIncome - totalExpenses;
  const totalAvailable = salary + totalIncome;
  const expensePercentage =
    totalAvailable > 0 ? (totalExpenses / totalAvailable) * 100 : 0;
  const savings = totalAvailable - totalExpenses;
  const savingsPercentage =
    totalAvailable > 0 ? (savings / totalAvailable) * 100 : 0;

  const currentMonthTransactions = transactions.filter((transaction) =>
    FinancialDateUtils.isCurrentMonth(transaction.date)
  );

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = salary + monthlyIncome - monthlyExpenses;

  const weekStart = dayjs().startOf("week");
  const weekEnd = dayjs().endOf("week");

  const weeklyTransactions = transactions.filter((transaction) => {
    const transactionDate = dayjs(transaction.date);
    return (
      transactionDate.isAfter(weekStart) && transactionDate.isBefore(weekEnd)
    );
  });

  const weeklyIncome = weeklyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const weeklyExpenses = weeklyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions
    .filter((transaction) =>
      dayjs(transaction.date).isAfter(dayjs().subtract(7, "day"))
    )
    .map((transaction) => ({
      ...transaction,
      formattedDate: FinancialDateUtils.formatDate(transaction.date),
      relativeTime: FinancialDateUtils.getRelativeTime(transaction.date),
      isToday: FinancialDateUtils.isToday(transaction.date),
      isYesterday: FinancialDateUtils.isYesterday(transaction.date),
    }))
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  const transactionsByMonth = transactions.reduce((acc, transaction) => {
    const monthYear = dayjs(transaction.date).format("MM/YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0 };
    }

    if (transaction.type === "income") {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expenses += transaction.amount;
    }

    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const categoryStats = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = { income: 0, expenses: 0, count: 0 };
    }

    if (transaction.type === "income") {
      acc[transaction.category].income += transaction.amount;
    } else {
      acc[transaction.category].expenses += transaction.amount;
    }

    acc[transaction.category].count += 1;
    return acc;
  }, {} as Record<string, { income: number; expenses: number; count: number }>);

  return {
    totalIncome,
    totalExpenses,
    balance,
    expensePercentage,
    savings,
    savingsPercentage,
    totalAvailable,

    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    currentMonthTransactions,

    weeklyIncome,
    weeklyExpenses,
    weeklyTransactions,

    recentTransactions,

    transactionsByMonth,
    categoryStats,

    transactions: transactions.map((t) => ({
      ...t,
      formattedDate: FinancialDateUtils.formatDate(t.date),
      relativeTime: FinancialDateUtils.getRelativeTime(t.date),
    })),
    salary,

    dateUtils: FinancialDateUtils,
  };
};
