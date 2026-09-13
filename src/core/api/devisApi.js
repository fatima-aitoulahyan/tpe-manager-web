import api from './axiosConfig';

export const getDevisPaginated = async (params) => {
    const response = await api.get('/devis/', {
        params: {
            statut: params?.statut || undefined,
            client: params?.clientId || undefined,
            date_debut: params?.dateDebut || undefined,
            date_fin: params?.dateFin || undefined,
            page: params?.page || 1,
            page_size: params?.pageSize || 10,
        }
    });
    return {
        count: response.data.count,
        hasNext: response.data.next !== null,
        devis: response.data.results
    };
};

export const getDevisById = async (id) => {
    const response = await api.get(`/devis/${id}/`);
    return response.data;
};

export const createDevis = async (data) => {
    const response = await api.post('/devis/', data);
    return response.data;
};

export const updateDevis = async (id, data) => {
    const response = await api.put(`/devis/${id}/`, data);
    return response.data;
};

export const deleteDevis = async (id) => {
    await api.delete(`/devis/${id}/`);
};

export const changeDevisStatus = async (id, status) => {
    await api.post(`/devis/${id}/change_status/`, { status });
};

export const duplicateDevis = async (id) => {
    const response = await api.post(`/devis/${id}/duplicate/`);
    return response.data;
};

export const convertToFacture = async (id) => {
    const response = await api.post(`/devis/${id}/convert_to_facture/`);
    return response.data;
};

export const downloadDevisPdf = async (id) => {
    const response = await api.get(`/devis/${id}/pdf/`, {
        responseType: 'blob'
    });
    return response.data;
};
export const generateDevisFromText = (text) => {
    return api.post('/devis/generate-from-text/', { text }).then(res => res.data);
};