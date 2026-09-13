import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ArrowUpRight, ArrowDownRight, Clock, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import SoldeCard from '../components/SoldeCard'
import StatsCard from '../components/StatsCard'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import { dashboardApi } from '../../../core/api/dashboardApi'

export default function DashboardPage() {
    const { t, i18n } = useTranslation()
    const { user } = useSelector((state) => state.auth)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isBalanceVisible, setIsBalanceVisible] = useState(false)


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await dashboardApi.getCashflowSummary()
                setStats(res.data)
                console.log("Réponse API:", res.data)
            } catch (err) {
                toast.error(t('dashboard_toast_error', "Impossible de charger les statistiques financières"))
                setStats(null)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [t])

    const formatDH = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount ?? 0).replace('MAD', 'DH')
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const currentStats = stats ? {
        solde: stats.solde,
        recettesMois: stats.recettes_mois,
        depensesMois: stats.depenses_mois,
        facturesImpayees: 0,
    } : {
        solde: 0,
        recettesMois: 0,
        depensesMois: 0,
        facturesImpayees: 0
    }
    return (
        <div className="space-y-6 max-w-7xl mx-auto p-1 relative">


            <div className="pt-10 sm:pt-0">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('dashboard_title', "Tableau de bord")}</h1>
                <p className="text-slate-500 text-sm mt-0.5">
                    {t('dashboard_welcome', "Bonjour")} {user?.prenom || 'Fatima'} . {t('dashboard_subtitle', "Voici l'état financier de votre entreprise.")}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SoldeCard
                    solde={currentStats.solde}
                    isVisible={isBalanceVisible}
                    onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
                    formatDH={formatDH}
                />
                <StatsCard
                    title={t('dashboard_recettes_title', "Recettes du mois")}
                    value={formatDH(currentStats.recettesMois)}
                    icon={ArrowUpRight}
                    colorClass="text-emerald-600 bg-emerald-50"
                    desc={t('dashboard_recettes_desc', "Encaissé ce mois-ci")}
                    isVisible={isBalanceVisible}
                />
                <StatsCard
                    title={t('dashboard_depenses_title', "Dépenses du mois")}
                    value={formatDH(currentStats.depensesMois)}
                    icon={ArrowDownRight}
                    colorClass="text-rose-600 bg-rose-50"
                    desc={t('dashboard_depenses_desc', "Décaissements enregistrés")}
                    isVisible={isBalanceVisible}
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BarChart recettes={currentStats.recettesMois} depenses={currentStats.depensesMois} />
                </div>
                <div>
                    <PieChart recettes={currentStats.recettesMois} depenses={currentStats.depensesMois} />
                </div>
            </div>
        </div>
    )
}