import React, { useState, useEffect } from 'react';
import { User, Briefcase, Badge, Mail, Phone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ClientForm({ initialData, onSubmit, onClose, loading }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        nom: '', prenom: '', nom_entreprise: '', ice: '', email: '', telephone: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nom: initialData.nom || '',
                prenom: initialData.prenom || '',
                nom_entreprise: initialData.nom_entreprise || '',
                ice: initialData.ice || '',
                email: initialData.email || '',
                telephone: initialData.telephone || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.nom.trim()) return;
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-bold text-slate-900">
                        {initialData ? t('client_modal_edit', 'Modifier le Client') : t('client_modal_new', 'Nouveau Client')}
                    </h2>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('client_last_name', 'Nom')} *</label>
                            <input
                                type="text"
                                name="nom"
                                required
                                value={formData.nom}
                                onChange={handleChange}
                                placeholder={t('client_last_name_placeholder', 'Benali')}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('client_first_name', 'Prénom')}</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                placeholder={t('client_first_name_placeholder', 'Hassan')}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{t('client_company', "Nom de l'entreprise (Optionnel)")}</label>
                        <div className="relative">
                            <Briefcase size={16} className="absolute ltr:left-3 rtl:right-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                name="nom_entreprise"
                                value={formData.nom_entreprise}
                                onChange={handleChange}
                                placeholder={t('client_company_placeholder', 'Ma Société')}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 ltr:pl-10 rtl:pr-10 focus:outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{t('client_ice', 'ICE (Optionnel)')}</label>
                        <div className="relative">
                            <Badge size={16} className="absolute ltr:left-3 rtl:right-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                name="ice"
                                value={formData.ice}
                                onChange={handleChange}
                                placeholder="001234567000"
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 ltr:pl-10 rtl:pr-10 focus:outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('client_email', 'Adresse email')}</label>
                            <div className="relative">
                                <Mail size={16} className="absolute ltr:left-3 rtl:right-3 top-3 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="client@email.com"
                                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 ltr:pl-10 rtl:pr-10 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('client_phone', 'Téléphone')}</label>
                            <div className="relative">
                                <Phone size={16} className="absolute ltr:left-3 rtl:right-3 top-3 text-slate-400" />
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="0612345678"
                                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 ltr:pl-10 rtl:pr-10 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors">
                            {t('client_btn_cancel', 'Annuler')}
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm disabled:opacity-50">
                            {loading ? t('client_btn_loading', 'Enregistrement...') : initialData ? t('client_btn_save', 'Sauvegarder') : t('client_btn_create', 'Créer le client')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}