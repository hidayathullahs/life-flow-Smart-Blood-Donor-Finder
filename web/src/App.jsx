import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import SearchPage from '@/pages/Search';
import DonorDetails from '@/pages/DonorDetails';
import RegisterDonor from '@/pages/RegisterDonor';
import AdminLogin from '@/admin/pages/AdminLogin';
import ForgotPassword from '@/admin/pages/ForgotPassword';
import AdminSetup from '@/admin/pages/AdminSetup';


import Dashboard from '@/admin/pages/Dashboard';
import ProtectedRoute from '@/routes/ProtectedRoute';
import EmergencyBanner from '@/components/EmergencyBanner';
import MobileBottomNav from '@/components/MobileBottomNav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased selection:bg-red-100 selection:text-red-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 pb-16 md:pb-0">
                        <EmergencyBanner />
                        <Routes>
                            {/* Public Routes with Layout */}
                            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                            <Route path="/search" element={<><Navbar /><SearchPage /><Footer /></>} />
                            <Route path="/donor/:id" element={<><Navbar /><DonorDetails /><Footer /></>} />
                            <Route path="/register" element={<><Navbar /><RegisterDonor /><Footer /></>} />

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                            <Route path="/admin-setup" element={<AdminSetup />} />
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        <MobileBottomNav />

                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </div>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
