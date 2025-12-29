import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

type AuthMode = "login" | "register" | "reset-password";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const handleForgotPassword = () => {
    setMode("reset-password");
  };

  const handleBackToLogin = () => {
    setMode("login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm
                onToggleMode={handleToggleMode}
                onForgotPassword={handleForgotPassword}
              />
            </motion.div>
          )}

          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm onToggleMode={handleToggleMode} />
            </motion.div>
          )}

          {mode === "reset-password" && (
            <motion.div
              key="reset-password"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ResetPasswordForm onBackToLogin={handleBackToLogin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
