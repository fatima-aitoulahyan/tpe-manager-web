import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function RegisterForm({
                                         onSubmit,
                                         register,
                                         handleSubmit,
                                         errors,
                                         loading,
                                         error,
                                         password,
                                         showPass,
                                         setShowPass,
                                         showConfirm,
                                         setShowConfirm
                                     }) {
    const { t } = useTranslation()

    const STATUTS = [
        { value: 'auto_entrepreneur', label: t('reg_status_auto', 'Auto-entrepreneur') },
        { value: 'tpe',               label: t('reg_status_tpe', 'TPE') },
        { value: 'artisan',           label: t('reg_status_artisan', 'Artisan') },
        { value: 'freelance',         label: t('reg_status_freelance', 'Freelance') },
        { value: 'commercant',        label: t('reg_status_commercant', 'Commerçant') },
    ]

    return (
        <div className="w-full max-w-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {t('reg_title', 'Créer votre compte')}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
                {t('reg_subtitle', 'Commencez à gérer votre activité dès maintenant')}
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('reg_nom', 'Nom')}</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                            <input
                                placeholder={t('reg_nom_placeholder', 'Benali')}
                                className={_inputClass(errors.nom)}
                                {...register('nom', { required: t('reg_err_required', 'Requis') })}
                            />
                        </div>
                        {errors.nom && <_Error msg={errors.nom.message} />}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('reg_prenom', 'Prénom')}</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                            <input
                                placeholder={t('reg_prenom_placeholder', 'Hassan')}
                                className={_inputClass(errors.prenom)}
                                {...register('prenom', { required: t('reg_err_required', 'Requis') })}
                            />
                        </div>
                        {errors.prenom && <_Error msg={errors.prenom.message} />}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('reg_email', 'Adresse email')}</label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                        <input
                            type="email"
                            placeholder="vous@exemple.com"
                            className={_inputClass(errors.email)}
                            {...register('email', {
                                required: t('reg_err_required', 'Requis'),
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: t('reg_err_email_invalid', 'Email invalide'),
                                },
                            })}
                        />
                    </div>
                    {errors.email && <_Error msg={errors.email.message} />}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('reg_phone', 'Téléphone')}</label>
                    <div className="relative flex items-center">
                        <Phone className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                        <input
                            type="tel"
                            placeholder="0612345678"
                            className={_inputClass(errors.telephone)}
                            {...register('telephone', { required: t('reg_err_required', 'Requis') })}
                        />
                    </div>
                    {errors.telephone && <_Error msg={errors.telephone.message} />}
                </div>

                {/* Entreprise + Statut */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            {t('reg_company', 'Entreprise')} <span className="text-slate-400">({t('reg_optional', 'optionnel')})</span>
                        </label>
                        <div className="relative flex items-center">
                            <Building2 className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                            <input
                                placeholder={t('reg_company_placeholder', 'Mon entreprise')}
                                className={_inputClass()}
                                {...register('nom_entreprise')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('reg_status_fiscal', 'Statut fiscal')}</label>
                        <select
                            className={_inputClass(errors.statut_fiscal) + ' bg-white'}
                            {...register('statut_fiscal')}
                        >
                            <option value="">{t('reg_status_select', 'Sélectionner...')}</option>
                            {STATUTS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('reg_password', 'Mot de passe')}</label>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder={t('reg_pwd_placeholder', 'Minimum 8 caractères')}
                            className={`${_inputClass(errors.password)} pr-10`}
                            {...register('password', {
                                required: t('reg_err_required', 'Requis'),
                                minLength: { value: 8, message: t('reg_err_min_length', 'Minimum 8 caractères') },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <_Error msg={errors.password.message} />}
                </div>

                {/* Confirmer mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('reg_confirm_password', 'Confirmer le mot de passe')}</label>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={`${_inputClass(errors.password_confirm)} pr-10`}
                            {...register('password_confirm', {
                                required: t('reg_err_required', 'Requis'),
                                validate: (v) => v === password || t('reg_err_match', 'Les mots de passe ne correspondent pas'),
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password_confirm && <_Error msg={errors.password_confirm.message} />}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm mt-2"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('reg_btn_loading', 'Création du compte...')}
                        </span>
                    ) : t('reg_btn_submit', 'Créer mon compte')}
                </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
                {t('reg_has_account', 'Déjà un compte ?')}{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                    {t('reg_login_link', 'Se connecter')}
                </Link>
            </p>
        </div>
    )
}

const _inputClass = (error) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-white outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
        error ? 'border-red-400' : 'border-slate-200'
    }`

const _Error = ({ msg }) => <p className="text-red-500 text-xs mt-1">{msg}</p>