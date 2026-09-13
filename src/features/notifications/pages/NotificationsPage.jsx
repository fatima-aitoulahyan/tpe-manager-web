import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../core/hooks/useNotifications';
import NotificationItem, { getTypeConfig } from '../components/NotificationItem';
import { BellOff, Trash2, CheckCheck, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { fetchNotifications, markAsRead, markAllAsRead, deleteNotifications, loading } = useNotifications();

    const [notifications, setNotifications] = useState([]);
    const [selectedIds, setSelectedIds]     = useState([]);
    const [detailModal, setDetailModal]     = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const selectionMode = selectedIds.length > 0;
    const unreadCount   = notifications.filter(n => !n.lu).length;


    const loadAll = useCallback(async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(Array.isArray(data) ? data : (data.results || []));
        } catch {
            toast.error(t('notifications_toast_error_load', "Erreur de chargement"));
        }
    }, [t]);

    useEffect(() => { loadAll(); }, [loadAll]);

    const toggleSelection = (id) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const cancelSelection = () => setSelectedIds([]);

    const handleTap = async (notification) => {
        if (selectionMode) { toggleSelection(notification.id); return; }
        if (!notification.lu) {
            await markAsRead(notification.id);
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, lu: true } : n));
        }
        if (notification.type === 'facture' && notification.reference_id)
            navigate(`/factures/${notification.reference_id}`);
        else if (notification.type === 'devis' && notification.reference_id)
            navigate(`/devis/${notification.reference_id}`);
        else if (notification.type === 'credit')
            navigate(notification.reference_id ? `/credit/${notification.reference_id}` : '/credit');
        else
            setDetailModal(notification);
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
            toast.success(t('notifications_toast_all_read', "Toutes les notifications marquées comme lues"));
        } catch { toast.error(t('notifications_toast_error', "Erreur")); }
    };

    const handleDelete = async () => {
        try {
            await deleteNotifications(selectedIds);
            setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
            toast.success(t('notifications_toast_deleted_success', "{{count}} notification(s) supprimée(s)", { count: selectedIds.length }));
            cancelSelection();
            setDeleteConfirm(false);
        } catch { toast.error(t('notifications_toast_delete_error', "Erreur lors de la suppression")); }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto p-1 relative">



            {/* ── Header style dashboard ── */}
            <div className="flex justify-between items-center pt-10 sm:pt-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('notifications_title', "Notifications")}</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {unreadCount > 0
                            ? t('notifications_unread_count', "{{count}} non lue(s)", { count: unreadCount })
                            : t('notifications_up_to_date', "Tout est à jour")}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {selectionMode ? (
                        <>
                            <button onClick={cancelSelection}
                                    className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                {t('notifications_btn_cancel', "Annuler")}
                            </button>
                            <button onClick={() => setDeleteConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition-colors">
                                <Trash2 size={15} />
                                {t('notifications_btn_delete', "Supprimer ({{count}})", { count: selectedIds.length })}
                            </button>
                        </>
                    ) : unreadCount > 0 ? (
                        <button onClick={handleMarkAllRead}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                            <CheckCheck size={15} />
                            {t('notifications_btn_mark_all', "Tout marquer lu ({{count}})", { count: unreadCount })}
                        </button>
                    ) : null}
                </div>
            </div>

            {/* ── Liste ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading && notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">{t('notifications_loading', "Chargement...")}</div>
                ) : notifications.length === 0 ? (
                    <EmptyState t={t} />
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((n) => (
                            <NotificationRow
                                key={n.id}
                                notification={n}
                                selected={selectedIds.includes(n.id)}
                                selectionMode={selectionMode}
                                onTap={() => handleTap(n)}
                                onLongPress={() => toggleSelection(n.id)}
                                t={t}
                                currentLang={i18n.language}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {detailModal && (
                <DetailModal notification={detailModal} onClose={() => setDetailModal(null)} t={t} />
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="font-bold text-slate-900 mb-2">{t('notifications_modal_delete_title', "Supprimer les notifications")}</h3>
                        <p className="text-sm text-slate-500 mb-5">
                            {t('notifications_modal_delete_desc', "Voulez-vous vraiment supprimer les {{count}} notifications sélectionnées ?", { count: selectedIds.length })}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(false)}
                                    className="flex-1 h-10 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                                {t('notifications_btn_cancel', "Annuler")}
                            </button>
                            <button onClick={handleDelete}
                                    className="flex-1 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold">
                                {t('notifications_btn_confirm_delete', "Supprimer")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function NotificationRow({ notification, selected, selectionMode, onTap, onLongPress, t, currentLang }) {
    const config = getTypeConfig(notification.type);

    return (
        <div
            onClick={onTap}
            onContextMenu={(e) => { e.preventDefault(); onLongPress?.(); }}
            className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ${
                selected
                    ? 'bg-blue-50'
                    : notification.lu
                        ? 'hover:bg-slate-50/80'
                        : 'bg-blue-50/20 hover:bg-blue-50/40'
            }`}
        >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ backgroundColor: config.bg, color: config.color }}>
                {config.icon}
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-sm ${notification.lu ? 'font-medium text-slate-700' : 'font-semibold text-slate-900'}`}>
                    {notification.titre}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{notification.corps}</p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-slate-400">{formatRelativeTime(notification.created_at, currentLang, t)}</span>
                {!notification.lu && !selectionMode && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                {/* Checkbox sélection */}
                {selectionMode && (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                    }`}>
                        {selected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyState({ t }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <BellOff size={28} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">{t('notifications_empty_title', "Aucune notification")}</p>
            <p className="text-slate-400 text-sm mt-1">
                {t('notifications_empty_subtitle', "Nous vous préviendrons dès qu'une action est requise.")}
            </p>
        </div>
    );
}

function DetailModal({ notification, onClose, t }) {
    const config = getTypeConfig(notification.type);
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: config.bg, color: config.color }}>
                        {config.icon}
                    </div>
                    <h3 className="font-bold text-slate-900">{notification.titre}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{notification.corps}</p>
                <button onClick={onClose}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                    {t('notifications_btn_close', "Fermer")}
                </button>
            </div>
        </div>
    );
}

function formatRelativeTime(dateStr, currentLang, t) {
    if (!dateStr) return '';
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return t('time_just_now', "À l'instant");
    if (mins < 60)  return t('time_mins_ago', "{{mins}} min", { mins });
    if (hours < 24) return t('time_hours_ago', "{{hours}}h", { hours });
    if (days < 7)   return t('time_days_ago', "{{days}}j", { days });
    return new Date(dateStr).toLocaleDateString(currentLang === 'ar' ? 'ar-MA' : 'fr-MA', { day: '2-digit', month: 'short' });
}