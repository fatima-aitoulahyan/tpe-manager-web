import { useState, useCallback } from "react";
import { cashflowApi } from "../api/cashflowApi";

export function useCashflow() {
    const [dashboard, setDashboard] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchDashboard = useCallback(async () => {
        const data = await cashflowApi.getDashboard();
        setDashboard(data);
        return data;
    }, []);

    const fetchTransactions = useCallback(async (filters = {}) => {
        setLoading(true);
        try {
            const { transactions: list, hasNext } = await cashflowApi.getAllPaginated({
                ...filters,
                page: 1,
            });
            setTransactions(list);
            setHasMore(hasNext);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(async (filters = {}) => {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const { transactions: list, hasNext } = await cashflowApi.getAllPaginated({
                ...filters,
                page: nextPage,
            });
            setTransactions((prev) => [...prev, ...list]);
            setHasMore(hasNext);
            setCurrentPage(nextPage);
        } finally {
            setLoadingMore(false);
        }
    }, [hasMore, loadingMore, currentPage]);

    const addTransaction = useCallback(async (data) => {
        const created = await cashflowApi.create(data);
        return created;
    }, []);

    const deleteTransaction = useCallback(async (id) => {
        await cashflowApi.remove(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const deleteMultiple = useCallback(async (ids) => {
        await Promise.all(ids.map((id) => cashflowApi.remove(id)));
        setTransactions((prev) => prev.filter((t) => !ids.includes(t.id)));
    }, []);

    return {
        dashboard,
        transactions,
        hasMore,
        loading,
        loadingMore,
        fetchDashboard,
        fetchTransactions,
        loadMore,
        addTransaction,
        deleteTransaction,
        deleteMultiple,
    };
}