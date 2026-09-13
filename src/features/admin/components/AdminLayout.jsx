import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { LayoutGrid, Users, Bell, ChevronLeft, LogOut } from 'lucide-react';

const navItems = [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutGrid, end: true },
    { to: '/admin/users', label: 'Utilisateurs', icon: Users },
];

export default function AdminLayout() {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);

    return (
        <div className="min-h-screen w-full bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100">
                    <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <span className="font-bold text-slate-900 text-lg tracking-tight">TPE Manager</span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                            {user?.nom?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                {user?.nom} {user?.prenom}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(logout())}
                        className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <ChevronLeft size={18} className="text-slate-400" />
                        Espace Administrateur
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-slate-400 hover:text-slate-600">
                            <Bell size={20} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                            {user?.nom?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}