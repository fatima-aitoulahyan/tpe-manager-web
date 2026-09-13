import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../core/hooks/useNotifications';
import { useSelector } from 'react-redux';
import { Bell, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { fetchUnreadCount } = useNotifications();
    const user = useSelector(state => state.auth.user);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchUnreadCount()
            .then(data => setUnreadCount(data.count ?? 0))
            .catch(() => {});
    }, []);

    return (
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-600">
                {t('header_space_title', "Espace TPE Manager")}
            </div>

            <div className="flex items-center gap-3">
                {/* Bouton notifications */}
                <button
                    onClick={() => navigate('/notifications')}
                    className="relative p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                    title={t('header_notifications_tooltip', "Notifications")}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Avatar utilisateur */}
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 pl-3 border-l border-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                    title={t('header_profile_tooltip', "Profil")}
                >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={15} className="text-blue-600" />
                    </div>
                    {user?.first_name && (
                        <span className="text-sm font-medium hidden sm:block">
                            {user.first_name}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;