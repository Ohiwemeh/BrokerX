import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import AssetDetail from "./pages/AssetDetail";
import Portfolio from "./pages/Portfolio";
import DepositPage from "./pages/Orders";
import SettingsPage from "./pages/Settings";
import Landing from "./pages/Landing";
import WalletPage from "./pages/WalletPage";
import TransactionsPage from "./pages/TransactionsPage";
import AdminPage from "./admin/AdminPage";


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
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Landing />} />

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
          <Route path="/transactions" element={<TransactionsPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
