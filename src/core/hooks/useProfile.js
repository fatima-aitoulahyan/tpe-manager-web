import { useState } from 'react';
import * as profileApi from '../api/profileApi';

export function useProfile() {
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
        fetchProfile:       ()     => execute(profileApi.getProfile),
        updateProfile:      (data) => execute(profileApi.updateProfile, data),
        changePassword:     (data) => execute(profileApi.changePassword, data),
        logout:             (data) => execute(profileApi.logout, data),
        saveEmailConfig:    (data) => execute(profileApi.saveEmailConfig, data),
        fetchPreferences:   ()     => execute(profileApi.getPreferences),
        updatePreferences:  (data) => execute(profileApi.updatePreferences, data),
    };
}