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
import { X, Loader2, Wallet, Calendar, Building } from "lucide-react";
import { salarySchema } from "../../../shared/lib/validations";
import type { SalaryFormData } from "../../../shared/lib/validations";
import { useFinancialActions } from "../../../shared/store/useFinancialActions";
import { useFinancialStore } from "../../../shared/store/financialStore";

interface SalaryFormProps {
  onClose: () => void;
}

export function SalaryForm({ onClose }: SalaryFormProps) {
  const { handleSetSalary, handleGetToday, handleFormatDate } =
    useFinancialActions();
  const isLoading = useFinancialStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SalaryFormData>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      receiptDate: handleGetToday(),
      source: "Empresa",
    },
  });

  const onSubmit = async (data: SalaryFormData) => {
    try {
      const result = await handleSetSalary(data);

      if (result.success) {
        reset();
        onClose();
      } else {
        console.error("Erro ao definir salário:", result.error);
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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-2xl border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 opacity-50" />

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Receber Salário
                </CardTitle>
              </div>
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

            <CardContent className="relative space-y-6 pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Valor do Salário
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...register("amount", { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0,00"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data de Recebimento
                  </label>
                  <input
                    type="date"
                    {...register("receiptDate")}
                    max={maxDate}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                  {errors.receiptDate && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.receiptDate.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <span>📅</span>
                    Data máxima permitida: <strong>{formattedMaxDate}</strong>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Fonte do Rendimento
                  </label>
                  <select
                    {...register("source")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    <option value="Empresa">🏢 Empresa</option>
                    <option value="Freelance">💻 Freelance</option>
                    <option value="Investimentos">📈 Investimentos</option>
                    <option value="Aluguel">🏠 Aluguel</option>
                    <option value="Pensão">👵 Pensão</option>
                    <option value="Outros">🔍 Outros</option>
                  </select>
                  {errors.source && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.source.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium disabled:opacity-50 transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Wallet className="w-4 h-4" />
                        <span>Adicionar Salário</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 dark:text-blue-400 mt-0.5">
                    💡
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Dica importante
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Defina seu salário base para calcular corretamente suas
                      economias e planejar seus gastos mensais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    💰
                  </p>
                  <p>Base para Cálculos</p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    📊
                  </p>
                  <p>Planejamento Mensal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
