import { useState } from 'react';
import * as creditApi from '../api/creditApi';

export function useCredit() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (apiFunc, ...args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFunc(...args);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        fetchEligibilite: () => execute(creditApi.getEligibilite),
        fetchDemandes: (params) => execute(creditApi.getDemandes, params),
        fetchDemande: (id) => execute(creditApi.getDemande, id),
        createDemande: (data) => execute(creditApi.createDemande, data),
        removeDemande: (id) => execute(creditApi.deleteDemande, id),
        uploadJustificatif: (demandeId, formData) =>
            execute(creditApi.uploadJustificatif, demandeId, formData),
        deleteJustificatif: (demandeId, justificatifId) =>
            execute(creditApi.deleteJustificatif, demandeId, justificatifId),
    };
}