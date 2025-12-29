import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: string | number;
}

import { formatCurrency } from "../../../../shared/lib/utils";
import { useFinancialStore } from "../../../../shared/store/financialStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";
import { BAR_COLORS, EXPENSE_COLORS, INCOME_COLORS } from "../../constants";
import { CustomTooltip } from "./CustomTooltip";
import { renderLegend } from "./renderLegend";
import { BarTooltip } from "./BarTooltip";

type ChartType = "pie" | "bar";
type DataType = "expense" | "income";

export function ExpenseChart() {
  const [chartType, setChartType] = useState<ChartType>("pie");
  const [dataType, setDataType] = useState<DataType>("expense");

  const transactions = useFinancialStore((state) => state.transactions);

  const processChartData = (type: "expense" | "income"): ChartData[] => {
    const filteredTransactions = transactions.filter((t) => t.type === type);
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    const data = filteredTransactions.reduce(
      (acc: ChartData[], transaction) => {
        const existing = acc.find((item) => item.name === transaction.category);
        if (existing) {
          existing.value += transaction.amount;
        } else {
          acc.push({
            name: transaction.category,
            value: transaction.amount,
            color:
              type === "expense"
                ? EXPENSE_COLORS[acc.length % EXPENSE_COLORS.length]
                : INCOME_COLORS[acc.length % INCOME_COLORS.length],
            percentage: 0,
          });
        }
        return acc;
      },
      []
    );

    return data
      .map((item) => ({
        ...item,
        percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  };

  const expenseData = processChartData("expense");
  const incomeData = processChartData("income");
  const currentData = dataType === "expense" ? expenseData : incomeData;

  const barData = currentData.slice(0, 8).map((item, index) => ({
    ...item,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }));

  if (expenseData.length === 0 && incomeData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-300/40 via-purple-300/30 to-pink-300/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute -inset-0.5 bg-linear-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-700/30 dark:to-purple-700/30 rounded-2xl opacity-50" />

          <Card className="relative overflow-hidden border border-gray-200/80 dark:border-gray-700/50 shadow-2xl shadow-blue-100/30 dark:shadow-blue-900/20 group-hover:shadow-3xl group-hover:shadow-blue-200/40 dark:group-hover:shadow-blue-900/30 transition-all duration-500">
            <div className="absolute inset-0 bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900" />
            <div className="absolute inset-0 backdrop-blur-[1px] bg-white/40 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30" />

            <div className="relative z-10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <PieIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Análise Financeira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-8xl"
                  >
                    📊
                  </motion.div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Nenhuma transação registrada
                    </p>
                    <p className="text-sm">
                      Adicione receitas e despesas para visualizar os gráficos
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-300/40 via-purple-300/30 to-pink-300/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500" />

        <div className="absolute -inset-0.5 bg-linear-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-700/30 dark:to-purple-700/30 rounded-2xl opacity-50" />

        <Card className="relative overflow-hidden border border-gray-200/80 dark:border-gray-700/50 shadow-2xl shadow-blue-100/30 dark:shadow-blue-900/20 group-hover:shadow-3xl group-hover:shadow-blue-200/40 dark:group-hover:shadow-blue-900/30 transition-all duration-500">
          <div className="absolute inset-0 bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900" />

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
            <CardHeader className="space-y-4 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  <div className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                    <PieIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Análise Financeira
                </CardTitle>

                <div className="flex flex-wrap gap-2">
                  <div className="flex bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <Button
                      variant={dataType === "expense" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDataType("expense")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        dataType === "expense"
                          ? "bg-linear-to-r from-red-500 to-orange-500 text-white shadow-sm border border-red-400/30"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Gastos
                    </Button>
                    <Button
                      variant={dataType === "income" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDataType("income")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        dataType === "income"
                          ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-sm border border-green-400/30"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Receitas
                    </Button>
                  </div>

                  <div className="flex bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <Button
                      variant={chartType === "pie" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChartType("pie")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        chartType === "pie"
                          ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-sm border border-blue-400/30"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <PieIcon className="w-3 h-3 mr-1" />
                      Pizza
                    </Button>
                    <Button
                      variant={chartType === "bar" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChartType("bar")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        chartType === "bar"
                          ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-sm border border-purple-400/30"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Barras
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Categorias",
                    value: currentData.length,
                    color: "blue",
                    bg: "from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20",
                    border: "border-blue-200/60 dark:border-blue-800/50",
                    text: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    label:
                      dataType === "expense" ? "Total Gasto" : "Total Recebido",
                    value: formatCurrency(
                      currentData.reduce((sum, item) => sum + item.value, 0)
                    ),
                    color: "green",
                    bg: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20",
                    border: "border-green-200/60 dark:border-green-800/50",
                    text: "text-green-600 dark:text-green-400",
                  },
                  {
                    label: "Maior Categoria",
                    value: `${currentData[0]?.percentage || 0}%`,
                    color: "purple",
                    bg: "from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20",
                    border: "border-purple-200/60 dark:border-purple-800/50",
                    text: "text-purple-600 dark:text-purple-400",
                  },
                  {
                    label: "Média por Categoria",
                    value: `${
                      currentData.length > 0
                        ? Math.round(
                            currentData.reduce(
                              (sum, item) => sum + item.percentage,
                              0
                            ) / currentData.length
                          )
                        : 0
                    }%`,
                    color: "orange",
                    bg: "from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20",
                    border: "border-orange-200/60 dark:border-orange-800/50",
                    text: "text-orange-600 dark:text-orange-400",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-linear-to-br ${stat.bg} ${stat.border} rounded-xl p-3 text-center border backdrop-blur-sm`}
                  >
                    <p className="text-xl font-bold ${stat.text}">
                      {stat.value}
                    </p>
                    <p className={`text-xs ${stat.text} opacity-80 mt-1`}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${chartType}-${dataType}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm">
                    <ResponsiveContainer width="100%" height={350}>
                      {chartType === "pie" ? (
                        <PieChart>
                          <Pie
                            data={currentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props) => {
                              const { name, payload } = props;
                              const percentage =
                                typeof payload?.percentage === "number"
                                  ? payload.percentage
                                  : 0;
                              return percentage > 5
                                ? `${name}\n${percentage}%`
                                : "";
                            }}
                            outerRadius={120}
                            innerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {currentData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#fff"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend content={renderLegend} />
                        </PieChart>
                      ) : (
                        <BarChart
                          data={barData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            strokeOpacity={0.5}
                          />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 12 }}
                            interval={0}
                            stroke="#6b7280"
                            strokeOpacity={0.7}
                          />
                          <YAxis
                            tickFormatter={(value) => formatCurrency(value)}
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                            strokeOpacity={0.7}
                          />
                          <Tooltip content={<BarTooltip />} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {barData.map((entry, index) => (
                              <Cell
                                key={`bar-cell-${index}`}
                                fill={entry.fill}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-linear-to-r from-red-50/80 to-orange-50/80 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/60 dark:border-red-800/50">
                  <div className="absolute inset-0 bg-linear-to-r from-red-400 to-orange-400 opacity-10" />
                  <div className="relative p-4">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm mb-3 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Top Gastos
                    </h4>
                    <div className="space-y-3">
                      {expenseData.slice(0, 3).map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-white/50 dark:bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-200/30 dark:border-gray-700/30"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600 dark:text-red-400 text-sm">
                              {formatCurrency(item.value)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.percentage}%
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-linear-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/60 dark:border-green-800/50">
                  <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-400 opacity-10" />
                  <div className="relative p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Top Receitas
                    </h4>
                    <div className="space-y-3">
                      {incomeData.slice(0, 3).map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-white/50 dark:bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-200/30 dark:border-gray-700/30"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600 dark:text-green-400 text-sm">
                              {formatCurrency(item.value)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.percentage}%
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
