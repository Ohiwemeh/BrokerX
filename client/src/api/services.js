import api from './config';

// Auth Services
export const authService = {
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Profile Services
export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await api.post('/profile/upload-profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadID: async (idFront, idBack) => {
    const formData = new FormData();
    if (idFront) formData.append('idFront', idFront);
    if (idBack) formData.append('idBack', idBack);
    const response = await api.post('/profile/upload-id', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/profile/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  toggle2FA: async () => {
    const response = await api.put('/profile/toggle-2fa');
    return response.data;
  },
};

// Transaction Services
export const transactionService = {
  getTransactions: async (filters = {}) => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  getTransaction: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createDeposit: async (amount, method, currency = 'USD') => {
    const response = await api.post('/transactions/deposit', {
      amount,
      method,
      currency,
    });
    return response.data;
  },

  createWithdrawal: async (amount, method, currency = 'USD') => {
    const response = await api.post('/transactions/withdrawal', {
      amount,
      method,
      currency,
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/transactions/dashboard/stats');
    return response.data;
  },
};

// Wallet Services
export const walletService = {
  getWallet: async () => {
    const response = await api.get('/wallet');
    return response.data;
  },

  transfer: async (amount, from, to) => {
    const response = await api.post('/wallet/transfer', { amount, from, to });
    return response.data;
  },
};

// Admin Services
export const adminService = {
  getUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  verifyUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/verify`);
    return response.data;
  },

  rejectUser: async (id, reason) => {
    const response = await api.put(`/admin/users/${id}/reject`, { reason });
    return response.data;
  },

  addFunds: async (id, amount, description) => {
    const response = await api.post(`/admin/users/${id}/add-funds`, {
      amount,
      description,
    });
    return response.data;
  },

  sendEmail: async (id, subject, message) => {
    const response = await api.post(`/admin/users/${id}/send-email`, {
      subject,
      message,
    });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  updateTransactionStatus: async (id, status) => {
    const response = await api.put(`/admin/transactions/${id}/update-status`, {
      status,
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getTransactions: async (filters = {}) => {
    const response = await api.get('/admin/transactions', { params: filters });
    return response.data;
  },

  updateTransactionStatus: async (id, status) => {
    const response = await api.put(`/admin/transactions/${id}/update-status`, { status });
    return response.data;
  },
};

// Email Services
export const emailService = {
  sendEmail: async (userId, subject, message) => {
    const response = await api.post('/email/send', { userId, subject, message });
    return response.data;
  },

  sendVerificationEmail: async (userId) => {
    const response = await api.post('/email/send-verification', { userId });
    return response.data;
  },

  sendRejectionEmail: async (userId, reason) => {
    const response = await api.post('/email/send-rejection', { userId, reason });
    return response.data;
  },

  testEmail: async () => {
    const response = await api.post('/email/test');
    return response.data;
  },
};
