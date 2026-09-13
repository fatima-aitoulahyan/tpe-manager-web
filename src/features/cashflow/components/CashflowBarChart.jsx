import React from "react";
import { useTranslation } from "react-i18next";

export default function CashflowBarChart({ recettes = 0, depenses = 0 }) {
    const { t } = useTranslation();
    const max = Math.max(recettes, depenses, 1);
    const recettePct = (recettes / max) * 100;
    const depensePct = (depenses / max) * 100;

    return (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600">{t('chart_recettes', 'Recettes')}</span>
                    <span className="text-slate-700">{recettes.toFixed(2)} MAD</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${recettePct}%` }}
                    />
                </div>
            </div>
            <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-red-600">{t('chart_depenses', 'Dépenses')}</span>
                    <span className="text-slate-700">{depenses.toFixed(2)} MAD</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-red-500 rounded-full transition-all"
                        style={{ width: `${depensePct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}