import React from 'react'
import { useTranslation } from 'react-i18next'

export default function StatsCard({ title, value, icon: Icon, colorClass, desc, isVisible }) {
    const { i18n } = useTranslation()
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH'

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between transition-all duration-200 hover:shadow-md">
            <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {title}
                </p>
                <p className={`text-2xl font-bold tracking-tight ${colorClass.split(' ')[0]}`}>
                    {isVisible ? value : `••••••• ${currency}`}
                </p>
                <p className="text-xs text-slate-400 font-light">
                    {desc}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
    )
}