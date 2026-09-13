import { useState, useEffect } from 'react'
import { dashboardApi } from '../api/dashboardApi'
import toast from 'react-hot-toast'

export function useDashboardStats() {
    const [stats, setStats] = useState(null)
    const [devisStats, setDevisStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [cashflowRes, devisRes] = await Promise.all([
                    dashboardApi.getCashflowSummary(),
                    dashboardApi.getDevisStats(),
                ])
                setStats(cashflowRes.data)
                setDevisStats(devisRes.data)
            } catch (err) {
                toast.error("Impossible de charger les statistiques financières")
                setStats(null)
                setDevisStats(null)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    return { stats, devisStats, loading }
}