import api from './axiosConfig';

export const adminApi = {
    getUsers: async () => (await api.get('/admin/users/')).data,
    getUserDetail: async (id) => (await api.get(`/admin/users/${id}/`)).data,
    toggleUserActive: async (id) => (await api.post(`/admin/users/${id}/toggle-active/`)).data,
    getDashboardStats: async () => (await api.get('/admin/dashboard/')).data,
    getUserDevis: async (id) => (await api.get(`/admin/users/${id}/devis/`)).data,
    getUserFactures: async (id) => (await api.get(`/admin/users/${id}/factures/`)).data,
    getUserClients: async (id) => (await api.get(`/admin/users/${id}/clients/`)).data,
    getDevisDetail: async (id) => (await api.get(`/admin/devis/${id}/`)).data,
    getFactureDetail: async (id) => (await api.get(`/admin/factures/${id}/`)).data,
    getUserCashflowDashboard: async (id) => (await api.get(`/admin/users/${id}/cashflow/dashboard/`)).data,
    getUserTransactions: async (id) => (await api.get(`/admin/users/${id}/cashflow/`)).data,
};