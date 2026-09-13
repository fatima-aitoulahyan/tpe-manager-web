import { useState, useCallback } from 'react';
import * as devisApi from '../api/devisApi';

export function useDevis() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (apiFunc, ...args) => {
        setLoading(true);
        setError(null);
        try {
            return await apiFunc(...args);
        } catch (err) {
            const msg = err.response?.data?.detail || err.response?.data?.error || "Une erreur est survenue";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }, []);


    const generateFromText = useCallback(async (text) => {
        setLoading(true);
        setError(null);
        try {
            return await devisApi.generateDevisFromText(text);
        } catch (err) {
            const payload = err.response?.data || {};
            const msg = payload.error || payload.detail || "Erreur lors de la génération IA";
            setError(msg);
            const customError = new Error(msg);
            customError.status = err.response?.status;
            customError.payload = payload;
            throw customError;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        fetchDevis: (params) => execute(devisApi.getDevisPaginated, params),
        fetchOne: (id) => execute(devisApi.getDevisById, id),
        create: (data) => execute(devisApi.createDevis, data),
        update: (id, data) => execute(devisApi.updateDevis, id, data),
        remove: (id) => execute(devisApi.deleteDevis, id),
        changeStatus: (id, status) => execute(devisApi.changeDevisStatus, id, status),
        duplicate: (id) => execute(devisApi.duplicateDevis, id),
        convertToFacture: (id) => execute(devisApi.convertToFacture, id),
        downloadPdf: (id) => execute(devisApi.downloadDevisPdf, id),
        generateFromText,
    };
}