import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LoginForm({
                                      onSubmit,
                                      register,
                                      handleSubmit,
                                      errors,
                                      loading,
                                      error,
                                      showPass,
                                      setShowPass
                                  }) {
    const { t } = useTranslation()

    return (
        <div className="w-full max-w-md space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    {t('login_title', 'Bon retour')}
                </h2>
                <p className="text-slate-500 text-sm">
                    {t('login_subtitle', 'Renseignez vos identifiants pour accéder à votre tableau de bord.')}
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2 animate-shake">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                        {t('login_email_label', 'Adresse email')}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="email"
                            placeholder="nom@entreprise.ma"
                            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm bg-slate-50/50 outline-none transition-all duration-200
                            focus:bg-white focus:ring-4 focus:ring-indigo-50
                            focus:border-indigo-500 font-medium
                            ${errors.email ? 'border-red-400 focus:ring-red-50' : 'border-slate-200'}`}
                            {...register('email', {
                                required: t('login_email_required', 'Adresse email requise'),
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: t('login_email_invalid', 'Veuillez entrer un email valide'),
                                },
                            })}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            {t('login_password_label', 'Mot de passe')}
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                        >
                            {t('login_forgot_password', 'Mot de passe oublié ?')}
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="••••••••••••"
                            className={`w-full pl-12 pr-12 py-3 border rounded-xl text-sm bg-slate-50/50 outline-none transition-all duration-200
                            focus:bg-white focus:ring-4 focus:ring-indigo-50
                            focus:border-indigo-500 font-medium
                            ${errors.password ? 'border-red-400 focus:ring-red-50' : 'border-slate-200'}`}
                            {...register('password', {
                                required: t('login_password_required', 'Mot de passe requis'),
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 transition-all duration-200 hover:shadow-indigo-200 text-sm mt-4"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('login_btn_loading', 'Vérification en cours...')}
                        </span>
                    ) : t('login_btn_submit', 'Se connecter')}
                </button>
            </form>

            <p className="text-center text-slate-500 text-sm pt-4">
                {t('login_no_account', 'Pas encore de compte ?')}{' '}
                <Link
                    to="/register"
                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                >
                    {t('login_create_account', 'Créer un compte entreprise')}
                </Link>
            </p>
        </div>
    )
}