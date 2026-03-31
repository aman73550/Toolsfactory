import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ToolLoader from './pages/ToolLoader';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="tools/:slug" element={<ToolLoader />} />
              <Route path="*" element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">404 - Page Not Found</h2>
                  <p className="text-slate-600">The page you are looking for does not exist.</p>
                </div>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
