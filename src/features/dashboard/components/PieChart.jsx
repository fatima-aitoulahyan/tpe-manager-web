import React from 'react'
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PieChart({ recettes, depenses }) {
    const data = [
        { name: 'Recettes', value: recettes ?? 0, color: '#10b981' },
        { name: 'Dépenses', value: depenses ?? 0, color: '#f43f5e' },
    ]

    const hasData = (recettes ?? 0) + (depenses ?? 0) > 0

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
            <p className="font-medium text-slate-700 mb-4">Répartition des flux</p>
            {hasData ? (
                <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString('fr-MA')} DH`} />
                        <Legend />
                    </RePieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-[250px] text-slate-400 text-sm">
                    Aucune donnée disponible
                </div>
            )}
        </div>
    )
}