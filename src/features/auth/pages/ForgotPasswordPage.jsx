import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowLeft, TrendingUp, Lock, ShieldCheck, Eye, EyeOff, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../../core/api/axiosConfig'
import toast from 'react-hot-toast'

const STEPS = { EMAIL: 'email', CODE: 'code', PASSWORD: 'password', DONE: 'done' }

export default function ForgotPasswordPage() {
    const { t, i18n } = useTranslation()
    const [step,  setStep]  = useState(STEPS.EMAIL)
    const [email, setEmail] = useState('')
    const [code,  setCode]  = useState('')



    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">


            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-white" size={18} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">
                        TPE Manager
                    </span>
                </div>

                {/* Carte */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

                    {step === STEPS.EMAIL && (
                        <StepEmail
                            onSuccess={(email) => {
                                setEmail(email)
                                setStep(STEPS.CODE)
                            }}
                        />
                    )}

                    {step === STEPS.CODE && (
                        <StepCode
                            email={email}
                            onSuccess={(code) => {
                                setCode(code)
                                setStep(STEPS.PASSWORD)
                            }}
                            onResend={() => setStep(STEPS.EMAIL)}
                        />
                    )}

                    {step === STEPS.PASSWORD && (
                        <StepNewPassword
                            email={email}
                            code={code}
                            onSuccess={() => setStep(STEPS.DONE)}
                        />
                    )}

                    {step === STEPS.DONE && <StepDone />}
                </div>

                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {t('forgot_back_to_login', 'Retour à la connexion')}
                    </Link>
                </div>
            </div>
        </div>
    )
}


function StepEmail({ onSuccess }) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async ({ email }) => {
        setLoading(true)
        try {
            await api.post('/auth/forgot-password/', { email })
            toast.success(t('forgot_toast_sent', 'Code envoyé sur votre email'))
            onSuccess(email)
        } catch {
            toast.error(t('forgot_toast_error', 'Erreur lors de l\'envoi du code'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="text-blue-600" size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
                {t('forgot_title', 'Mot de passe oublié ?')}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
                {t('forgot_desc', 'Entrez votre email. Nous vous enverrons un code de réinitialisation.')}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t('forgot_email_label', 'Adresse email')}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="email"
                            placeholder="vous@exemple.com"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-white outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                                errors.email ? 'border-red-400' : 'border-slate-200'
                            }`}
                            {...register('email', {
                                required: t('forgot_email_required', 'Email requis'),
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: t('forgot_email_invalid', 'Email invalide'),
                                },
                            })}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('forgot_sending', 'Envoi en cours...')}
                        </span>
                    ) : t('forgot_send_btn', 'Envoyer le code')}
                </button>
            </form>
        </>
    )
}


function StepCode({ email, onSuccess, onResend }) {
    const { t } = useTranslation()
    const [digits,  setDigits]  = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState('')

    const handleDigit = (i, value) => {
        if (!/^\d?$/.test(value)) return
        const next = [...digits]
        next[i] = value
        setDigits(next)
        setError('')

        if (value && i < 5) {
            document.getElementById(`digit-${i + 1}`)?.focus()
        }

        if (next.every((d) => d) && value) {
            submitCode(next.join(''))
        }
    }

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            document.getElementById(`digit-${i - 1}`)?.focus()
        }
    }

    const submitCode = async (code) => {
        setLoading(true)
        setError('')
        try {
            await api.post('/auth/verify-reset-code/', { email, code })
            toast.success(t('code_toast_success', 'Code validé !'))
            onSuccess(code)
        } catch {
            setError(t('code_error_invalid', 'Code invalide ou expiré. Vérifiez et réessayez.'))
            setDigits(['', '', '', '', '', ''])
            document.getElementById('digit-0')?.focus()
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = () => {
        const code = digits.join('')
        if (code.length === 6) submitCode(code)
    }

    return (
        <>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="text-blue-600" size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
                {t('code_title', 'Vérification du code')}
            </h2>
            <p className="text-slate-500 text-sm mb-1">
                {t('code_desc', 'Entrez le code à 6 chiffres envoyé à')}
            </p>
            <p className="text-slate-700 font-semibold text-sm mb-6">
                {email}
            </p>

            <div className="flex gap-2 justify-center mb-4">
                {digits.map((d, i) => (
                    <input
                        key={i}
                        id={`digit-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleDigit(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-11 h-13 text-center text-xl font-bold border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                            d ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                        } ${error ? 'border-red-400 bg-red-50' : ''}`}
                    />
                ))}
            </div>

            {error && (
                <p className="text-red-500 text-xs text-center mb-4">{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading || digits.some((d) => !d)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm mb-4"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('code_verifying', 'Vérification...')}
                    </span>
                ) : t('code_verify_btn', 'Vérifier le code')}
            </button>

            <p className="text-center text-slate-500 text-sm">
                {t('code_resend_prompt', "Vous n'avez pas reçu le code ?")}{' '}
                <button
                    onClick={onResend}
                    className="text-blue-600 font-semibold hover:text-blue-700"
                >
                    {t('code_resend_btn', 'Renvoyer')}
                </button>
            </p>
        </>
    )
}


function StepNewPassword({ email, code, onSuccess }) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const password = watch('password')

    const onSubmit = async ({ password: newPassword }) => {
        setLoading(true)
        try {
            await api.post('/auth/reset-password/', {
                email, code, new_password: newPassword,
            })
            toast.success(t('reset_toast_success', 'Mot de passe réinitialisé !'))
            onSuccess()
        } catch {
            toast.error(t('reset_toast_error', 'Erreur lors de la réinitialisation'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="text-blue-600" size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
                {t('reset_title', 'Nouveau mot de passe')}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
                {t('reset_desc', "Choisissez un mot de passe sécurisé d'au moins 8 caractères.")}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Nouveau mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t('reset_new_pass_label', 'Nouveau mot de passe')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder={t('reset_placeholder_min', 'Minimum 8 caractères')}
                            className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm bg-white outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                                errors.password ? 'border-red-400' : 'border-slate-200'
                            }`}
                            {...register('password', {
                                required: t('reset_required', 'Requis'),
                                minLength: { value: 8, message: t('reset_min_length', 'Minimum 8 caractères') },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirmer */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t('reset_confirm_pass_label', 'Confirmer le mot de passe')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm bg-white outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                                errors.confirm ? 'border-red-400' : 'border-slate-200'
                            }`}
                            {...register('confirm', {
                                required: t('reset_required', 'Requis'),
                                validate: (v) =>
                                    v === password || t('reset_pass_mismatch', 'Les mots de passe ne correspondent pas'),
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.confirm && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.confirm.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('reset_submitting', 'Réinitialisation...')}
                        </span>
                    ) : t('reset_submit_btn', 'Réinitialiser le mot de passe')}
                </button>
            </form>
        </>
    )
}

function StepDone() {
    const { t } = useTranslation()
    return (
        <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-green-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
                {t('done_title', 'Mot de passe réinitialisé !')}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
                {t('done_desc', 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.')}
            </p>
            <Link
                to="/login"
                className="inline-block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm text-center"
            >
                {t('done_login_btn', 'Se connecter')}
            </Link>
        </div>
    )
}