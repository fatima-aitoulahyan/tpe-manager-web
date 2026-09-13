import { useState } from 'react';
import * as notificationsApi from '../api/notificationsApi';

export function useNotifications() {
    const [loading, setLoading] = useState(false);

    const execute = async (apiFunc, ...args) => {
        setLoading(true);
        try {
            const res = await apiFunc(...args);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        fetchNotifications:    ()    => execute(notificationsApi.getNotifications),
        fetchUnreadCount:      ()    => execute(notificationsApi.getUnreadCount),
        markAsRead:            (id)  => execute(notificationsApi.markAsRead, id),
        markAllAsRead:         ()    => execute(notificationsApi.markAllAsRead),
        deleteNotifications:   (ids) => execute(notificationsApi.deleteNotifications, ids),
    };
}