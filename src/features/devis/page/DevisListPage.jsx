import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevis } from '../../../core/hooks/useDevis';
import DevisFilters from '../components/DevisFilters';
import StatutBadge from '../components/StatutBadge';
import { Plus, Eye, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DevisListPage() {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';
    const navigate = useNavigate();
    const { loading, fetchDevis } = useDevis();
    const [data, setData] = useState({ devis: [], count: 0, hasNext: false });
    const [filters, setFilters] = useState({ statut: '', dateDebut: '', dateFin: '', page: 1 });

    const loadData = async () => {
        const res = await fetchDevis(filters);
        setData(res);
    };

    useEffect(() => { loadData(); }, [filters]);

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-1 relative">
            <div className="flex justify-between items-center pt-10 sm:pt-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('devis_list_title', "Gestion des devis")}</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{t('devis_list_subtitle', "Consultez et suivez l'ensemble de vos offres commerciales.")}</p>
                </div>
                <button onClick={() => navigate('/devis/new')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
                    <Plus size={16} /> {t('devis_list_btn_new', "Nouveau Devis")}
                </button>
            </div>

            <DevisFilters filters={filters} onFilterChange={updateFilters} />

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="p-4">{t('devis_list_th_numero', "N° Devis")}</th>
                            <th className="p-4">{t('devis_list_th_client', "Client")}</th>
                            <th className="p-4">{t('devis_list_th_validite', "Date Validité")}</th>
                            <th className="p-4">{t('devis_list_th_montant', "Montant TTC")}</th>
                            <th className="p-4">{t('devis_list_th_statut', "Statut")}</th>
                            <th className="p-4 text-right">{t('devis_list_th_actions', "Actions")}</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-8 text-slate-400">{t('devis_list_loading', "Chargement...")}</td></tr>
                        ) : data.devis.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-8 text-slate-400">{t('devis_list_empty', "Aucun devis trouvé.")}</td></tr>
                        ) : data.devis.map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-4 font-bold text-slate-900">{d.numero}</td>
                                <td className="p-4">{d.client_nom || t('devis_list_external_client', "Client Externe")}</td>
                                <td className="p-4">{d.date_validite}</td>
                                <td className="p-4 font-semibold">
                                    {Number(d.montant_ttc || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                                </td>
                                <td className="p-4"><StatutBadge statut={d.statut} /></td>
                                <td className="p-4 text-right">
                                    <button onClick={() => navigate(`/devis/${d.id}`)} className="text-slate-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 inline-flex items-center gap-1.5 transition-colors">
                                        <Eye size={16} /> {t('devis_list_action_view', "Voir")}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{t('devis_list_total_count', "Total : {{count}} devis", { count: data.count })}</span>
                    <div className="flex items-center gap-2">
                        <button disabled={filters.page === 1} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} className="p-2 border bg-white rounded-lg disabled:opacity-40">
                            <ChevronLeft size={14} />
                        </button>
                        <span className="font-medium text-slate-700">{t('devis_list_page_num', "Page {{page}}", { page: filters.page })}</span>
                        <button disabled={!data.hasNext} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} className="p-2 border bg-white rounded-lg disabled:opacity-40">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}