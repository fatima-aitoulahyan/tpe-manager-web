import React, { useState } from "react";
import { X, ArrowDownCircle, ArrowUpCircle, ReceiptText, Wallet, PlusCircle, ShoppingBag, Home, User, Car, MoreHorizontal, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function TransactionForm({
                                            initialType = "RECETTE",
                                            factureId = null,
                                            defaultMontant = "",
                                            defaultDescription = "",
                                            onClose,
                                            onSubmit,
                                        }) {
    const { t } = useTranslation();
    const isFromFacture = Boolean(factureId);
    const [type, setType] = useState(isFromFacture ? "RECETTE" : initialType);
    const [categorie, setCategorie] = useState(isFromFacture ? "PAIEMENT_FACTURE" : null);
    const [montant, setMontant] = useState(defaultMontant);
    const [description, setDescription] = useState(defaultDescription);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [submitting, setSubmitting] = useState(false);

    const isRecette = type === "RECETTE";
    const activeColor = isRecette ? "emerald" : "red";

    const CATEGORIES_RECETTE = [
        { value: "PAIEMENT_FACTURE", label: t('tx_cat_payment', 'Paiement facture'), icon: ReceiptText },
        { value: "ACOMPTE", label: t('tx_cat_advance', 'Acompte'), icon: Wallet },
        { value: "AUTRE_RECETTE", label: t('tx_cat_other_income', 'Autre recette'), icon: PlusCircle },
    ];

    const CATEGORIES_DEPENSE = [
        { value: "ACHAT_MATERIEL", label: t('tx_cat_equipment', 'Achat matériel'), icon: ShoppingBag },
        { value: "LOYER", label: t('tx_cat_rent', 'Loyer'), icon: Home },
        { value: "SALAIRE", label: t('tx_cat_salary', 'Salaire'), icon: User },
        { value: "TRANSPORT", label: t('tx_cat_transport', 'Transport'), icon: Car },
        { value: "AUTRE_DEPENSE", label: t('tx_cat_other_expense', 'Autre dépense'), icon: MoreHorizontal },
    ];

    const categories = isRecette ? CATEGORIES_RECETTE : CATEGORIES_DEPENSE;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categorie) {
            toast.error(t('tx_err_category_required', 'Veuillez sélectionner une catégorie'));
            return;
        }
        const montantNum = parseFloat(montant);
        if (!montant || isNaN(montantNum) || montantNum <= 0) {
            toast.error(t('tx_err_invalid_amount', 'Montant invalide'));
            return;
        }
        if (!description.trim()) {
            toast.error(t('tx_err_desc_required', 'Description requise'));
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                type,
                montant: montantNum,
                description: description.trim(),
                categorie,
                date,
                ...(factureId ? { facture: factureId } : {}),
            });
            onClose();
        } catch (err) {
            toast.error(err.message || t('tx_err_save', "Erreur lors de l'enregistrement"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">
                            {isFromFacture ? t('tx_modal_title_invoice', 'Enregistrer un paiement') : t('tx_modal_title_new', 'Nouvelle transaction')}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isFromFacture ? t('tx_modal_sub_invoice', 'Paiement lié à la facture') : t('tx_modal_sub_new', 'Enregistrez un paiement ou une dépense')}
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {!isFromFacture && (
                        <div>
                            <label className="text-xs font-bold text-slate-600 mb-2 block">{t('tx_type_label', 'Type de transaction')}</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setType("RECETTE"); setCategorie(null); }}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold ${
                                        isRecette
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                                            : "bg-white border-slate-200 text-slate-500"
                                    }`}
                                >
                                    <ArrowDownCircle size={16} /> {t('tx_type_income', 'Paiement reçu')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setType("DEPENSE"); setCategorie(null); }}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold ${
                                        !isRecette
                                            ? "bg-red-50 border-red-500 text-red-600"
                                            : "bg-white border-slate-200 text-slate-500"
                                    }`}
                                >
                                    <ArrowUpCircle size={16} /> {t('tx_type_expense', 'Dépense')}
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-2 block">{t('tx_category_label', 'Catégorie')}</label>
                        {isFromFacture ? (
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-600 text-sm font-bold">
                                <ReceiptText size={16} /> {t('tx_cat_payment', 'Paiement facture')}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {categories.map(({ value, label, icon: Icon }) => {
                                    const selected = categorie === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setCategorie(value)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                                                selected
                                                    ? `bg-${activeColor}-50 border-${activeColor}-500 text-${activeColor}-600`
                                                    : "bg-white border-slate-200 text-slate-600"
                                            }`}
                                        >
                                            <Icon size={14} />
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-2 block">{t('tx_amount_label', 'Montant (MAD)')}</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={montant}
                            onChange={(e) => setMontant(e.target.value)}
                            placeholder="Ex : 1500.00"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-2 block">{t('tx_desc_label', 'Description')}</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isRecette ? t('tx_desc_placeholder_income', 'Ex : Paiement facture FAC-2026-001') : t('tx_desc_placeholder_expense', 'Ex : Achat fournitures bureau')}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-2 block">{t('tx_date_label', 'Date de transaction')}</label>
                        <div className="relative">
                            <Calendar size={16} className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-blue-600" />
                            <input
                                type="date"
                                value={date}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full ltr:pl-11 rtl:pr-11 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60 ${
                            isRecette ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        {isRecette ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                        {isRecette ? t('tx_submit_income', 'Enregistrer le paiement') : t('tx_submit_expense', 'Enregistrer la dépense')}
                    </button>
                </div>
            </form>
        </div>
    );
}