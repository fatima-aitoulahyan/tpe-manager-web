import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PasswordModal({ onConfirm, onClose, loading }) {
    const { t } = useTranslation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOld, setShowOld]         = useState(false);
    const [showNew, setShowNew]         = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword) return;
        onConfirm(oldPassword, newPassword);
    };

    const fields = [
        { label: t('pwd_modal_current', 'Mot de passe actuel'), value: oldPassword, set: setOldPassword, show: showOld, toggle: () => setShowOld(p => !p) },
        { label: t('pwd_modal_new', 'Nouveau mot de passe'), value: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(p => !p) },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-900">{t('pwd_modal_title', 'Changer le mot de passe')}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                        <X size={16} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {fields.map(({ label, value, set, show, toggle }) => (
                        <div key={label}>
                            <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                            <div className="relative">
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={value}
                                    onChange={e => set(e.target.value)}
                                    required
                                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 ltr:pr-10 rtl:pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <button type="button" onClick={toggle}
                                        className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                                className="flex-1 h-10 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                            {t('pwd_btn_cancel', 'Annuler')}
                        </button>
                        <button type="submit" disabled={loading}
                                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                            {loading ? t('pwd_btn_loading', 'Modification...') : t('pwd_btn_confirm', 'Confirmer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}