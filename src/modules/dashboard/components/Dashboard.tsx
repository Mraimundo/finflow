import { useEffect, useState } from "react";
import { TransactionForm } from "./TransactionForm";
import { SalaryForm } from "./SalaryForm";
import { FinancialOverview } from "./FinancialOverview";
import { RecentTransactions } from "./RecentTransactions";
import { useFinancialStore } from "../../../shared/store/financialStore";
import { Header } from "../../../shared/components/Header";
import { Footer } from "../../../shared/components/Footer";
import { MetricsCards } from "./MetricsCards";
import { ScrollToTopButton } from "../../../shared/components/ScrollToTopButton";
import { ExpenseChart } from "./ExpenseChart";

export function Dashboard() {
  const { transactions, salary, loadInitialData } = useFinancialStore();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);

  useEffect(() => {
    if (transactions.length === 0 && salary === 0) {
      loadInitialData();
    }
  }, [transactions.length, salary, loadInitialData]);

  return (
    <section className="min-h-screen flex flex-col">
      <Header
        setShowSalaryForm={setShowSalaryForm}
        setShowTransactionForm={setShowTransactionForm}
      />

      <main className="grow py-24 max-w-384 px-4 sm:px-16 lg:px-16 2xl:px-0 mx-auto w-full">
        <MetricsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <FinancialOverview />
            <ExpenseChart />
          </div>

          <div>
            <RecentTransactions
              onAddTransaction={() => setShowTransactionForm(true)}
            />
          </div>
        </div>

        {showTransactionForm && (
          <TransactionForm onClose={() => setShowTransactionForm(false)} />
        )}
        {showSalaryForm && (
          <SalaryForm onClose={() => setShowSalaryForm(false)} />
        )}
      </main>

      <Footer />
      <ScrollToTopButton />
    </section>
  );
}
