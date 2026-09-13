import React from "react";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TransactionTable({
                                             transactions,
                                             selectedIds,
                                             onToggleSelect,
                                             onDelete,
                                         }) {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';

    if (!transactions.length) {
        return (
            <div className="text-center py-16 text-slate-400 text-sm font-medium">
                {t('tx_table_empty', 'Aucune transaction')}
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                    <th className="w-10 p-3"></th>
                    <th className="text-start p-3">{t('tx_table_desc', 'Description')}</th>
                    <th className="text-start p-3">{t('tx_table_cat', 'Catégorie')}</th>
                    <th className="text-start p-3">{t('tx_table_date', 'Date')}</th>
                    <th className="text-end p-3">{t('tx_table_amount', 'Montant')}</th>
                    <th className="w-12 p-3"></th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((tItem) => {
                    const isRecette = tItem.type === "RECETTE";
                    const selected = selectedIds.includes(tItem.id);
                    const formattedMontant = Number(tItem.montant || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                    return (
                        <tr
                            key={tItem.id}
                            className={`border-t border-slate-100 transition-colors ${
                                selected ? "bg-blue-50" : "hover:bg-slate-50"
                            }`}
                        >
                            <td className="p-3">

                            </td>
                            <td className="p-3">
                                <div className="flex items-center gap-2">
                                    {isRecette ? (
                                        <ArrowDownCircle size={16} className="text-emerald-500" />
                                    ) : (
                                        <ArrowUpCircle size={16} className="text-red-500" />
                                    )}
                                    <span className="font-medium text-slate-800">{tItem.description}</span>
                                </div>
                            </td>
                            <td className="p-3 text-slate-500">{tItem.categorie_display || tItem.categorie}</td>
                            <td className="p-3 text-slate-500">{tItem.date}</td>
                            <td className={`p-3 text-end font-bold ${isRecette ? "text-emerald-600" : "text-red-600"}`}>
                                {isRecette ? "+" : "-"}{formattedMontant} {currency}
                            </td>
                            <td className="p-3 text-end">
                                <button
                                    onClick={() => onDelete(tItem.id)}
                                    className="text-slate-400 hover:text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}