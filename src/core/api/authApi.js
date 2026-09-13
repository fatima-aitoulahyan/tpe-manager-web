import api from './axiosConfig';

export const authApi = {
    login: async (credentials) => {
        const response = await api.post('/auth/login/', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        return response.data;
    },

    logout: async (refreshToken) => {
        const response = await api.post('/auth/logout/', { refresh: refreshToken });
        return response.data;
    },
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password/', { email });
        return response.data;
    },

    verifyResetCode: async (email, code) => {
        const response = await api.post('/auth/verify-reset-code/', { email, code });
        return response.data;
    },

    resetPassword: async (email, code, newPassword) => {
        const response = await api.post('/auth/reset-password/', {
            email,
            code,
            new_password: newPassword,
        });
        return response.data;
    },
};