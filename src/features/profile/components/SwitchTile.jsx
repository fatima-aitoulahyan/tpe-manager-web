import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SwitchTile({ icon, iconColor, iconBg, title, subtitle, checked, onChange }) {
    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    return (
        <div className="flex items-center gap-3 py-1">
            <div className="p-2 rounded-xl flex-shrink-0"
                 style={{ backgroundColor: iconBg, color: iconColor }}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                    checked ? 'bg-blue-600' : 'bg-slate-200'
                }`}
            >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isRtl
                        ? (checked ? '-translate-x-5' : '-translate-x-0.5')
                        : (checked ? 'translate-x-5' : 'translate-x-0.5')
                }`} />
            </button>
        </div>
    );
}