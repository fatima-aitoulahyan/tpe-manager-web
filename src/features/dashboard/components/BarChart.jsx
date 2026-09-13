import React from 'react'
import { BarChart as ReBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'

export default function BarChart({ recettes, depenses }) {
    const { t, i18n } = useTranslation()
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH'

    const data = [
        { name: t('chart_recettes', 'Recettes'), montant: recettes ?? 0, color: '#10b981' },
        { name: t('chart_depenses', 'Dépenses'), montant: depenses ?? 0, color: '#f43f5e' },
    ]

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
            <p className="font-medium text-slate-700 mb-4">{t('chart_title_flows', 'Analyse des flux mensuels')}</p>
            <ResponsiveContainer width="100%" height={250}>
                <ReBarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                        formatter={(value) => `${value.toLocaleString('fr-MA')} ${currency}`}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="montant" radius={[6, 6, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Bar>
                </ReBarChart>
            </ResponsiveContainer>
        </div>
    )
}