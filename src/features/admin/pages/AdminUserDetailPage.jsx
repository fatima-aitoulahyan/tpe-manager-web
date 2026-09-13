import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminUserDetail, useAdminUserActivity } from '../../../core/hooks/useAdmin';
import { adminApi } from '../../../core/api/adminApi';
import Spinner from '../../../shared/components/ui/Spinner';
import { ArrowLeft, Eye, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const TABS = [
    { key: 'devis', label: 'Devis' },
    { key: 'factures', label: 'Factures' },
    { key: 'clients', label: 'Clients' },
    { key: 'cashflow', label: 'Trésorerie' },
];

const DEVIS_STATUT_STYLE = {
    BROUILLON: 'bg-slate-100 text-slate-600',
    ENVOYE: 'bg-blue-50 text-blue-600',
    ACCEPTE: 'bg-emerald-50 text-emerald-600',
    REFUSE: 'bg-red-50 text-red-600',
    EXPIRE: 'bg-orange-50 text-orange-600',
    ARCHIVE: 'bg-slate-100 text-slate-500',
};

const FACTURE_STATUT_STYLE = {
    BROUILLON: 'bg-slate-100 text-slate-600',
    EN_ATTENTE: 'bg-orange-50 text-orange-600',
    PARTIELLEMENT_PAYEE: 'bg-orange-50 text-orange-600',
    PAYEE: 'bg-emerald-50 text-emerald-600',
    ENVOYE: 'bg-blue-50 text-blue-600',
    ARCHIVE: 'bg-slate-100 text-slate-500',
};

const TRANSACTION_TYPE_STYLE = {
    RECETTE: 'bg-emerald-50 text-emerald-600',
    DEPENSE: 'bg-red-50 text-red-600',
};

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const { userDetail, loading, error, refetch } = useAdminUserDetail(id);
    const [activeTab, setActiveTab] = useState('devis');

    const handleToggleActive = async () => {
        await adminApi.toggleUserActive(id);
        refetch();
    };

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!userDetail) return null;

    return (
        <div>
            <Link to="/admin/users" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
                <ArrowLeft size={16} /> Retour à la liste
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">{userDetail.nom} {userDetail.prenom}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userDetail.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {userDetail.is_active ? 'Compte actif' : 'Compte désactivé'}
                    </span>
                </div>
                <button
                    onClick={handleToggleActive}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        userDetail.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                >
                    {userDetail.is_active ? 'Désactiver le compte' : 'Activer le compte'}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-2 gap-5 mb-5">
                <Info label="Email" value={userDetail.email} />
                <Info label="Téléphone" value={userDetail.telephone} />
                <Info label="Statut fiscal" value={userDetail.statut_fiscal || '—'} />
                <Info label="Inscrit le" value={new Date(userDetail.created_at).toLocaleDateString('fr-FR')} />
            </div>

            <div className="grid grid-cols-3 gap-5 mb-5">
                <StatCard label="Devis" value={userDetail.nb_devis} />
                <StatCard label="Factures" value={userDetail.nb_factures} />
                <StatCard label="Clients" value={userDetail.nb_clients} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                <p className="text-sm text-slate-500 mb-1">Chiffre d'affaires généré</p>
                <p className="text-3xl font-bold text-slate-900">
                    {userDetail.ca_total ? Number(userDetail.ca_total).toLocaleString('fr-FR') : 0} DH
                </p>
            </div>

            {/* Onglets d'activité */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200 px-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === tab.key
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="p-2">
                    {activeTab === 'devis' && <DevisTab userId={id} />}
                    {activeTab === 'factures' && <FacturesTab userId={id} />}
                    {activeTab === 'clients' && <ClientsTab userId={id} />}
                    {activeTab === 'cashflow' && <CashflowTab userId={id} />}
                </div>
            </div>
        </div>
    );
}

