// client/src/api/notificationService.js

import api from './config';

export const notificationService = {
  // Get all notifications
  getNotifications: async (status = 'all', page = 1, limit = 20) => {
    const response = await api.get('/notifications', {
      params: { status, page, limit }
    });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Clear all read notifications
  clearAll: async () => {
    const response = await api.delete('/notifications/clear-all');
    return response.data;
  }
};

export default notificationService;
