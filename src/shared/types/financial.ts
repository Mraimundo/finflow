export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface SalaryData {
  amount: number;
  receiptDate: string;
  source: string;
}

export interface FinancialState {
  transactions: Transaction[];
  salary: number;
  isLoading: boolean;
  addTransaction: (
    transactionData: Omit<Transaction, "id" | "createdAt">
  ) => Promise<void>;
  removeTransaction: (id: number) => Promise<void>;
  setSalary: (salaryData: SalaryData) => Promise<void>;
  loadInitialData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  updateTransaction: (
    id: number,
    updates: Partial<Transaction>
  ) => Promise<void>;
  getTransactionsByDateRange: (
    startDate: string,
    endDate: string
  ) => Transaction[];
  getRecentTransactions: (days?: number) => Transaction[];
  getMonthlyTransactions: (year?: number, month?: number) => Transaction[];
}

export interface FinancialOverviewData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensePercentage: number;
  savings: number;
  savingsPercentage: number;
}
