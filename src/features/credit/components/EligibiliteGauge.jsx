import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EligibiliteGauge({ score, niveau }) {
    const { t } = useTranslation();

    const NIVEAU_CONFIG = {
        VERT:   { color: '#22c55e', label: t('elig_vert', 'Éligible'),         bg: '#f0fdf4', border: '#bbf7d0' },
        ORANGE: { color: '#f97316', label: t('elig_orange', 'Partiellement éligible'), bg: '#fff7ed', border: '#fed7aa' },
        ROUGE:  { color: '#ef4444', label: t('elig_rouge', 'Non éligible'),     bg: '#fef2f2', border: '#fecaca' },
    };

    const config = NIVEAU_CONFIG[niveau] || NIVEAU_CONFIG.ROUGE;
    const angle = (score / 100) * 180; // 0 → 180deg
    const r = 70;
    const cx = 90, cy = 90;
    // Arc SVG
    const toRad = (deg) => (deg * Math.PI) / 180;
    const startX = cx + r * Math.cos(toRad(180));
    const startY = cy + r * Math.sin(toRad(180));
    const endX   = cx + r * Math.cos(toRad(180 - angle));
    const endY   = cy + r * Math.sin(toRad(180 - angle));
    const largeArc = angle > 180 ? 1 : 0;

    return (
        <div className="flex flex-col items-center gap-3">
            <svg width="180" height="100" viewBox="0 0 180 100">
                {/* Fond gris */}
                <path
                    d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                    fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round"
                />
                {/* Arc coloré */}
                {score > 0 && (
                    <path
                        d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
                        fill="none" stroke={config.color} strokeWidth="12" strokeLinecap="round"
                    />
                )}
                {/* Score */}
                <text x={cx} y={cy - 8} textAnchor="middle"
                      fontSize="26" fontWeight="700" fill="#1e293b">
                    {score}
                </text>
                <text x={cx} y={cy + 10} textAnchor="middle"
                      fontSize="11" fill="#94a3b8">
                    / 100
                </text>
            </svg>

            <span
                className="px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{ color: config.color, backgroundColor: config.bg, border: `1px solid ${config.border}` }}
            >
                {config.label}
            </span>
        </div>
    );
}