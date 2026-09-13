import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../shared/components/layout/AuthLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage.jsx";
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../shared/components/layout/MainLayout';

import DashboardPage from '../features/dashboard/pages/DashboardPage';
import DevisListPage from "../features/devis/page/DevisListPage.jsx";
import DevisDetailPage from "../features/devis/page/DevisDetailPage.jsx";
import DevisCreatePage from "../features/devis/page/DevisCreatePage.jsx";
import ClientsPage from "../features/clients/pages/ClientsPage.jsx";
import FactureDetailPage from "../features/factures/pages/FactureDetailPage.jsx";
import FactureCreatePage from "../features/factures/pages/FactureCreatePage.jsx";
import FactureListPage from "../features/factures/pages/FactureListPage.jsx";
import FactureEditPage from "../features/factures/pages/FactureEditPage.jsx";
import CashflowPage from "../features/cashflow/pages/CashflowPage.jsx";
import DevisEditPage from "../features/devis/page/DevisEditPage.jsx";
import CreditPage from "../features/credit/pages/CreditPage.jsx";
import DemandeCreatePage from "../features/credit/pages/DemandeCreatePage.jsx";
import DemandeDetailPage from "../features/credit/pages/DemandeDetailPage.jsx";
import NotificationsPage from "../features/notifications/pages/NotificationsPage.jsx";
import ProfilePage from "../features/profile/pages/ProfilePage.jsx";
import AdminLayout from '../features/admin/components/AdminLayout'
import AdminUsersListPage from '../features/admin/pages/AdminUsersListPage'
import AdminUserDetailPage from '../features/admin/pages/AdminUserDetailPage'
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/devis" element={<DevisListPage />} />
                        <Route path="/devis/new" element={<DevisCreatePage />} />
                        <Route path="/devis/:id" element={<DevisDetailPage />} />
                        <Route path="/devis/:id/edit" element={<DevisEditPage />} />
                        <Route path="/clients" element={<ClientsPage />} />
                        <Route path="/factures" element={<FactureListPage />} />
                        <Route path="/factures/new" element={<FactureCreatePage />} />
                        <Route path="/factures/:id" element={<FactureDetailPage />} />
                        <Route path="/factures/:id/edit" element={<FactureEditPage />} />
                        <Route path="/cashflow" element={<CashflowPage />} />
                        <Route path="/credit" element={<CreditPage />} />
                        <Route path="/credit/create" element={<DemandeCreatePage />} />
                        <Route path="/credit/:id" element={<DemandeDetailPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/users" element={<AdminUsersListPage />} />
                        <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />

                        <Route path="/admin/devis/:id" element={<DevisDetailPage />} />
                        <Route path="/admin/factures/:id" element={<FactureDetailPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
export default AppRouter;