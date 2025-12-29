import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toastEmitter } from "../lib/toast-event";
import { dayjs } from "../lib/dayjs-config";
import type {
  FinancialState,
  Transaction,
  SalaryData,
} from "../types/financial";

const FinancialDateUtils = {
  formatDate: (date: string | Date): string => {
    return dayjs(date).format("DD/MM/YYYY");
  },

  formatDateTime: (date: string | Date): string => {
    return dayjs(date).format("DD/MM/YYYY [às] HH:mm");
  },

  getToday: (): string => {
    return dayjs().format("YYYY-MM-DD");
  },

  getRelativeTime: (date: string | Date): string => {
    return dayjs(date).fromNow();
  },

  isToday: (date: string | Date): boolean => {
    return dayjs(date).isToday();
  },

  isYesterday: (date: string | Date): boolean => {
    return dayjs(date).isYesterday();
  },

  startOfMonth: (): string => {
    return dayjs().startOf("month").format("YYYY-MM-DD");
  },

  endOfMonth: (): string => {
    return dayjs().endOf("month").format("YYYY-MM-DD");
  },

  isCurrentMonth: (date: string | Date): boolean => {
    return dayjs(date).isSame(dayjs(), "month");
  },
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: "expense",
    category: "Alimentação",
    amount: 45.9,
    description: "Supermercado",
    date: dayjs().format("YYYY-MM-DD"),
    createdAt: dayjs().toISOString(),
  },
  {
    id: 2,
    type: "income",
    category: "Freelance",
    amount: 500.0,
    description: "Projeto website",
    date: dayjs().format("YYYY-MM-DD"),
    createdAt: dayjs().toISOString(),
  },
  {
    id: 3,
    type: "expense",
    category: "Transporte",
    amount: 120.0,
    description: "Combustível",
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    createdAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: 4,
    type: "income",
    category: "Salário",
    amount: 2500.0,
    description: "Salário mensal",
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    createdAt: dayjs().subtract(1, "day").toISOString(),
  },
];

