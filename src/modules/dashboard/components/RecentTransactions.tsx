import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../shared/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Filter,
  Download,
  Upload,
  Search,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "../../../shared/lib/utils";
import type { TransactionType } from "../../../shared/types/financial";
import { useFinancialStore } from "../../../shared/store/financialStore";
import { useFinancialActions } from "../../../shared/store/useFinancialActions";

interface RecentTransactionsProps {
  onAddTransaction: () => void;
}

type FilterType = "all" | TransactionType;

interface DeleteDialogState {
  isOpen: boolean;
  transactionId: number | null;
  transactionDescription: string;
  isLoading: boolean;
}

export function RecentTransactions({
  onAddTransaction,
}: RecentTransactionsProps) {
  const { handleRemoveTransaction, handleGetFormattedTransactions } =
    useFinancialActions();
  const { transactions } = useFinancialStore();

  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    transactionId: null,
    transactionDescription: "",
    isLoading: false,
  });

  const formattedTransactions = handleGetFormattedTransactions({
    type: filter === "all" ? undefined : filter,
  });

  const filteredTransactions = formattedTransactions.data
    .filter(
      (transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    })
    .slice(0, 10);

  const openDeleteDialog = (id: number, description: string) => {
    setDeleteDialog({
      isOpen: true,
      transactionId: id,
      transactionDescription: description,
      isLoading: false,
    });
  };

  const closeDeleteDialog = () => {
    if (!deleteDialog.isLoading) {
      setDeleteDialog({
        isOpen: false,
        transactionId: null,
        transactionDescription: "",
        isLoading: false,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.transactionId) return;

    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await handleRemoveTransaction(deleteDialog.transactionId);
      if (result.success) {
        setTimeout(() => {
          setDeleteDialog({
            isOpen: false,
            transactionId: null,
            transactionDescription: "",
            isLoading: false,
          });
        }, 300);
      } else {
        setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Erro ao remover transação:", error);
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getAmountColor = (type: TransactionType) => {
    return type === "income"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const getAmountBgColor = (type: TransactionType) => {
    return type === "income"
      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/60 dark:border-green-800/50"
      : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/60 dark:border-red-800/50";
  };

  const getTransactionStats = () => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, count: filteredTransactions.length };
  };

  const stats = getTransactionStats();

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
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
                  <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Transações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-8xl"
                  >
                    💸
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                      Nenhuma transação encontrada
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Comece adicionando suas receitas e despesas para ter um
                      controle completo
                    </p>
                  </div>
                  <Button
                    onClick={onAddTransaction}
                    className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Primeira Transação
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Excluir Transação
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                  Confirmação necessária
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="py-4">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Você está prestes a excluir permanentemente a transação:
              <span className="block mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium">
                "{deleteDialog.transactionDescription}"
              </span>
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Esta ação não pode ser desfeita. A transação será removida
                  permanentemente do seu histórico.
                </span>
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={closeDeleteDialog}
              disabled={deleteDialog.isLoading}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteDialog.isLoading}
              className="px-5 py-2.5 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-lg shadow-lg hover:shadow-red-200/50 dark:hover:shadow-red-900/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {deleteDialog.isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
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
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    <div className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                      <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Transações Recentes
                  </CardTitle>
                  <Button
                    onClick={onAddTransaction}
                    className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all duration-200 hover:scale-105 border border-blue-400/20 dark:border-blue-600/30"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300/80 dark:border-gray-600/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as FilterType)}
                      className="text-sm border border-gray-300/80 dark:border-gray-600/80 rounded-xl px-3 py-2 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="all">📊 Todos</option>
                      <option value="income">📈 Receitas</option>
                      <option value="expense">📉 Despesas</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as "date" | "amount")
                      }
                      className="text-sm border border-gray-300/80 dark:border-gray-600/80 rounded-xl px-3 py-2 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="date">📅 Data</option>
                      <option value="amount">💰 Valor</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <AnimatePresence mode="popLayout">
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {filteredTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.05,
                        }}
                        className="flex space-x-4 space-y-4 flex-col justify-between p-4 border border-gray-200/60 dark:border-gray-700/60 rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md backdrop-blur-sm transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">
                                {transaction.description}
                              </p>
                              {transaction.isToday && (
                                <span className="px-2 py-1 bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium border border-green-200/50 dark:border-green-800/50">
                                  Hoje
                                </span>
                              )}
                              {transaction.isYesterday && (
                                <span className="px-2 py-1 bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium border border-blue-200/50 dark:border-blue-800/50">
                                  Ontem
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                              <span className="bg-gray-100/80 dark:bg-gray-700/80 px-2 py-1 rounded-md font-medium border border-gray-200/50 dark:border-gray-600/50">
                                {transaction.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {transaction.formattedDate}
                              </span>
                              <span className="text-xs opacity-75">
                                {transaction.relativeTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <div
                            className={`px-4 py-2.5 rounded-lg border backdrop-blur-sm min-w-[120px] text-right ${getAmountBgColor(
                              transaction.type
                            )}`}
                          >
                            <span
                              className={`font-bold text-lg ${getAmountColor(
                                transaction.type
                              )}`}
                            >
                              {transaction.formattedAmount}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openDeleteDialog(
                                transaction.id,
                                transaction.description
                              )
                            }
                            className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 ml-2"
                            aria-label={`Excluir transação: ${transaction.description}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-linear-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-800/50"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-400 opacity-10" />
                  <div className="relative p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Resumo do Filtro
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center bg-white/60 dark:bg-gray-800/60 py-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                        <p className="text-gray-500 dark:text-gray-400">
                          Transações
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {stats.count}
                        </p>
                      </div>
                      <div className="text-center bg-green-50/60 dark:bg-green-900/20 py-2 rounded-lg border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm">
                        <p className="text-green-600 dark:text-green-400">
                          Receitas
                        </p>
                        <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                          {formatCurrency(stats.income)}
                        </p>
                      </div>
                      <div className="text-center bg-red-50/60 dark:bg-red-900/20 py-2 rounded-lg border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm">
                        <p className="text-red-600 dark:text-red-400">
                          Despesas
                        </p>
                        <p className="font-bold text-red-600 dark:text-red-400 text-lg">
                          {formatCurrency(stats.expenses)}
                        </p>
                      </div>
                    </div>
                    {searchTerm && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                        Buscando por: "
                        <strong className="text-blue-600 dark:text-blue-400">
                          {searchTerm}
                        </strong>
                        "
                      </p>
                    )}
                  </div>
                </motion.div>

                {filteredTransactions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative text-center py-12 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm"
                  >
                    <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="font-medium text-gray-600 dark:text-gray-300">
                      Nenhuma transação encontrada
                    </p>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "Tente ajustar os termos da busca"
                        : "Tente alterar os filtros aplicados"}
                    </p>
                  </motion.div>
                )}

                {filteredTransactions.length > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mostrando {filteredTransactions.length} de{" "}
                      {formattedTransactions.data.length} transações
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddTransaction}
                      className="text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/50 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 backdrop-blur-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Mais
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </motion.div>
    </>
  );
}
