import api from './axiosConfig';

export const getFactures = (params) => api.get('/factures/', { params });
export const getFactureById = (id) => api.get(`/factures/${id}/`);
export const createFacture = (data) => api.post('/factures/', data);
export const deleteFacture = (id) => api.delete(`/factures/${id}/`);
export const updateFactureStatus = (id, status) => api.post(`/factures/${id}/change_status/`, { status });
export const registerPayment = (id, montant) => api.post(`/factures/${id}/enregistrer_paiement/`, { montant });
export const downloadFacturePdf = (id) => api.get(`/factures/${id}/pdf/`, { responseType: 'blob' });
export const updateFacture = (id, data) => api.put(`/factures/${id}/`, data);