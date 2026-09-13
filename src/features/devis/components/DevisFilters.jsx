import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DevisFilters({ filters, onFilterChange }) {
    const { t } = useTranslation();

    const handleChange = (e) => {
        onFilterChange({ [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t('devis_filter_status', 'Statut')}
                </label>
                <select
                    name="statut"
                    value={filters.statut || ''}
                    onChange={handleChange}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                >
                    <option value="">{t('devis_status_all', 'Tous les statuts')}</option>
                    <option value="BROUILLON">{t('devis_status_draft', 'Brouillon')}</option>
                    <option value="ENVOYE">{t('devis_status_sent', 'Envoyé')}</option>
                    <option value="ACCEPTE">{t('devis_status_accepted', 'Accepté')}</option>
                    <option value="REFUSE">{t('devis_status_refused', 'Refusé')}</option>
                    <option value="ARCHIVE">{t('devis_status_archived', 'Archivé')}</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t('devis_filter_start_date', 'Date début')}
                </label>
                <input
                    type="date"
                    name="dateDebut"
                    value={filters.dateDebut || ''}
                    onChange={handleChange}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t('devis_filter_end_date', 'Date fin')}
                </label>
                <input
                    type="date"
                    name="dateFin"
                    value={filters.dateFin || ''}
                    onChange={handleChange}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
            </div>
        </div>
    );
}