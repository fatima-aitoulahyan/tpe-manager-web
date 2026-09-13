import api from './axiosConfig';

export const getEligibilite = () => api.get('/credit/eligibilite/');
export const getDemandes = (params) => api.get('/credit/demandes/', { params });
export const getDemande = (id) => api.get(`/credit/demandes/${id}/`);
export const createDemande = (data) => api.post('/credit/demandes/', data);
export const deleteDemande = (id) => api.delete(`/credit/demandes/${id}/`);
export const uploadJustificatif = (demandeId, formData) =>
    api.post(`/credit/demandes/${demandeId}/upload_justificatif/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
export const deleteJustificatif = (demandeId, justificatifId) =>
    api.delete(`/credit/demandes/${demandeId}/justificatif/${justificatifId}/`);