function DevisTab({ userId }) {
    const { items, loading } = useAdminUserActivity(userId, 'devis');
    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;
    if (!items.length) return <EmptyState label="Aucun devis" />;

    return (
        <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
            <tr>
                <th className="px-4 py-3 text-left">N° Devis</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Validité</th>
                <th className="px-4 py-3 text-right">Montant TTC</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {items.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{d.numero}</td>
                    <td className="px-4 py-3 text-slate-600">{d.client_nom}</td>
                    <td className="px-4 py-3 text-slate-600">{d.date_validite}</td>
                    <td className="px-4 py-3 text-right font-medium">{Number(d.montant_total).toLocaleString('fr-FR')} DH</td>
                    <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DEVIS_STATUT_STYLE[d.statut] || 'bg-slate-100 text-slate-600'}`}>
                            {d.statut}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                        <Link
                            to={`/admin/devis/${d.id}`}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Eye size={14} /> Voir
                        </Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function FacturesTab({ userId }) {
    const { items, loading } = useAdminUserActivity(userId, 'factures');
    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;
    if (!items.length) return <EmptyState label="Aucune facture" />;

    return (
        <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
            <tr>
                <th className="px-4 py-3 text-left">N° Facture</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Échéance</th>
                <th className="px-4 py-3 text-right">Total TTC</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {items.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{f.numero}</td>
                    <td className="px-4 py-3 text-slate-600">{f.client_nom}</td>
                    <td className="px-4 py-3 text-slate-600">{f.date_echeance || '—'}</td>
                    <td className="px-4 py-3 text-right font-medium">{Number(f.montant_total).toLocaleString('fr-FR')} DH</td>
                    <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${FACTURE_STATUT_STYLE[f.statut] || 'bg-slate-100 text-slate-600'}`}>
                            {f.statut.replace('_', ' ')}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                        <Link
                            to={`/admin/factures/${f.id}`}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Eye size={14} /> Voir
                        </Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function ClientsTab({ userId }) {
    const { items, loading } = useAdminUserActivity(userId, 'clients');
    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;
    if (!items.length) return <EmptyState label="Aucun client" />;

    return (
        <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
            <tr>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Entreprise</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Téléphone</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {items.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.nom} {c.prenom}</td>
                    <td className="px-4 py-3 text-slate-600">{c.nom_entreprise || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{c.telephone || '—'}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function CashflowTab({ userId }) {
    const [dashboard, setDashboard] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const [dashboardData, transactionsData] = await Promise.all([
                    adminApi.getUserCashflowDashboard(userId),
                    adminApi.getUserTransactions(userId),
                ]);
                if (cancelled) return;
                setDashboard(dashboardData);
                // Supporte à la fois une réponse paginée ({results: [...]}) et une simple liste
                setTransactions(Array.isArray(transactionsData) ? transactionsData : (transactionsData.results || []));
            } catch {
                if (!cancelled) {
                    setDashboard(null);
                    setTransactions([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [userId]);

    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

    const recettes = Number(dashboard?.recettes_mois || 0);
    const depenses = Number(dashboard?.depenses_mois || 0);
    const solde = Number(dashboard?.solde || 0);

    return (
        <div className="p-2">
            <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <TrendingUp size={16} />
                        <span className="text-xs font-semibold uppercase">Recettes (mois)</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{recettes.toLocaleString('fr-FR')} DH</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                        <TrendingDown size={16} />
                        <span className="text-xs font-semibold uppercase">Dépenses (mois)</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{depenses.toLocaleString('fr-FR')} DH</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Wallet size={16} />
                        <span className="text-xs font-semibold uppercase">Solde (mois)</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{solde.toLocaleString('fr-FR')} DH</p>
                </div>
            </div>

            {!transactions.length ? (
                <EmptyState label="Aucune transaction" />
            ) : (
                <table className="w-full text-sm">
                    <thead className="text-slate-400 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3 text-left">Catégorie</th>
                        <th className="px-4 py-3 text-center">Type</th>
                        <th className="px-4 py-3 text-right">Montant</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">{tx.date}</td>
                            <td className="px-4 py-3 text-slate-900 font-medium">{tx.description}</td>
                            <td className="px-4 py-3 text-slate-600">{tx.categorie || '—'}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${TRANSACTION_TYPE_STYLE[tx.type] || 'bg-slate-100 text-slate-600'}`}>
                                    {tx.type}
                                </span>
                            </td>
                            <td className={`px-4 py-3 text-right font-semibold ${tx.type === 'RECETTE' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {tx.type === 'DEPENSE' ? '-' : '+'}{Number(tx.montant).toLocaleString('fr-FR')} DH
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function EmptyState({ label }) {
    return <p className="text-center text-slate-400 py-10 text-sm">{label}</p>;
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
    );
}