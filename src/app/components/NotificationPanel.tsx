import React from 'react';
import { useNavigate } from 'react-router';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import type { Notification } from '../data/seed';

function NotificationIcon({ type }: { type: Notification['type'] }) {
  if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-[#312DC4] shrink-0" />;
  if (type === 'success') return <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />;
  return <Info className="w-4 h-4 text-gray-500 shrink-0" />;
}

export function NotificationPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserNotifications, markNotificationRead, markAllNotificationsRead } = useAppData();

  if (!user) return null;

  const notifications = getUserNotifications(user.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (notification: Notification) => {
    markNotificationRead(notification.id);
    if (notification.actionUrl) navigate(notification.actionUrl);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 text-gray-500 hover:bg-[#EEEDFB] hover:text-[#312DC4] rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#312DC4] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(340px,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllNotificationsRead(user.id)}
              className="text-xs text-[#312DC4] hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  !n.read ? 'bg-[#EEEDFB]/40' : ''
                }`}
              >
                <div className="flex gap-2">
                  <NotificationIcon type={n.type} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.createdAt}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 bg-[#312DC4] rounded-full shrink-0 mt-1" />}
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
