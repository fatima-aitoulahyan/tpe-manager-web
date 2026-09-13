import React from 'react';
import { User, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ClientSelector({ clients, selectedClientId, onSelectClient, onOpenCreateModal }) {
    const { t } = useTranslation();

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-600">
                    {t('client_selector_label', 'Sélectionner le Client *')}
                </label>
                <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                    <Plus size={14} /> {t('client_selector_new', 'Nouveau Client')}
                </button>
            </div>

            <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <select
                    value={selectedClientId || ""}
                    onChange={(e) => onSelectClient(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl p-2.5 pl-10 focus:outline-none focus:border-blue-600 shadow-sm appearance-none cursor-pointer text-slate-700"
                    required
                >
                    <option value="" disabled>-- {t('client_selector_choose', 'Choisir un client existant')} --</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.nom} {client.prenom} {client.nom_entreprise ? `(${client.nom_entreprise})` : ''}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}