import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { X, Loader2 } from "lucide-react";
import type { TransactionFormData } from "../../../shared/lib/validations";
import { transactionSchema } from "../../../shared/lib/validations";
import { useFinancialActions } from "../../../shared/store/useFinancialActions";
import { useFinancialStore } from "../../../shared/store/financialStore";

interface TransactionFormProps {
  onClose: () => void;
}

export function TransactionForm({ onClose }: TransactionFormProps) {
  const { handleAddTransaction, handleFormatDate, handleGetToday } =
    useFinancialActions();

  const isLoading = useFinancialStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      date: handleGetToday(),
    },
  });

  const transactionType = watch("type");

  const categories = {
    income: ["Salário", "Freelance", "Investimentos", "Presente", "Outros"],
    expense: [
      "Alimentação",
      "Transporte",
      "Moradia",
      "Lazer",
      "Saúde",
      "Educação",
      "Compras",
      "Outros",
    ],
  };

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const result = await handleAddTransaction(data);

      if (result.success) {
        reset();
        onClose();
      } else {
        console.error("Erro ao adicionar transação:", result.error);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    }
  };

  const maxDate = handleGetToday();
  const formattedMaxDate = handleFormatDate(maxDate);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {transactionType === "income" ? "Nova Receita" : "Nova Despesa"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={isLoading}
                className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo
                  </label>
                  <div className="flex gap-2 mt-1">
                    {(["expense", "income"] as const).map((type) => (
                      <label
                        key={type}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={type}
                          {...register("type")}
                          className="hidden"
                          disabled={isLoading}
                        />
                        <div
                          className={`px-4 py-2 rounded-md border-2 transition-all duration-200 font-medium ${
                            transactionType === type
                              ? type === "income"
                                ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-300 shadow-sm"
                                : "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-300 shadow-sm"
                              : "bg-gray-50 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                          } ${
                            isLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:scale-105"
                          }`}
                          onClick={() => !isLoading && setValue("type", type)}
                        >
                          {type === "income" ? "📈 Receita" : "📉 Despesa"}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoria
                  </label>
                  <select
                    {...register("category")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories[transactionType].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...register("amount", { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0,00"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descrição
                  </label>
                  <input
                    type="text"
                    {...register("description")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ex: Supermercado mensal, Pagamento de freelance..."
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data
                  </label>
                  <input
                    type="date"
                    {...register("date")}
                    max={maxDate}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.date.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <span>📅</span>
                    Data máxima permitida: <strong>{formattedMaxDate}</strong>
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium disabled:opacity-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-3 font-medium text-white transition-all duration-200 ${
                      transactionType === "income"
                        ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900"
                        : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900"
                    } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Adicionando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>💾</span>
                        <span>
                          Adicionar{" "}
                          {transactionType === "income" ? "Receita" : "Despesa"}
                        </span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 dark:text-blue-400 mt-0.5">
                    💡
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Dica importante
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Use descrições claras para facilitar a organização das
                      suas finanças. Exemplos: "Mercado Semanal", "Pagamento
                      Conta de Luz", "Salário".
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
