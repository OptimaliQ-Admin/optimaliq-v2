import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { BellIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationBell() {
  const { state, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {state.unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
            {state.unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {state.unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              state.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  {notification.actionUrl && (
                    <Link
                      href={notification.actionUrl}
                      onClick={() => handleNotificationClick(notification.id)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 block"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <Link
              href="/notifications"
              className="block text-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 