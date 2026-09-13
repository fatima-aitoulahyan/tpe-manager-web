import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { login, clearError } from '../../../store/slices/authSlice'
import { TrendingUp, CheckCircle2, Globe } from 'lucide-react'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const { loading, error, user } = useSelector((s) => s.auth)
    const [showPass, setShowPass] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm()

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
        }
        return () => dispatch(clearError())
    }, [user, navigate, dispatch])

    const onSubmit = (data) => dispatch(login(data))

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'fr' : 'ar'
        i18n.changeLanguage(newLang)
    }

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-row overflow-x-hidden relative">

            {/* Bouton de changement de langue flottant (visible sur les deux sections ou mobile) */}
            <button
                onClick={toggleLanguage}
                className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-slate-700 px-3.5 py-2 rounded-lg shadow-sm border border-slate-200 text-xs font-semibold backdrop-blur-md transition-all"
            >
                <Globe size={16} className="text-indigo-600" />
                {i18n.language === 'ar' ? 'Français' : 'العربية'}
            </button>

            {/* Section Gauche (Desktop - Illustration / Marketing) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 flex-col justify-between p-16 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                        <TrendingUp className="text-white" size={24} />
                    </div>
                    <span className="text-white font-bold text-2xl tracking-tight">TPE Manager</span>
                </div>

                <div className="relative z-10 max-w-lg my-auto">
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                        {t('login_hero_title', 'Gérez votre activité simplement et efficacement.')}
                    </h1>
                    <p className="text-indigo-100 text-lg font-light mb-10 leading-relaxed">
                        {t('login_hero_desc', 'Simplifiez la gestion de votre structure : devis professionnels, facturation conforme, suivi de trésorerie en temps réel et prévisions financières.')}
                    </p>

                    <div className="space-y-4 mb-12">
                        {[
                            t('login_feature_1', 'Conforme aux normes fiscales marocaines'),
                            t('login_feature_2', 'Génération de devis & factures en 1 clic'),
                            t('login_feature_3', 'Tableaux de bord clairs et automatisés')
                        ].map((text) => (
                            <div key={text} className="flex items-center gap-3 text-white/90">
                                <CheckCircle2 className="text-indigo-300 flex-shrink-0" size={20} />
                                <span className="text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-indigo-200/60 text-xs relative z-10 font-light">
                    {t('login_copyright', '© 2026 TPE Manager — Solution cloud pour auto-entrepreneurs et TPE au Maroc.')}
                </p>
            </div>

            {/* Section Droite (Formulaire de Connexion) */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 bg-white">

                {/* Logo visible uniquement sur Mobile / Tablette */}
                <div className="lg:hidden w-full max-w-md flex items-center gap-2.5 mb-6">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
                        <TrendingUp className="text-white" size={20} />
                    </div>
                    <span className="font-bold text-slate-900 text-xl tracking-tight">
                        TPE Manager
                    </span>
                </div>

                {/* Injection du composant LoginForm épuré */}
                <LoginForm
                    onSubmit={onSubmit}
                    register={register}
                    handleSubmit={handleSubmit}
                    errors={errors}
                    loading={loading}
                    error={error}
                    showPass={showPass}
                    setShowPass={setShowPass}
                />
            </div>
        </div>
    )
}