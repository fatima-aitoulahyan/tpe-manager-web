import React from 'react';
import { FileText, Receipt, CreditCard, Bell, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TYPE_CONFIG = {
    facture: { icon: <Receipt size={16} />,     color: '#ef4444', bg: '#fef2f2' },
    devis:   { icon: <FileText size={16} />,    color: '#f59e0b', bg: '#fffbeb' },
    credit:  { icon: <CreditCard size={16} />,  color: '#2563eb', bg: '#eff6ff' },
    fiscal:  { icon: <ShieldCheck size={16} />, color: '#2563eb', bg: '#eff6ff' },
    fiscale: { icon: <ShieldCheck size={16} />, color: '#2563eb', bg: '#eff6ff' },
    cnss:    { icon: <ShieldCheck size={16} />, color: '#10b981', bg: '#f0fdf4' },
};

const DEFAULT_TYPE = { icon: <Bell size={16} />, color: '#64748b', bg: '#f1f5f9' };

export function getTypeConfig(type) {
    return TYPE_CONFIG[type] || DEFAULT_TYPE;
}

export default function NotificationItem({ notification, selected, selectionMode, onTap, onLongPress }) {
    const { t, i18n } = useTranslation();
    const config = getTypeConfig(notification.type);

    function formatRelativeTime(dateStr) {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days  = Math.floor(diff / 86400000);
        if (mins < 1)   return t('time_just_now', "À l'instant");
        if (mins < 60)  return t('time_mins', `${mins} min`, { count: mins });
        if (hours < 24) return t('time_hours', `${hours}h`, { count: hours });
        if (days < 7)   return t('time_days', `${days}j`, { count: days });
        const locale = i18n.language === 'ar' ? 'ar-MA' : 'fr-MA';
        return new Date(dateStr).toLocaleDateString(locale, { day: '2-digit', month: 'short' });
    }

    return (
        <div
            onClick={onTap}
            onContextMenu={(e) => { e.preventDefault(); onLongPress?.(); }}
            className={`flex items-start gap-3 p-4 mx-3 mb-2 rounded-2xl border cursor-pointer transition-all select-none ${
                selected
                    ? 'border-blue-300 bg-blue-50/60'
                    : notification.lu
                        ? 'border-slate-100 bg-white hover:bg-slate-50'
                        : 'border-blue-100 bg-blue-50/30 hover:bg-blue-50/60'
            }`}
        >
            {/* Icône type */}
            <div className="p-2 rounded-full flex-shrink-0"
                 style={{ backgroundColor: config.bg, color: config.color }}>
                {config.icon}
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${notification.lu ? 'font-medium text-slate-700' : 'font-semibold text-slate-900'}`}>
                        {notification.titre}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!notification.lu && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                            {formatRelativeTime(notification.created_at)}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {notification.corps}
                </p>
            </div>

            {/* Checkbox en mode sélection */}
            {selectionMode && (
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                }`}>
                    {selected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </div>
            )}
        </div>
    );
}