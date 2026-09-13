import React from 'react';
import { useTranslation } from 'react-i18next';

const colors = {
    'BROUILLON': 'bg-gray-100 text-gray-700',
    'ENVOYE': 'bg-blue-100 text-blue-700',
    'PAYEE': 'bg-green-100 text-green-700',
    'PARTIELLEMENT_PAYEE': 'bg-orange-100 text-orange-700',
    'ARCHIVE': 'bg-slate-100 text-slate-500'
};

export default function StatutFactureBadge({ statut }) {
    const { t } = useTranslation();

    const STATUT_LABELS = {
        'BROUILLON': t('facture_status_draft', 'Brouillon'),
        'ENVOYE': t('facture_status_sent', 'Envoyée'),
        'PAYEE': t('facture_status_paid', 'Payée'),
        'PARTIELLEMENT_PAYEE': t('facture_status_partial', 'Part. payée'),
        'ARCHIVE': t('facture_status_archived', 'Archivée'),
    };

    const label = STATUT_LABELS[statut] || statut;
    const styleClass = colors[statut] || 'bg-gray-100 text-gray-700';

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${styleClass}`}>
            {label}
        </span>
    );
}