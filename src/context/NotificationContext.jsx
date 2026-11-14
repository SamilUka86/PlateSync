import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-4 ${
              n.type === 'success'
                ? 'bg-midnight-card/95 border-neon-success/40 text-emerald-100 shadow-neon-success/10'
                : n.type === 'error'
                ? 'bg-midnight-card/95 border-neon-error/40 text-rose-100 shadow-neon-error/10'
                : 'bg-midnight-card/95 border-neon-cyan/40 text-cyan-100 shadow-neon-cyan/10'
            }`}
          >
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-neon-success shrink-0 mt-0.5" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 text-neon-error shrink-0 mt-0.5" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs font-medium leading-relaxed">{n.message}</div>

            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return { addNotification: console.log };
  }
  return context;
};
