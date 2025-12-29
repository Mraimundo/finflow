import type { ReactNode } from "react";
import { useAuthStore } from "../../modules/auth/store/authStore";
import { AuthPage } from "../../modules/auth/components/AuthPage";
import { Loading } from "./Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <>{children}</>;
}
