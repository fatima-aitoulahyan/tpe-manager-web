import { useState, useCallback } from 'react';
import * as clientsApi from '../api/clientsApi';

export function useClients() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (apiFunc, ...args) => {
        setLoading(true);
        setError(null);
        try {
            return await apiFunc(...args);
        } catch (err) {
            const msg = err.response?.data?.detail || "Une erreur est survenue avec le module client.";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        fetchAll: () => execute(clientsApi.getAllClients),
        fetchOne: (id) => execute(clientsApi.getClientById, id),
        create: (data) => execute(clientsApi.createClient, data),
        update: (id, data) => execute(clientsApi.updateClient, id, data),
        remove: (id) => execute(clientsApi.deleteClient, id),
    };
}