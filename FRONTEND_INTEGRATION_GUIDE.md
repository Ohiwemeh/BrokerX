# Frontend Integration Guide

## Overview
This guide shows how to connect your React frontend to the BrokerX backend API.

## Step 1: Install Axios (Recommended)

```bash
cd client
npm install axios
```

## Step 2: Create API Configuration

Create `client/src/api/config.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Step 3: Create API Service Functions

Create `client/src/api/services.js`:

```javascript
import api from './config';

// Auth Services
export const authService = {
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
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
};
```

## Step 4: Update Your Components

### Login Component Example

Update `client/src/pages/Auth/Login.jsx`:

```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../api/services";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);
      console.log("Login successful:", data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* ... existing header ... */}
      
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md bg-white shadow-sm border rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-2">Login to your account</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* ... existing footer ... */}
        </div>
      </main>
    </div>
  );
};

export default Login;
```

### Signup Component Example

Update `client/src/pages/Auth/Signup.jsx`:

```javascript
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { authService } from "../../api/services";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const data = await authService.signup(signupData);
      console.log("Signup successful:", data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... Add form with handleSubmit and handleChange
  );
};

export default Signup;
```

### Dashboard Component Example

Update `client/src/pages/Dashboard.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import { transactionService } from '../api/services';
// ... other imports

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await transactionService.getDashboardStats();
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen flex bg-slate-900 text-white font-sans">
      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<FaStar />} 
            title="Account Status" 
            value={dashboardData?.accountStatus || "Active"} 
            color="text-blue-400" 
          />
          <StatCard 
            icon={<FaArrowCircleUp />} 
            title="Deposit" 
            value={`$${dashboardData?.totalDeposit?.toLocaleString() || 0}`} 
          />
          <StatCard 
            icon={<FaChartLine />} 
            title="Profit" 
            value={`$${dashboardData?.profit?.toLocaleString() || 0}`} 
            color="text-green-400" 
          />
          <StatCard 
            icon={<FaArrowCircleDown />} 
            title="Total Withdrawal" 
            value={`$${dashboardData?.totalWithdrawal?.toLocaleString() || 0}`} 
            color="text-red-400" 
          />
        </div>
        {/* ... rest of dashboard with dashboardData.transactions ... */}
      </main>
    </div>
  );
};

export default Dashboard;
```

## Step 5: Protected Routes

Create `client/src/components/ProtectedRoute.jsx`:

```javascript
import { Navigate } from 'react-router';
import { authService } from '../api/services';

const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
```

Update your router to use protected routes:

```javascript
import ProtectedRoute from "./components/ProtectedRoute";

<Route element={<MainLayout />}>
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  {/* ... other protected routes ... */}
</Route>
```

## Step 6: Error Handling

Create `client/src/utils/errorHandler.js`:

```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};
```

## Step 7: Start Both Servers

**Terminal 1 (Backend):**
```bash
cd server
node index.js
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## Common Integration Patterns

### Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await someService.someMethod();
  } finally {
    setLoading(false);
  }
};
```

### Error Handling
```javascript
const [error, setError] = useState(null);

try {
  const data = await someService.someMethod();
} catch (err) {
  setError(err.response?.data?.message || 'Error occurred');
}
```

### Success Messages
```javascript
const [success, setSuccess] = useState('');

try {
  await someService.someMethod();
  setSuccess('Operation successful!');
  setTimeout(() => setSuccess(''), 3000);
} catch (err) {
  // handle error
}
```

## Testing Checklist

- [ ] User can sign up
- [ ] User can log in
- [ ] Token is stored in localStorage
- [ ] Protected routes redirect to login when not authenticated
- [ ] Dashboard loads user data
- [ ] Profile can be updated
- [ ] Files can be uploaded
- [ ] Transactions can be created
- [ ] Admin panel works for admin users
- [ ] Logout clears token and redirects

## Troubleshooting

### CORS Errors
Backend already has CORS enabled. If issues persist, check browser console.

### 401 Errors
- Check if token is being sent in Authorization header
- Verify token hasn't expired
- Check if user exists in database

### Network Errors
- Ensure backend is running on port 5000
- Check firewall settings
- Verify API_BASE_URL is correct

## Next Steps

1. Add loading spinners to all async operations
2. Implement toast notifications for success/error messages
3. Add form validation
4. Implement real-time updates (WebSockets)
5. Add pagination to transaction lists
6. Implement search and filter functionality

Happy coding! 🎉
