/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "../types/auth";
import { toastEmitter } from "../../../shared/lib/toast-event";

const mockUsers = [
  {
    id: "1",
    email: "demo@finflow.com",
    password: "demo123",
    name: "Usuário Demo",
    createdAt: new Date().toISOString(),
  },
];

const simulateAPICall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    await simulateAPICall(null, 1500);

    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = `fake-jwt-token-${Date.now()}`;

    return { user: userWithoutPassword, token };
  }

  static async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User; token: string }> {
    await simulateAPICall(null, 1500);

    if (!email || !password || !name) {
      throw new Error("Todos os campos são obrigatórios");
    }

    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("Este email já está em uso");
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push({ ...newUser, password });
    const token = `fake-jwt-token-${Date.now()}`;

    return { user: newUser, token };
  }

  static async resetPassword(email: string): Promise<void> {
    await simulateAPICall(null, 1000);

    const userExists = mockUsers.some((u) => u.email === email);
    if (!userExists) {
      throw new Error("Email não encontrado");
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const { user, token } = await AuthService.login(email, password);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toastEmitter.emit({
            type: "success",
            title: "Login realizado!",
            message: `Bem-vindo de volta, ${user.name}!`,
            duration: 3000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro no login",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });

        try {
          const { user, token } = await AuthService.register(
            email,
            password,
            name
          );

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toastEmitter.emit({
            type: "success",
            title: "Conta criada!",
            message: `Bem-vindo ao FinFlow, ${user.name}!`,
            duration: 3000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro no cadastro",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      logout: () => {
        const { user } = get();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        toastEmitter.emit({
          type: "info",
          title: "Logout realizado",
          message: user ? `Até logo, ${user.name}!` : "Sessão encerrada",
          duration: 3000,
        });
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true });

        try {
          await AuthService.resetPassword(email);
          set({ isLoading: false });

          toastEmitter.emit({
            type: "success",
            title: "Email enviado!",
            message: "Verifique sua caixa de entrada para redefinir sua senha",
            duration: 4000,
          });
        } catch (error) {
          set({ isLoading: false });

          toastEmitter.emit({
            type: "error",
            title: "Erro ao redefinir senha",
            message:
              error instanceof Error ? error.message : "Erro desconhecido",
            duration: 4000,
          });

          throw error;
        }
      },

      clearError: () => {},
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuthWithToast = () => {
  const auth = useAuthStore();

  return {
    ...auth,
  };
};
