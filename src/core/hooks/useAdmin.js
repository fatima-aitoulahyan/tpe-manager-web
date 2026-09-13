import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export function useAdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    return { users, loading, error, refetch: fetchUsers };
}

export function useAdminUserDetail(id) {
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getUserDetail(id);
            setUserDetail(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { if (id) fetchDetail(); }, [id, fetchDetail]);

    return { userDetail, loading, error, refetch: fetchDetail };
}
export function useAdminUserActivity(id, type) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFn = {
        devis: adminApi.getUserDevis,
        factures: adminApi.getUserFactures,
        clients: adminApi.getUserClients,
    }[type];

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchFn(id)
            .then(setItems)
            .finally(() => setLoading(false));
    }, [id, type]);

    return { items, loading };
}