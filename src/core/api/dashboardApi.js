import axiosClient from './axiosConfig';
export const dashboardApi = {
    getCashflowSummary: () => axiosClient.get('/tresorerie/dashboard/'),
    getDevisStats: () => axiosClient.get('/devis/stats/'),
}