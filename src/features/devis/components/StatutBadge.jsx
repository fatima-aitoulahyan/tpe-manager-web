import React from 'react';
import { useTranslation } from 'react-i18next';

const config = {
    'BROUILLON': 'bg-slate-100 text-slate-700 border-slate-200',
    'ENVOYE': 'bg-amber-50 text-amber-700 border-amber-200',
    'ACCEPTE': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'REFUSE': 'bg-rose-50 text-rose-700 border-rose-200',
    'ARCHIVE': 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function StatutBadge({ statut }) {
    const { t } = useTranslation();

    const STATUT_LABELS = {
        'BROUILLON': t('devis_status_draft', 'Brouillon'),
        'ENVOYE': t('devis_status_sent', 'Envoyé'),
        'ACCEPTE': t('devis_status_accepted', 'Accepté'),
        'REFUSE': t('devis_status_refused', 'Refusé'),
        'ARCHIVE': t('devis_status_archived', 'Archivé'),
    };

    const label = STATUT_LABELS[statut] || statut;
    const styleClass = config[statut] || config['BROUILLON'];

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styleClass}`}>
            {label}
        </span>
    );
}