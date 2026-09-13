import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LigneDevisForm({ onAdd }) {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';

    const [libelle, setLibelle] = useState('');
    const [prix, setPrix] = useState('');
    const [qte, setQte] = useState('1');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!libelle || !prix) return;
        onAdd({
            libelle,
            prix_unitaire: parseFloat(prix),
            quantite: parseFloat(qte)
        });
        setLibelle('');
        setPrix('');
        setQte('1');
    };

    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-6">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t('ligne_devis_label', 'Prestation / Produit')}
                </label>
                <input
                    type="text"
                    value={libelle}
                    onChange={e => setLibelle(e.target.value)}
                    placeholder={t('ligne_devis_placeholder', 'Désignation')}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2 focus:outline-none"
                />
            </div>
            <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t('ligne_devis_price', `Prix Unitaire (${currency})`)}
                </label>
                <input
                    type="number"
                    value={prix}
                    onChange={e => setPrix(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2 focus:outline-none"
                />
            </div>
            <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t('ligne_devis_qty', 'Quantité')}
                </label>
                <input
                    type="number"
                    value={qte}
                    onChange={e => setQte(e.target.value)}
                    min="1"
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2 focus:outline-none"
                />
            </div>
            <div className="sm:col-span-1">
                <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}