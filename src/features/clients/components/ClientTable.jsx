import React from 'react';
import { Edit2, Trash2, Phone, Mail, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ClientTable({ clients, onEdit, onDelete }) {
    const { t } = useTranslation();

    const getInitials = (nom, prenom) => {
        return `${nom ? nom[0] : '?'}${prenom ? prenom[0] : ''}`.toUpperCase();
    };

    if (clients.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                <p className="font-medium">{t('client_table_empty', 'Aucun client trouvé')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('client_table_empty_sub', "Essayez d'ajuster votre recherche ou ajoutez un nouveau profil.")}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 text-start">{t('client_th_client', 'Client')}</th>
                        <th className="p-4 text-start">{t('client_th_company', 'Entreprise / ICE')}</th>
                        <th className="p-4 text-start">{t('client_th_contact', 'Contact')}</th>
                        <th className="p-4 text-end">{t('client_th_actions', 'Actions')}</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
                    {clients.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-100">
                                    {getInitials(c.nom, c.prenom)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{c.nom} {c.prenom}</p>
                                </div>
                            </td>
                            <td className="p-4">
                                {c.nom_entreprise ? (
                                    <div>
                                        <p className="font-medium text-slate-800 flex items-center gap-1.5">
                                            <Briefcase size={14} className="text-slate-400" /> {c.nom_entreprise}
                                        </p>
                                        {c.ice && <p className="text-xs text-slate-400 mt-0.5">ICE: {c.ice}</p>}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">{t('client_individual', 'Particulier')}</span>
                                )}
                            </td>
                            <td className="p-4 space-y-1">
                                {c.email && (
                                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                        <Mail size={13} className="text-slate-400" /> {c.email}
                                    </p>
                                )}
                                {c.telephone && (
                                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                        <Phone size={13} className="text-slate-400" /> {c.telephone}
                                    </p>
                                )}
                            </td>
                            <td className="p-4 text-end">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => onEdit(c)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                                        <Edit2 size={15} />
                                    </button>
                                    <button onClick={() => onDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}