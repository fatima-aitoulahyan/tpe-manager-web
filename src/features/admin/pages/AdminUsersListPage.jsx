import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminUsers } from '../../../core/hooks/useAdmin';
import Spinner from '../../../shared/components/ui/Spinner';
import { Eye } from 'lucide-react';

export default function AdminUsersListPage() {
    const { users, loading, error } = useAdminUsers();
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter(
            (u) =>
                u.nom?.toLowerCase().includes(q) ||
                u.prenom?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q)
        );
    }, [users, search]);

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <h1 className="text-3xl font-bold text-slate-900">Gestion des utilisateurs</h1>
            </div>
            <p className="text-slate-500 mb-6">Consultez et suivez l'ensemble des comptes inscrits.</p>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                        <th className="px-6 py-4 text-left">Utilisateur</th>
                        <th className="px-6 py-4 text-left">Statut fiscal</th>
                        <th className="px-6 py-4 text-center">Devis</th>
                        <th className="px-6 py-4 text-center">Factures</th>
                        <th className="px-6 py-4 text-center">Clients</th>
                        <th className="px-6 py-4 text-right">CA (DH)</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filtered.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <p className="font-semibold text-slate-900">{u.nom} {u.prenom}</p>
                                <p className="text-slate-400 text-xs">{u.email}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-600 capitalize">{u.statut_fiscal || '—'}</td>
                            <td className="px-6 py-4 text-center text-slate-700">{u.nb_devis}</td>
                            <td className="px-6 py-4 text-center text-slate-700">{u.nb_factures}</td>
                            <td className="px-6 py-4 text-center text-slate-700">{u.nb_clients}</td>
                            <td className="px-6 py-4 text-right font-semibold text-slate-900">
                                {u.ca_total ? Number(u.ca_total).toLocaleString('fr-FR') : '—'}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <Link
                                    to={`/admin/users/${u.id}`}
                                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                >
                                    <Eye size={16} /> Voir
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}