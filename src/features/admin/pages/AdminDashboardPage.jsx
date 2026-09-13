import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../core/api/adminApi';
import Spinner from '../../../shared/components/ui/Spinner';
import { useSelector } from 'react-redux';
import { Users } from 'lucide-react';
import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    Line,
} from 'recharts';

export default function AdminDashboardPage() {
    const { user } = useSelector((s) => s.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        adminApi
            .getDashboardStats()
            .then(setStats)
            .catch(() => setError('Erreur de chargement des statistiques'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
    if (error) return <p className="text-red-600">{error}</p>;

    const evolution = stats.evolution || [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Tableau de bord</h1>
            <p className="text-slate-500 mb-8">Bonjour {user?.nom}. Vue d'ensemble de la plateforme.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <StatCard icon={Users} color="indigo" label="Utilisateurs inscrits" value={stats.total_users} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-800 mb-1">Évolution sur 12 mois</h2>
                <p className="text-sm text-slate-500 mb-5">Inscriptions et chiffre d'affaires encaissé par mois</p>

                {evolution.length === 0 ? (
                    <p className="text-center text-slate-400 py-10 text-sm">Aucune donnée disponible</p>
                ) : (
                    <ResponsiveContainer width="100%" height={340}>
                        <ComposedChart data={evolution} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                            />
                            <YAxis
                                yAxisId="inscriptions"
                                allowDecimals={false}
                                tick={{ fontSize: 12, fill: '#6366f1' }}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: 'Inscriptions', angle: -90, position: 'insideLeft', fill: '#6366f1', fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="ca"
                                orientation="right"
                                tick={{ fontSize: 12, fill: '#059669' }}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: 'CA (DH)', angle: 90, position: 'insideRight', fill: '#059669', fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value, name) =>
                                    name === 'CA encaissé'
                                        ? [`${Number(value).toLocaleString('fr-FR')} DH`, name]
                                        : [value, name]
                                }
                                contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }}
                            />
                            <Legend wrapperStyle={{ fontSize: 13 }} />
                            <Bar
                                yAxisId="inscriptions"
                                dataKey="inscriptions"
                                name="Inscriptions"
                                fill="#c7d2fe"
                                radius={[4, 4, 0, 0]}
                                barSize={24}
                            />
                            <Line
                                yAxisId="ca"
                                type="monotone"
                                dataKey="ca"
                                name="CA encaissé"
                                stroke="#059669"
                                strokeWidth={2}
                                dot={{ r: 3, fill: '#059669' }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, color, label, value }) {
    const colorMap = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                <Icon size={22} />
            </div>
        </div>
    );
}