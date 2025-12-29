import { AnimatePresence, motion } from "framer-motion";
import { Notification } from "./Notification";
import { useToast } from "../../hooks/useToast";

export function ToastNotification() {
  const { notifications, removeToast } = useToast();

  return (
    <div
      className="fixed z-50 top-4 right-4 flex flex-col gap-3 w-full max-w-sm"
      role="region"
      aria-label="Notificações"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <Notification
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              showIcon={toast.showIcon}
              onClose={() => removeToast(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
