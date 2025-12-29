import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export function Logo() {
  return (
    <motion.div
      className="flex items-center gap-3"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="relative">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
      </div>
      <div>
        <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          FinFlow
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
          Controle financeiro inteligente
        </p>
      </div>
    </motion.div>
  );
}
