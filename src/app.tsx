import "./index.css";
import { Dashboard } from "./modules/dashboard/components/Dashboard";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { ToastNotification } from "./shared/components/toast/ToastNotification";

export function App() {
  return (
    <div>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
      <ToastNotification />
    </div>
  );
}
