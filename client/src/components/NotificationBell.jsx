import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaCheckDouble, FaTrash, FaTimes } from 'react-icons/fa';
import { notificationService } from '../api/notificationService';
import { Link } from 'react-router';
import { useSocket } from '../context/SocketContext';
import { useNotificationSound } from '../hooks/useNotificationSound';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'read'
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const audioRef = useRef(null);
  
  // Socket and sound
  const { socket, connected } = useSocket();
  const { playSound } = useNotificationSound();

  // Fetch notifications
  const fetchNotifications = async (status = 'all') => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(status, 1, 20);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      const previousCount = unreadCount;
      setUnreadCount(count);
      
      // Play sound if new notification
      if (count > previousCount && audioRef.current) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (!socket) {
      console.log('❌ Socket not available in NotificationBell');
      return;
    }

    console.log('✅ Setting up socket listener for new-user-signup');

    // Listen for new user signup notifications
    socket.on('new-user-signup', (data) => {
      console.log('🔔 New user signup notification received:', data);
      
      // Play notification sound
      try {
        playSound();
        console.log('✅ Sound played');
      } catch (error) {
        console.error('❌ Sound error:', error);
      }
      
      // Refresh notifications and count
      console.log('🔄 Refreshing notifications...');
      fetchNotifications(activeTab);
      fetchUnreadCount();
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('New User Signup', {
          body: data.message,
          icon: '/logo.png',
          badge: '/logo.png'
        });
        console.log('✅ Browser notification shown');
      } else {
        console.log('⚠️ Browser notification permission:', Notification.permission);
      }
    });

    return () => {
      console.log('🧹 Cleaning up socket listener');
      socket.off('new-user-signup');
    };
  }, [socket, activeTab, playSound]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications(activeTab);
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds (backup)
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (isOpen) {
        fetchNotifications(activeTab);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications(activeTab);
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications(activeTab);
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      fetchNotifications(activeTab);
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Clear all read
  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      fetchNotifications(activeTab);
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  // Get notification icon and color
  const getNotificationStyle = (type) => {
    const styles = {
      USER_REGISTERED: { icon: '👤', color: 'text-blue-400', bg: 'bg-blue-500/10' },
      USER_VERIFIED: { icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10' },
      USER_REJECTED: { icon: '❌', color: 'text-red-400', bg: 'bg-red-500/10' },
      DEPOSIT_REQUEST: { icon: '💰', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
      DEPOSIT_APPROVED: { icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10' },
      DEPOSIT_REJECTED: { icon: '❌', color: 'text-red-400', bg: 'bg-red-500/10' },
      SETTINGS_CHANGED: { icon: '⚙️', color: 'text-gray-400', bg: 'bg-gray-500/10' },
      PROFILE_UPDATED: { icon: '📝', color: 'text-blue-400', bg: 'bg-blue-500/10' },
      WITHDRAWAL_REQUEST: { icon: '💸', color: 'text-purple-400', bg: 'bg-purple-500/10' },
      ADMIN_MESSAGE: { icon: '📢', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    };
    return styles[type] || { icon: '🔔', color: 'text-gray-400', bg: 'bg-gray-500/10' };
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
      >
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                  activeTab === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setActiveTab('read')}
                className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                  activeTab === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Read
              </button>
            </div>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b border-slate-700 flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  <FaCheckDouble /> Mark all read
                </button>
              )}
              {activeTab === 'read' && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                >
                  <FaTrash /> Clear all
                </button>
              )}
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                <FaBell className="text-4xl mb-2" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {notifications.map((notification) => {
                  const style = getNotificationStyle(notification.type);
                  return (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-slate-700/50 transition ${
                        !notification.isRead ? 'bg-slate-700/30' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${style.bg} flex items-center justify-center text-xl`}>
                          {style.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-white text-sm">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">
                              {timeAgo(notification.createdAt)}
                            </span>
                            <div className="flex gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className="text-xs text-blue-400 hover:text-blue-300"
                                  title="Mark as read"
                                >
                                  <FaCheck />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification._id)}
                                className="text-xs text-red-400 hover:text-red-300"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
