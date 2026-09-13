import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { register as registerUser, clearError } from '../../../store/slices/authSlice'
import { TrendingUp, Globe } from 'lucide-react'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const { loading, error, user } = useSelector((s) => s.auth)

    const [showPass,    setShowPass]    = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const password = watch('password')

    useEffect(() => {
        if (user) navigate('/dashboard', { replace: true })
        return () => dispatch(clearError())
    }, [user, navigate, dispatch])

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'fr' : 'ar'
        i18n.changeLanguage(newLang)
    }

    const onSubmit = (data) => {
        dispatch(registerUser({
            email:            data.email,
            telephone:        data.telephone,
            nom:              data.nom,
            prenom:           data.prenom,
            nom_entreprise:   data.nom_entreprise || undefined,
            statut_fiscal:    data.statut_fiscal  || undefined,
            password:         data.password,
            password_confirm: data.password_confirm,
        }))
    }

    return (
        <div className="min-h-screen bg-slate-50 flex relative">

            {/* Bouton de changement de langue flottant */}
            <button
                onClick={toggleLanguage}
                className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-slate-700 px-3.5 py-2 rounded-lg shadow-sm border border-slate-200 text-xs font-semibold backdrop-blur-md transition-all"
            >
                <Globe size={16} className="text-blue-600" />
                {i18n.language === 'ar' ? 'Français' : 'العربية'}
            </button>

            {/* Section Gauche (Desktop - Illustration / Marketing) */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-white" size={22} />
                    </div>
                    <span className="text-white font-bold text-xl">TPE Manager</span>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-white leading-tight mb-4">
                        {t('register_hero_title', "Rejoignez des milliers d'entrepreneurs marocains")}
                    </h1>
                    <p className="text-blue-100">
                        {t('register_hero_desc', "Créez votre compte gratuitement et commencez à gérer votre activité dès aujourd'hui.")}
                    </p>

                    <div className="mt-10 space-y-4">
                        {[
                            t('register_feature_1', '✓ Création de devis et factures en 2 minutes'),
                            t('register_feature_2', '✓ Suivi de trésorerie en temps réel'),
                            t('register_feature_3', '✓ Accès à des solutions de financement'),
                            t('register_feature_4', '✓ Rappels automatiques clients'),
                        ].map((f) => (
                            <p key={f} className="text-blue-100 text-sm">{f}</p>
                        ))}
                    </div>
                </div>

                <p className="text-blue-200 text-sm">
                    {t('register_copyright', '© 2026 TPE Manager')}
                </p>
            </div>

            {/* Section Droite (Formulaire d'Inscription) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">

                {/* Logo mobile */}
                <div className="lg:hidden w-full max-w-lg flex items-center gap-2 mb-6">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-white" size={18} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">TPE Manager</span>
                </div>

                <RegisterForm
                    onSubmit={onSubmit}
                    register={register}
                    handleSubmit={handleSubmit}
                    errors={errors}
                    loading={loading}
                    error={error}
                    password={password}
                    showPass={showPass}
                    setShowPass={setShowPass}
                    showConfirm={showConfirm}
                    setShowConfirm={setShowConfirm}
                />
            </div>
        </div>
    )
}