class FinancialService {
  static async simulateAPICall<T>(data: T, delay: number = 1000): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }

  static validateTransaction(transaction: Partial<Transaction>): void {
    if (!transaction.type || !transaction.category || !transaction.amount) {
      throw new Error("Tipo, categoria e valor são obrigatórios");
    }

    if (transaction.amount <= 0) {
      throw new Error("O valor deve ser maior que zero");
    }

    if (!transaction.date) {
      throw new Error("Data é obrigatória");
    }

    if (!dayjs(transaction.date).isValid()) {
      throw new Error("Data inválida");
    }

    if (dayjs(transaction.date).isAfter(dayjs())) {
      throw new Error("Não é possível adicionar transações com data futura");
    }
  }

  static validateSalary(salaryData: SalaryData): void {
    if (salaryData.amount < 0) {
      throw new Error("O salário não pode ser negativo");
    }
  }
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      transactions: [],
      salary: 0,
      isLoading: false,

      addTransaction: async (
        transactionData: Omit<Transaction, "id" | "createdAt">
      ) => {
        set({ isLoading: true });

        try {
          FinancialService.validateTransaction(transactionData);

          await FinancialService.simulateAPICall(null, 500);

          const newTransaction: Transaction = {
            ...transactionData,
            id: Date.now(),
            createdAt: dayjs().toISOString(),
          };

          set((state) => ({
            transactions: [...state.transactions, newTransaction],
            isLoading: false,
          }));

          const messageType =
            transactionData.type === "income" ? "receita" : "despesa";
          const formattedDate = FinancialDateUtils.formatDate(
            transactionData.date
          );

          toastEmitter.emit({
            type: "success",
            title: `${
              messageType.charAt(0).toUpperCase() + messageType.slice(1)
            } adicionada!`,
            message: `${
              transactionData.category
            }: R$ ${transactionData.amount.toFixed(2)} (${formattedDate})`,
            duration: 3000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro ao adicionar transação",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      removeTransaction: async (id: number) => {
        set({ isLoading: true });

        try {
          const state = get();
          const transaction = state.transactions.find((t) => t.id === id);

          if (!transaction) {
            throw new Error("Transação não encontrada");
          }

          await FinancialService.simulateAPICall(null, 300);

          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            isLoading: false,
          }));

          const messageType =
            transaction.type === "income" ? "receita" : "despesa";
          const formattedDate = FinancialDateUtils.formatDate(transaction.date);

          toastEmitter.emit({
            type: "success",
            title: `${
              messageType.charAt(0).toUpperCase() + messageType.slice(1)
            } removida!`,
            message: `${transaction.category}: R$ ${transaction.amount.toFixed(
              2
            )} (${formattedDate})`,
            duration: 3000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro ao remover transação",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      setSalary: async (salaryData: SalaryData) => {
        set({ isLoading: true });

        try {
          FinancialService.validateSalary(salaryData);
          await FinancialService.simulateAPICall(null, 500);

          set({
            salary: salaryData.amount,
            isLoading: false,
          });

          toastEmitter.emit({
            type: "success",
            title: "Salário atualizado!",
            message: `Salário definido em R$ ${salaryData.amount.toFixed(2)}`,
            duration: 3000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro ao definir salário",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      loadInitialData: async () => {
        set({ isLoading: true });

        try {
          await FinancialService.simulateAPICall(null, 1000);

          set({
            transactions: initialTransactions,
            salary: 3000,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro ao carregar dados",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      clearAllData: async () => {
        set({ isLoading: true });

        try {
          await FinancialService.simulateAPICall(null, 500);

          set({
            transactions: [],
            salary: 0,
            isLoading: false,
          });

          toastEmitter.emit({
            type: "info",
            title: "Dados limpos!",
            message: "Todos os dados financeiros foram removidos",
            duration: 3000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro ao limpar dados",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      updateTransaction: async (id: number, updates: Partial<Transaction>) => {
        set({ isLoading: true });

        try {
          const state = get();
          const existingTransaction = state.transactions.find(
            (t) => t.id === id
          );

          if (!existingTransaction) {
            throw new Error("Transação não encontrada");
          }

          FinancialService.validateTransaction({
            ...existingTransaction,
            ...updates,
          });
          await FinancialService.simulateAPICall(null, 500);

          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
            isLoading: false,
          }));

          const messageType = updates.type || existingTransaction.type;
          const typeText = messageType === "income" ? "receita" : "despesa";
          const formattedDate = FinancialDateUtils.formatDate(
            updates.date || existingTransaction.date
          );

          toastEmitter.emit({
            type: "success",
            title: `${
              typeText.charAt(0).toUpperCase() + typeText.slice(1)
            } atualizada!`,
            message: `${
              updates.category || existingTransaction.category
            }: R$ ${(updates.amount || existingTransaction.amount).toFixed(
              2
            )} (${formattedDate})`,
            duration: 3000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro ao atualizar transação",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      getTransactionsByDateRange: (startDate: string, endDate: string) => {
        const state = get();
        return state.transactions.filter((transaction) => {
          const transactionDate = dayjs(transaction.date);
          return (
            transactionDate.isAfter(dayjs(startDate)) &&
            transactionDate.isBefore(dayjs(endDate))
          );
        });
      },

      getRecentTransactions: (days: number = 7) => {
        const state = get();
        const cutoffDate = dayjs().subtract(days, "day");

        return state.transactions.filter((transaction) =>
          dayjs(transaction.date).isAfter(cutoffDate)
        );
      },

      getMonthlyTransactions: (year?: number, month?: number) => {
        const state = get();
        const targetDate =
          year && month ? dayjs().year(year).month(month) : dayjs();

        return state.transactions.filter((transaction) =>
          dayjs(transaction.date).isSame(targetDate, "month")
        );
      },
    }),
    {
      name: "financial-storage",
      partialize: (state) => ({
        transactions: state.transactions,
        salary: state.salary,
      }),
    }
  )
);

export { FinancialDateUtils };
