import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FactureFilters({ filters, onFilterChange }) {
    const { t } = useTranslation();

    const STATUTS = [
        { value: '', label: t('facture_status_all', 'Tous') },
        { value: 'BROUILLON', label: t('facture_status_draft', 'Brouillon') },
        { value: 'ENVOYE', label: t('facture_status_sent', 'Envoyée') },
        { value: 'PAYEE', label: t('facture_status_paid', 'Payée') },
        { value: 'PARTIELLEMENT_PAYEE', label: t('facture_status_partial', 'Part. payée') },
        { value: 'ARCHIVE', label: t('facture_status_archived', 'Archivée') },
    ];

    const hasActiveFilters = filters.statut || filters.dateDebut || filters.dateFin;

    const handleReset = () => {
        onFilterChange({ statut: '', dateDebut: '', dateFin: '' });
    };

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-wrap items-end gap-3">

                {/* Filtre Statut */}
                <div className="flex-1 min-w-[160px]">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        {t('facture_filter_status', 'Statut')}
                    </label>
                    <select
                        value={filters.statut}
                        onChange={e => onFilterChange({ statut: e.target.value })}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        {STATUTS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Date début */}
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        {t('facture_filter_from', 'Du')}
                    </label>
                    <input
                        type="date"
                        value={filters.dateDebut}
                        onChange={e => onFilterChange({ dateDebut: e.target.value })}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* Date fin */}
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        {t('facture_filter_to', 'Au')}
                    </label>
                    <input
                        type="date"
                        value={filters.dateFin}
                        onChange={e => onFilterChange({ dateFin: e.target.value })}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* Bouton reset — visible seulement si filtre actif */}
                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-500 border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 px-3 py-2.5 rounded-lg transition-colors"
                    >
                        <X size={13} /> {t('facture_filter_reset', 'Réinitialiser')}
                    </button>
                )}
            </div>
        </div>
    );
}