import { Loader2, PieChart, TrendingUp, Wallet } from "lucide-react";

export function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute -bottom-2 -left-2 w-5 h-5 border-3 border-blue-500 border-r-transparent rounded-full animate-spin animation-delay-[-0.3s]"></div>
        </div>

        <div className="relative mb-6">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-2" />
          <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping"></div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Carregando FinFlow
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Organizando seus dados financeiros...
        </p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
          <div className="bg-linear-to-br from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"></div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Métricas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <PieChart className="w-4 h-4" />
            <span>Gráficos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Wallet className="w-4 h-4" />
            <span>Transações</span>
          </div>
        </div>
      </div>
    </div>
  );
}
