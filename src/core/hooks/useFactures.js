import { useState } from 'react';
import * as facturesApi from '../api/facturesApi';

export function useFactures() {
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

    const changeStatus = (id, status) => execute(facturesApi.updateFactureStatus, id, status);

    return {
        loading,
        error,
        fetchFactures: (p) => execute(facturesApi.getFactures, p),
        fetchOne: (id) => execute(facturesApi.getFactureById, id),
        create: (data) => execute(facturesApi.createFacture, data),
        update: (id, data) => execute(facturesApi.updateFacture, id, data), // ← ajout
        remove: (id) => execute(facturesApi.deleteFacture, id),
        pay: (id, mt) => execute(facturesApi.registerPayment, id, mt),
        downloadPdf: (id) => execute(facturesApi.downloadFacturePdf, id),
        changeStatus,
    };
}