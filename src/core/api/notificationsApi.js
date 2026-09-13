import api from './axiosConfig';

export const getNotifications    = ()         => api.get('/notifications/list/');
export const getUnreadCount      = ()         => api.get('/notifications/list/non_lues_count/');
export const markAsRead          = (id)       => api.post(`/notifications/list/${id}/marquer_lue/`);
export const markAllAsRead       = ()         => api.post('/notifications/list/marquer_toutes_lues/');
export const deleteNotifications = (ids)      => api.post('/notifications/list/supprimer_groupee/', { ids });