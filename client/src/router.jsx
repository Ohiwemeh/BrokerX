import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import LoadingSpinner from "./components/LoadingSpinner";

// Eager load critical routes
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Landing from "./pages/Landing";
import { AdminRoute } from "./components/ProtectedRoute";

// Lazy load other routes
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Markets = lazy(() => import("./pages/Markets"));
const AssetDetail = lazy(() => import("./pages/AssetDetail"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const DepositPage = lazy(() => import("./pages/Orders"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const WithdrawPage = lazy(() => import("./pages/WithdrawPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const TradingPlatform = lazy(() => import("./pages/TradingPlatform"));
const AdminPage = lazy(() => import("./admin/AdminPage"));
const AdminTransactions = lazy(() => import("./admin/AdminTransactions"));


const chartData = [
  { time: "11:16", value: 80 },
  { time: "11:30", value: 100 },
  { time: "11:48", value: 120 },
  { time: "12:00", value: 90 },
  { time: "12:16", value: 140 },
  { time: "12:40", value: 200 },
];

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen size="lg" />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Landing />} />
          
          {/* Admin Only Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
          <Route path="/admin/transactions" element={
            <AdminRoute>
              <AdminTransactions />
            </AdminRoute>
          } />

          {/* Protected (Main App) Routes */}
          <Route element={<MainLayout />}>
            
            <Route path="/dashboard" element={<Dashboard />} 
             chartData={chartData}
        bitcoinPrice={25948.18}
        ethereumPrice={1743.41}
        profit={150000}
        deposit={5000}
        withdrawal={150000}
            />
            <Route path="/markets" element={<Markets />} />
            <Route path="/statistics" element={<Markets />} />
            <Route path="/markets/:symbol" element={<AssetDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/depositpage" element={<DepositPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            
          </Route>

          {/* Trading Platform - Full Screen */}
          <Route path="/trade/:symbol" element={<TradingPlatform />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
