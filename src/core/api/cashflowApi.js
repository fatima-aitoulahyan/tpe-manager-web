import api from "./axiosConfig";

const BASE = "/tresorerie";

export const cashflowApi = {
    getDashboard: async () => {
        const res = await api.get(`${BASE}/dashboard/`);
        return res.data;
    },

    getAllPaginated: async ({
                                type,
                                categorie,
                                dateDebut,
                                dateFin,
                                search,
                                page = 1,
                                pageSize = 20,
                            } = {}) => {
        const res = await api.get(`${BASE}/`, {
            params: {
                ...(type ? { type } : {}),
                ...(categorie ? { categorie } : {}),
                ...(dateDebut ? { date_debut: dateDebut } : {}),
                ...(dateFin ? { date_fin: dateFin } : {}),
                ...(search && search.trim() ? { search: search.trim() } : {}),
                page,
                page_size: pageSize,
            },
        });
        return {
            transactions: res.data.results,
            hasNext: res.data.next !== null,
            count: res.data.count,
        };
    },

    create: async (data) => {
        const res = await api.post(`${BASE}/`, data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`${BASE}/${id}/`, data);
        return res.data;
    },

    remove: async (id) => {
        await api.delete(`${BASE}/${id}/`);
    },
};