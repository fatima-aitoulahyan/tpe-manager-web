import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/slices/authSlice'
import {
    LayoutDashboard, FileText, Receipt,
    Wallet, CreditCard, Users,
    Bell, User, LogOut, ChevronLeft, ChevronRight,
    Globe
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

export default function Sidebar() {
    const { t, i18n } = useTranslation()
    const dispatch  = useDispatch()
    const navigate  = useNavigate()
    const { user }  = useSelector((s) => s.auth)
    const [collapsed, setCollapsed] = useState(false)

    const isRtl = i18n.dir() === 'rtl'

    const navItems = [
        { to: '/dashboard',     label: t('nav_dashboard', 'Tableau de bord'), icon: LayoutDashboard },
        { to: '/devis',         label: t('nav_devis', 'Devis'),            icon: FileText },
        { to: '/factures',      label: t('nav_factures', 'Factures'),         icon: Receipt },
        { to: '/cashflow',      label: t('nav_cashflow', 'Trésorerie'),       icon: Wallet },
        { to: '/credit',        label: t('nav_credit', 'Financement'),      icon: CreditCard },
        { to: '/clients',       label: t('nav_clients', 'Clients'),          icon: Users },
        { to: '/notifications', label: t('nav_notifications', 'Notifications'),    icon: Bell },
    ]

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'ar' ? 'fr' : 'ar'
        i18n.changeLanguage(nextLang)
        document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr'
        toast.success(nextLang === 'ar' ? 'تم التغيير إلى العربية' : 'Passé en Français')
    }

    // Gère dynamiquement le sens des flèches de repli selon LTR ou RTL
    const renderCollapseIcon = () => {
        if (collapsed) {
            return isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />
        }
        return isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />
    }

    return (
        <aside className={`relative bg-white border-slate-100
                      flex flex-col shadow-sm shrink-0 transition-all duration-300
                      ${collapsed ? 'w-20' : 'w-64'}
                      ${isRtl ? 'border-l' : 'border-r'}`}>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`absolute top-6 w-6 h-6 bg-white border border-slate-200
                   rounded-full flex items-center justify-center shadow-sm
                   text-slate-500 hover:text-blue-600 hover:border-blue-200
                   transition-colors z-10 ${
                    isRtl ? '-left-3' : '-right-3'
                }`}
            >
                {renderCollapseIcon()}
            </button>

            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg
                          flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">T</span>
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-slate-800 text-lg whitespace-nowrap">
                            TPE Manager
                        </span>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg
               text-sm font-medium transition-colors
               ${collapsed ? 'justify-center' : ''}
               ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && label}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-100 p-3 space-y-1">
                {/* Sélecteur de langue rapide */}
                <button
                    onClick={toggleLanguage}
                    title={collapsed ? (i18n.language === 'ar' ? 'Passer en Français' : 'التحويل إلى العربية') : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5
                     rounded-lg text-sm font-medium text-slate-600
                     hover:bg-slate-50 hover:text-slate-900 transition-colors
                     ${collapsed ? 'justify-center' : ''}`}
                >
                    <Globe size={18} className="shrink-0 text-slate-400" />
                    {!collapsed && (
                        <div className="flex items-center justify-between flex-1">
                            <span>{t('sidebar_lang_label', 'Langue')}</span>
                            <span className="text-xs font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {i18n.language === 'ar' ? 'العربية' : 'Français'}
                            </span>
                        </div>
                    )}
                </button>

                <NavLink
                    to="/profile"
                    title={collapsed ? `${user?.prenom} ${user?.nom}` : undefined}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg
             text-sm font-medium transition-colors
             ${collapsed ? 'justify-center' : ''}
             ${isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`
                    }
                >
                    <User size={18} className="shrink-0" />
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                                {user?.prenom} {user?.nom}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {user?.email}
                            </p>
                        </div>
                    )}
                </NavLink>

                <button
                    onClick={handleLogout}
                    title={collapsed ? t('sidebar_logout', 'Déconnexion') : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5
                     rounded-lg text-sm font-medium text-red-500
                     hover:bg-red-50 transition-colors
                     ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && t('sidebar_logout', 'Déconnexion')}
                </button>
            </div>
        </aside>
    )
}