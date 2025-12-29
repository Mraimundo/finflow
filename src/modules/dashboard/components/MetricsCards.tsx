import { motion } from "framer-motion";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { formatCurrency } from "../../../shared/lib/utils";
import { useFinancialData } from "../../../shared/hooks/useFinancialData";
import { useFinancialStore } from "../../../shared/store/financialStore";

export function MetricsCards() {
  const { salary } = useFinancialStore();
  const { totalIncome, totalExpenses, balance } = useFinancialData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-0 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-green-500/5 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                  Saldo Atual
                </p>
                <p
                  className={`text-3xl font-bold ${
                    balance >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(balance)}
                </p>
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    balance >= 0
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {balance >= 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      Positivo
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3" />
                      Negativo
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      >
        <Card className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  Renda Base
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(salary)}
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                  <PiggyBank className="w-3 h-3" />
                  Mensal
                </div>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <PiggyBank className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
      >
        <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                  Receitas
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalIncome)}
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {totalIncome > 0 ? "+" : ""}
                  {formatCurrency(totalIncome - salary)}
                </div>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
      >
        <Card className="bg-linear-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-0 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-orange-500/5 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
                  Despesas
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpenses)}
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-medium">
                  <TrendingDown className="w-3 h-3" />
                  {totalExpenses > 0
                    ? Math.round(
                        (totalExpenses / (salary + totalIncome)) * 100
                      ) || 0
                    : 0}
                  % da renda
                </div>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
