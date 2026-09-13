import React from 'react';
import { RefreshCw, TrendingUp, FileText, Trash2, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SUPPRESSIBLES = ['SOUMISE', 'DOSSIER_INCOMPLET', 'DEFAVORABLE'];

export default function DemandeCard({ demande, currency: propCurrency, onView, onDelete }) {
    const { t, i18n } = useTranslation();
    const currency = propCurrency || (i18n.language === 'ar' ? 'د.م.' : 'DH');

    const TYPE_CONFIG = {
        FONCTIONNEMENT: { icon: <RefreshCw size={15} />,  label: t('demande_type_fonctionnement', 'Fonctionnement'),   color: '#2563eb', bg: '#eff6ff' },
        INVESTISSEMENT: { icon: <TrendingUp size={15} />, label: t('demande_type_investissement', 'Investissement'),    color: '#7c3aed', bg: '#f5f3ff' },
        AVANCE_FACTURE: { icon: <FileText size={15} />,   label: t('demande_type_avance', 'Avance sur facture'), color: '#0891b2', bg: '#ecfeff' },
    };

    const STATUT_CONFIG = {
        SOUMISE:           { label: t('demande_statut_soumise', 'Soumise'),            color: '#2563eb', bg: '#eff6ff' },
        DOSSIER_INCOMPLET: { label: t('demande_statut_incomplet', 'Dossier incomplet'),  color: '#f97316', bg: '#fff7ed' },
        EN_ETUDE:          { label: t('demande_statut_etude', 'En étude'),           color: '#7c3aed', bg: '#f5f3ff' },
        FAVORABLE:         { label: t('demande_statut_favorable', 'Favorable'),          color: '#22c55e', bg: '#f0fdf4' },
        DEFAVORABLE:       { label: t('demande_statut_defavorable', 'Défavorable'),        color: '#ef4444', bg: '#fef2f2' },
        ACCEPTEE:          { label: t('demande_statut_acceptee', 'Acceptée'),           color: '#22c55e', bg: '#f0fdf4' },
        REFUSEE:           { label: t('demande_statut_refusee', 'Refusée'),            color: '#ef4444', bg: '#fef2f2' },
    };

    const type =
        TYPE_CONFIG[demande.type_financement_display] || {
            icon: <FileText size={15} />,
            label: demande.type_financement_display || t('demande_type_unknown', "Inconnu"),
            color: '#64748b',
            bg: '#f1f5f9'
        };

    const statut = STATUT_CONFIG[demande.statut] || { label: demande.statut, color: '#64748b', bg: '#f1f5f9' };
    const peutSupprimer = SUPPRESSIBLES.includes(demande.statut);

    const formattedMontant = Number(demande.montant_demande || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
                {/* Icône type */}
                <div className="p-2.5 rounded-xl flex-shrink-0"
                     style={{ backgroundColor: type.bg, color: type.color }}>
                    {type.icon}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                        {type.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {formattedMontant} {currency}
                        · {demande.duree_mois} {t('demande_months', 'mois')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ color: statut.color, backgroundColor: statut.bg }}>
                    {statut.label}
                </span>
                <button onClick={onView}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors">
                    <Eye size={15} />
                </button>
                {peutSupprimer && (
                    <button onClick={onDelete}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                        <Trash2 size={15} />
                    </button>
                )}
            </div>
        </div>
    );
}