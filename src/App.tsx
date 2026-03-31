import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import ToolLoader from './pages/ToolLoader';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminTools from './pages/AdminTools';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminContentEditor from './pages/AdminContentEditor';
import AdminSecurity from './pages/AdminSecurity';
import AdminMaintenance from './pages/AdminMaintenance';
import AdminLogs from './pages/AdminLogs';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Site */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="tools/:slug" element={<ToolLoader />} />
            </Route>

            {/* Admin Portal */}
            <Route path="/admin-dashboard-access/login" element={<AdminLogin />} />
            <Route path="/admin-dashboard-access" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="content-editor" element={<AdminContentEditor />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="maintenance" element={<AdminMaintenance />} />
              <Route path="logs" element={<AdminLogs />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">404 - Page Not Found</h2>
                <p className="text-slate-600">The page you are looking for does not exist.</p>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
