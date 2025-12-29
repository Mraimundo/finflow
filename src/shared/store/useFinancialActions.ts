import { useFinancialStore } from "../store/financialStore";
import type { Transaction, SalaryData } from "../types/financial";
import { FinancialDateUtils } from "../store/financialStore";

export const useFinancialActions = () => {
  const {
    addTransaction,
    removeTransaction,
    setSalary,
    clearAllData,
    updateTransaction,
    getTransactionsByDateRange,
    getRecentTransactions,
    getMonthlyTransactions,
  } = useFinancialStore();

  const handleAddTransaction = async (
    transactionData: Omit<Transaction, "id" | "createdAt">
  ) => {
    try {
      await addTransaction(transactionData);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleRemoveTransaction = async (id: number) => {
    try {
      await removeTransaction(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleSetSalary = async (salaryData: SalaryData) => {
    try {
      await setSalary(salaryData);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAllData();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleUpdateTransaction = async (
    id: number,
    updates: Partial<Transaction>
  ) => {
    try {
      await updateTransaction(id, updates);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleGetTransactionsByDateRange = (
    startDate: string,
    endDate: string
  ) => {
    try {
      const transactions = getTransactionsByDateRange(startDate, endDate);
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error, data: [] };
    }
  };

  const handleGetRecentTransactions = (days: number = 7) => {
    try {
      const transactions = getRecentTransactions(days);
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error, data: [] };
    }
  };

  const handleGetMonthlyTransactions = (year?: number, month?: number) => {
    try {
      const transactions = getMonthlyTransactions(year, month);
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error, data: [] };
    }
  };

  const handleFormatDate = (date: string | Date): string => {
    return FinancialDateUtils.formatDate(date);
  };

  const handleFormatDateTime = (date: string | Date): string => {
    return FinancialDateUtils.formatDateTime(date);
  };

  const handleGetToday = (): string => {
    return FinancialDateUtils.getToday();
  };

  const handleGetRelativeTime = (date: string | Date): string => {
    return FinancialDateUtils.getRelativeTime(date);
  };

  const handleIsToday = (date: string | Date): boolean => {
    return FinancialDateUtils.isToday(date);
  };

  const handleIsYesterday = (date: string | Date): boolean => {
    return FinancialDateUtils.isYesterday(date);
  };

  const handleStartOfMonth = (): string => {
    return FinancialDateUtils.startOfMonth();
  };

  const handleEndOfMonth = (): string => {
    return FinancialDateUtils.endOfMonth();
  };

  const handleIsCurrentMonth = (date: string | Date): boolean => {
    return FinancialDateUtils.isCurrentMonth(date);
  };

  const handleGetCurrentMonthStats = () => {
    try {
      const currentMonthTransactions = getMonthlyTransactions();

      const income = currentMonthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = currentMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expenses;

      return {
        success: true,
        data: {
          income,
          expenses,
          balance,
          transactionCount: currentMonthTransactions.length,
          period:
            FinancialDateUtils.formatDate(FinancialDateUtils.startOfMonth()) +
            " a " +
            FinancialDateUtils.formatDate(FinancialDateUtils.endOfMonth()),
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleGetCategoryStats = (period?: {
    startDate: string;
    endDate: string;
  }) => {
    try {
      const transactions = period
        ? getTransactionsByDateRange(period.startDate, period.endDate)
        : useFinancialStore.getState().transactions;

      const categoryStats = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = {
            income: 0,
            expenses: 0,
            count: 0,
            percentage: 0,
          };
        }

        if (transaction.type === "income") {
          acc[transaction.category].income += transaction.amount;
        } else {
          acc[transaction.category].expenses += transaction.amount;
        }

        acc[transaction.category].count += 1;
        return acc;
      }, {} as Record<string, { income: number; expenses: number; count: number; percentage: number }>);

      const totalIncome = Object.values(categoryStats).reduce(
        (sum, cat) => sum + cat.income,
        0
      );
      const totalExpenses = Object.values(categoryStats).reduce(
        (sum, cat) => sum + cat.expenses,
        0
      );

      Object.keys(categoryStats).forEach((category) => {
        const cat = categoryStats[category];
        const total = cat.income > 0 ? totalIncome : totalExpenses;
        cat.percentage =
          total > 0 ? ((cat.income + cat.expenses) / total) * 100 : 0;
      });

      return { success: true, data: categoryStats };
    } catch (error) {
      return { success: false, error, data: {} };
    }
  };

  const handleGetWeeklyStats = () => {
    try {
      const weekStart = FinancialDateUtils.startOfMonth();
      const weekEnd = FinancialDateUtils.endOfMonth();

      const weeklyTransactions = getTransactionsByDateRange(weekStart, weekEnd);

      const income = weeklyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = weeklyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        success: true,
        data: {
          income,
          expenses,
          balance: income - expenses,
          transactionCount: weeklyTransactions.length,
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleGetFormattedTransactions = (filters?: {
    startDate?: string;
    endDate?: string;
    type?: "income" | "expense";
    category?: string;
  }) => {
    try {
      let transactions = useFinancialStore.getState().transactions;

      if (filters?.startDate && filters?.endDate) {
        transactions = getTransactionsByDateRange(
          filters.startDate,
          filters.endDate
        );
      }

      if (filters?.type) {
        transactions = transactions.filter((t) => t.type === filters.type);
      }

      if (filters?.category) {
        transactions = transactions.filter(
          (t) => t.category === filters.category
        );
      }

      const formattedTransactions = transactions
        .map((transaction) => ({
          ...transaction,
          formattedDate: FinancialDateUtils.formatDate(transaction.date),
          relativeTime: FinancialDateUtils.getRelativeTime(transaction.date),
          isToday: FinancialDateUtils.isToday(transaction.date),
          isYesterday: FinancialDateUtils.isYesterday(transaction.date),
          formattedAmount: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(transaction.amount),
          typeText: transaction.type === "income" ? "Receita" : "Despesa",
        }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      return { success: true, data: formattedTransactions };
    } catch (error) {
      return { success: false, error, data: [] };
    }
  };

  return {
    handleAddTransaction,
    handleRemoveTransaction,
    handleSetSalary,
    handleClearAllData,
    handleUpdateTransaction,

    handleGetTransactionsByDateRange,
    handleGetRecentTransactions,
    handleGetMonthlyTransactions,

    handleFormatDate,
    handleFormatDateTime,
    handleGetToday,
    handleGetRelativeTime,
    handleIsToday,
    handleIsYesterday,
    handleStartOfMonth,
    handleEndOfMonth,
    handleIsCurrentMonth,

    handleGetCurrentMonthStats,
    handleGetCategoryStats,
    handleGetWeeklyStats,
    handleGetFormattedTransactions,
  };
};

export const useTransactionFormActions = () => {
  const {
    handleAddTransaction,
    handleUpdateTransaction,
    handleFormatDate,
    handleGetToday,
  } = useFinancialActions();

  return {
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    formatDate: handleFormatDate,
    getToday: handleGetToday,
  };
};

export const useFinancialReports = () => {
  const {
    handleGetCurrentMonthStats,
    handleGetCategoryStats,
    handleGetWeeklyStats,
    handleGetFormattedTransactions,
    handleGetMonthlyTransactions,
    handleGetTransactionsByDateRange,
  } = useFinancialActions();

  return {
    getCurrentMonthStats: handleGetCurrentMonthStats,
    getCategoryStats: handleGetCategoryStats,
    getWeeklyStats: handleGetWeeklyStats,
    getFormattedTransactions: handleGetFormattedTransactions,
    getMonthlyTransactions: handleGetMonthlyTransactions,
    getTransactionsByDateRange: handleGetTransactionsByDateRange,
  };
};

export const useFinancialDateUtils = () => {
  const {
    handleFormatDate,
    handleFormatDateTime,
    handleGetToday,
    handleGetRelativeTime,
    handleIsToday,
    handleIsYesterday,
    handleStartOfMonth,
    handleEndOfMonth,
    handleIsCurrentMonth,
  } = useFinancialActions();

  return {
    formatDate: handleFormatDate,
    formatDateTime: handleFormatDateTime,
    getToday: handleGetToday,
    getRelativeTime: handleGetRelativeTime,
    isToday: handleIsToday,
    isYesterday: handleIsYesterday,
    startOfMonth: handleStartOfMonth,
    endOfMonth: handleEndOfMonth,
    isCurrentMonth: handleIsCurrentMonth,
  };
};
