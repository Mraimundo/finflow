import { useAuthStore } from "./authStore";

export const useAuthActions = () => {
  const { login } = useAuthStore();
  const { register } = useAuthStore();
  const { logout } = useAuthStore();
  const { resetPassword } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      await register(email, password, name);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    handleResetPassword,
  };
};
