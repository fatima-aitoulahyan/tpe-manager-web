import React from 'react'
import { Wallet, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function SoldeCard({ solde, isVisible, onToggleVisibility, formatDH }) {
    const { t, i18n } = useTranslation()
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH'

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between transition-all duration-200 hover:shadow-md">
            <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t('solde_title', 'Trésorerie globale')}
                </p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                        {isVisible ? formatDH(solde) : `••••••• ${currency}`}
                    </p>
                    <button
                        onClick={onToggleVisibility}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
                    >
                        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                <p className="text-xs text-slate-400 font-light">
                    {t('solde_subtitle', 'Solde disponible en temps réel')}
                </p>
            </div>
            <div className="p-3 rounded-xl text-indigo-600 bg-indigo-50">
                <Wallet size={20} />
            </div>
        </div>
    )
}