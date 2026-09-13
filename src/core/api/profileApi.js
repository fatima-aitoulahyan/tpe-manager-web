import api from './axiosConfig';

export const getProfile       = ()       => api.get('/auth/profile/');
export const updateProfile    = (data)   => api.put('/auth/profile/', data);
export const changePassword   = (data)   => api.post('/auth/change-password/', data);
export const logout           = (data)   => api.post('/auth/logout/', data);
export const saveEmailConfig  = (data)   => api.patch('/auth/config-email/', data);
export const getPreferences   = ()       => api.get('/notifications/preferences/');
export const updatePreferences = (data)  => api.put('/notifications/preferences/', data);