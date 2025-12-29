import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Wallet,
  PiggyBank,
  Target,
} from "lucide-react";
import { formatCurrency } from "../../../shared/lib/utils";
import { useFinancialData } from "../../../shared/hooks/useFinancialData";

export function FinancialOverview() {
  const {
    expensePercentage,
    savings,
    savingsPercentage,
    totalAvailable,
    totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
  } = useFinancialData();

  const getStatusColor = (percentage: number): string => {
    if (percentage <= 50) return "text-green-600 dark:text-green-400";
    if (percentage <= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBgColor = (percentage: number): string => {
    if (percentage <= 50) return "bg-green-500";
    if (percentage <= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (percentage: number): React.ReactNode => {
    if (percentage <= 50)
      return (
        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    if (percentage <= 80)
      return (
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      );
    return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
  };

  const getSavingsStatus = () => {
    if (savingsPercentage >= 20) return "excelente";
    if (savingsPercentage >= 10) return "bom";
    if (savingsPercentage >= 5) return "regular";
    return "crítico";
  };

  const savingsStatus = getSavingsStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-300/40 via-purple-300/30 to-pink-300/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500" />

        <div className="absolute -inset-0.5 bg-linear-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-700/30 dark:to-purple-700/30 rounded-2xl opacity-50" />

        <Card className="relative overflow-hidden border border-gray-200/80 dark:border-gray-700/50 shadow-2xl shadow-blue-100/30 dark:shadow-blue-900/20 group-hover:shadow-3xl group-hover:shadow-blue-200/40 dark:group-hover:shadow-blue-900/30 transition-all duration-500">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50/90 via-white to-purple-50/70 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20" />

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #888 1px, transparent 1px),
                                 radial-gradient(circle at 75% 75%, #888 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          <div className="absolute inset-0 backdrop-blur-[1px] bg-white/40 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30" />

          <div className="relative z-10">
            <CardHeader className="pb-4 border-b border-gray-200/60 dark:border-gray-700/50">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                <div className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Visão Geral Financeira
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Dashboard interativo com análise completa das suas finanças
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                <div className="relative p-4 bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200/60 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg shadow-sm">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium block">
                          Total Disponível
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Saldo atual para uso
                        </span>
                      </div>
                    </div>
                    <strong className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {formatCurrency(totalAvailable)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium block">
                      Gastos
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Percentual da renda utilizada
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${getStatusColor(
                        expensePercentage
                      )}`}
                    >
                      {expensePercentage.toFixed(1)}%
                    </span>
                    {getStatusIcon(expensePercentage)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(totalExpenses)}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {formatCurrency(monthlyIncome)}
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-200/60 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(expensePercentage, 100)}%`,
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`absolute h-3 rounded-full ${getStatusBgColor(
                        expensePercentage
                      )}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Baixo Risco</span>
                    <span>Atenção</span>
                    <span>Alto Risco</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium block">
                      Economias
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Percentual economizado
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        savings >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {savingsPercentage.toFixed(1)}%
                    </span>
                    {savings >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>

                <div className="relative w-full bg-gray-200/60 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(Math.abs(savingsPercentage), 100)}%`,
                    }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className={`h-3 rounded-full ${
                      savings >= 0
                        ? "bg-linear-to-r from-green-400 to-emerald-500"
                        : "bg-linear-to-r from-red-400 to-red-500"
                    }`}
                  />
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Valor:{" "}
                  <span
                    className={`font-semibold ${
                      savings >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(savings)}
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-sm border ${
                  savingsStatus === "excelente"
                    ? "bg-linear-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 border-green-200/60 dark:border-green-800/50"
                    : savingsStatus === "bom"
                    ? "bg-linear-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/20 border-blue-200/60 dark:border-blue-800/50"
                    : savingsStatus === "regular"
                    ? "bg-linear-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/20 border-yellow-200/60 dark:border-yellow-800/50"
                    : "bg-linear-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/20 border-red-200/60 dark:border-red-800/50"
                }`}
              >
                <div
                  className={`absolute inset-0 opacity-10 ${
                    savingsStatus === "excelente"
                      ? "bg-linear-to-r from-green-400 to-emerald-400"
                      : savingsStatus === "bom"
                      ? "bg-linear-to-r from-blue-400 to-cyan-400"
                      : savingsStatus === "regular"
                      ? "bg-linear-to-r from-yellow-400 to-amber-400"
                      : "bg-linear-to-r from-red-400 to-rose-400"
                  }`}
                />

                <div className="relative p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        savingsStatus === "excelente"
                          ? "bg-green-100 dark:bg-green-800/50"
                          : savingsStatus === "bom"
                          ? "bg-blue-100 dark:bg-blue-800/50"
                          : savingsStatus === "regular"
                          ? "bg-yellow-100 dark:bg-yellow-800/50"
                          : "bg-red-100 dark:bg-red-800/50"
                      }`}
                    >
                      <PiggyBank
                        className={`w-6 h-6 ${
                          savingsStatus === "excelente"
                            ? "text-green-600 dark:text-green-400"
                            : savingsStatus === "bom"
                            ? "text-blue-600 dark:text-blue-400"
                            : savingsStatus === "regular"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold text-lg ${
                          savingsStatus === "excelente"
                            ? "text-green-800 dark:text-green-300"
                            : savingsStatus === "bom"
                            ? "text-blue-800 dark:text-blue-300"
                            : savingsStatus === "regular"
                            ? "text-yellow-800 dark:text-yellow-300"
                            : "text-red-800 dark:text-red-300"
                        }`}
                      >
                        {savingsStatus === "excelente" && "🎉 Excelente!"}
                        {savingsStatus === "bom" && "👍 Bom trabalho!"}
                        {savingsStatus === "regular" && "⚠️ Pode melhorar"}
                        {savingsStatus === "crítico" && "🚨 Atenção necessária"}
                      </h4>
                      <p
                        className={`mt-1 ${
                          savingsStatus === "excelente"
                            ? "text-green-700 dark:text-green-400"
                            : savingsStatus === "bom"
                            ? "text-blue-700 dark:text-blue-400"
                            : savingsStatus === "regular"
                            ? "text-yellow-700 dark:text-yellow-400"
                            : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {savingsStatus === "excelente" &&
                          "Suas economias estão acima de 20%! Continue assim para alcançar seus objetivos."}
                        {savingsStatus === "bom" &&
                          "Suas economias estão entre 10-20%. Você está no caminho certo!"}
                        {savingsStatus === "regular" &&
                          "Suas economias estão entre 5-10%. Considere revisar alguns gastos."}
                        {savingsStatus === "crítico" &&
                          "Suas economias estão abaixo de 5%. Recomendamos uma análise financeira detalhada."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/60 dark:border-gray-700/50">
                {[
                  {
                    label: "Receitas",
                    value: monthlyIncome,
                    icon: TrendingUp,
                    color: "green",
                    bg: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20",
                    text: "text-green-600 dark:text-green-400",
                  },
                  {
                    label: "Despesas",
                    value: monthlyExpenses,
                    icon: TrendingDown,
                    color: "red",
                    bg: "from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/20",
                    text: "text-red-600 dark:text-red-400",
                  },
                  {
                    label: "Saldo",
                    value: monthlyBalance,
                    icon: Target,
                    color: monthlyBalance >= 0 ? "blue" : "orange",
                    bg:
                      monthlyBalance >= 0
                        ? "from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20"
                        : "from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20",
                    text:
                      monthlyBalance >= 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-orange-600 dark:text-orange-400",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`bg-linear-to-br ${item.bg} rounded-xl p-4 text-center border border-gray-200/40 dark:border-gray-700/40 backdrop-blur-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    <div
                      className={`inline-flex p-3 rounded-lg ${
                        item.color === "green"
                          ? "bg-green-100 dark:bg-green-800/50"
                          : item.color === "red"
                          ? "bg-red-100 dark:bg-red-800/50"
                          : item.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-800/50"
                          : "bg-orange-100 dark:bg-orange-800/50"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${item.text}`} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {item.label}
                    </p>
                    <p className={`text-lg font-bold mt-1 ${item.text}`}>
                      {formatCurrency(item.value)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {expensePercentage > 80 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-linear-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/20 border border-red-200/60 dark:border-red-800/50"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-red-400 to-rose-400 opacity-10" />
                  <div className="relative p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-red-800 dark:text-red-300">
                          ⚠️ Gastos Elevados
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                          Seus gastos ultrapassaram 80% da renda. Recomendamos
                          revisão imediata.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {savingsPercentage < 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-linear-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20 border border-orange-200/60 dark:border-orange-800/50"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-amber-400 opacity-10" />
                  <div className="relative p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-orange-800 dark:text-orange-300">
                          🚨 Déficit Detectado
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                          Despesas maiores que a renda. Ajuste seu orçamento
                          urgentemente.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
