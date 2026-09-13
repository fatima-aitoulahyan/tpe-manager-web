import React from "react";
import { useTranslation } from "react-i18next";

export default function CashflowPieChart({ recettes = 0, depenses = 0 }) {
    const { t } = useTranslation();
    const total = recettes + depenses;
    const recettePct = total > 0 ? (recettes / total) * 100 : 0;
    const circumference = 2 * Math.PI * 45;
    const recetteLength = (recettePct / 100) * circumference;

    return (
        <div className="flex items-center gap-6">
            <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="45" fill="none" stroke="#FEE2E2" strokeWidth="14" />
                <circle
                    cx="55"
                    cy="55"
                    r="45"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="14"
                    strokeDasharray={`${recetteLength} ${circumference}`}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                />
            </svg>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-600">
                        {t('chart_recettes', 'Recettes')} ({recettePct.toFixed(0)}%)
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-red-200" />
                    <span className="text-slate-600">
                        {t('chart_depenses', 'Dépenses')} ({(100 - recettePct).toFixed(0)}%)
                    </span>
                </div>
            </div>
        </div>
    );
}