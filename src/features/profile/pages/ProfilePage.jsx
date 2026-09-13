import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../core/hooks/useProfile';
import PasswordModal from '../components/PasswordModal';
import SwitchTile from '../components/SwitchTile';
import {
    User, Mail, Phone, FileText, Briefcase,
    Bell, MessageSquare, Smartphone, BellRing,
    Receipt, ClipboardList, Scale, HeartPulse,
    CreditCard, Key, LogOut, Link, Eye, EyeOff,
    Lightbulb, Globe, Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { fetchProfile, updateProfile, changePassword, logout,
        saveEmailConfig, fetchPreferences, updatePreferences, loading } = useProfile();

    const STATUTS = [
        { value: 'auto_entrepreneur', label: t('profile_statut_auto', 'Auto-entrepreneur') },
        { value: 'tpe',               label: t('profile_statut_tpe', 'TPE') },
        { value: 'artisan',           label: t('profile_statut_artisan', 'Artisan') },
        { value: 'freelance',         label: t('profile_statut_freelance', 'Freelance') },
        { value: 'commercant',        label: t('profile_statut_commercant', 'Commerçant') },
    ];

    const TABS = [
        { id: 'profil',        label: t('profile_tab_profile', 'Profil & Sécurité') },
        { id: 'notifications', label: t('profile_tab_notifications', 'Notifications') },
    ];

    const [activeTab, setActiveTab] = useState('profil');

    const [profile, setProfile]           = useState(null);
    const [nom, setNom]                   = useState('');
    const [prenom, setPrenom]             = useState('');
    const [email, setEmail]               = useState('');
    const [telephone, setTelephone]       = useState('');
    const [ice, setIce]                   = useState('');
    const [statutFiscal, setStatutFiscal] = useState('');

    const [emailSmtp, setEmailSmtp]           = useState('');
    const [passwordSmtp, setPasswordSmtp]     = useState('');
    const [showSmtpPwd, setShowSmtpPwd]       = useState(false);
    const [savingSmtp, setSavingSmtp]         = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [savingPassword, setSavingPassword]       = useState(false);

    const [prefs, setPrefs] = useState(null);
    const [savingPrefs, setSavingPrefs] = useState(false);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        // Optionnel : Mettre à jour la direction du texte si l'arabe est sélectionné
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        toast.success(t('profile_toast_lang_success', "Langue modifiée avec succès"));
    };

    useEffect(() => {
        fetchProfile().then(data => {
            setProfile(data);
            setNom(data.nom || '');
            setPrenom(data.prenom || '');
            setEmail(data.email || '');
            setTelephone(data.telephone || '');
            setIce(data.ice || '');
            setStatutFiscal(data.statut_fiscal || '');
        }).catch(() => toast.error(t('profile_toast_error_load', "Erreur de chargement du profil")));

        fetchPreferences().then(setPrefs)
            .catch(() => {});
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ nom, prenom, email, telephone, ice, statut_fiscal: statutFiscal });
            toast.success(t('profile_toast_success_update', "Profil mis à jour !"));
        } catch (err) {
            toast.error(err.message || t('profile_toast_error_update', "Erreur lors de la mise à jour"));
        }
    };

    const handleChangePassword = async (oldPwd, newPwd) => {
        setSavingPassword(true);
        try {
            await changePassword({ old_password: oldPwd, new_password: newPwd });
            toast.success(t('profile_toast_success_password', "Mot de passe changé avec succès !"));
            setShowPasswordModal(false);
        } catch (err) {
            toast.error(err.message || t('profile_toast_error_password', "Erreur lors du changement"));
        } finally {
            setSavingPassword(false);
        }
    };

    const handleLogout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            await logout({ refresh });
        } catch { /* ignorer */ } finally {
            localStorage.clear();
            navigate('/login');
        }
    };

    const handleSaveSmtp = async () => {
        if (!emailSmtp || !passwordSmtp) return toast.error(t('profile_toast_smtp_empty', "Remplissez tous les champs email"));
        setSavingSmtp(true);
        try {
            await saveEmailConfig({ email_address: emailSmtp, email_password: passwordSmtp });
            toast.success(t('profile_toast_smtp_success', "Configuration email enregistrée !"));
        } catch (err) {
            toast.error(err.message || t('profile_toast_smtp_error', "Erreur de configuration"));
        } finally {
            setSavingSmtp(false);
        }
    };

    const updatePref = async (key, value) => {
        if (!prefs) return;
        const updated = { ...prefs, [key]: value };
        setPrefs(updated);
        setSavingPrefs(true);
        try {
            await updatePreferences(updated);
        } catch {
            toast.error(t('profile_toast_pref_error', "Erreur de sauvegarde"));
            setPrefs(prefs); // rollback
        } finally {
            setSavingPrefs(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto p-1 relative">

            {/* Header */}
            <div className="flex justify-between items-center pt-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('profile_title', "Paramètres")}</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{t('profile_subtitle', "Gérez votre profil et vos préférences.")}</p>
                </div>
                {savingPrefs && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 shadow-sm">
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        {t('profile_saving_prefs', "Sauvegarde...")}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── ONGLET PROFIL ── */}
            {activeTab === 'profil' && (
                <div className="space-y-5">

                    {/* Choix de la langue */}
                    <Section title={t('profile_section_language', "Langue de l'application")} icon={<Globe size={16} />}>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => changeLanguage('fr')}
                                className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                                    i18n.language === 'fr'
                                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    🇫🇷 Français
                                </span>
                                {i18n.language === 'fr' && <Check size={16} className="text-blue-600" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => changeLanguage('ar')}
                                className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                                    i18n.language === 'ar'
                                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    🇲🇦 العربية
                                </span>
                                {i18n.language === 'ar' && <Check size={16} className="text-blue-600" />}
                            </button>
                        </div>
                    </Section>

                    {/* Coordonnées */}
                    <Section title={t('profile_section_coords', "Modifier mes coordonnées")} icon={<User size={16} />}>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label={t('profile_field_prenom', "Prénom")} icon={<User size={14} />}
                                       value={prenom} onChange={setPrenom} />
                                <Field label={t('profile_field_nom', "Nom")} icon={<User size={14} />}
                                       value={nom} onChange={setNom} />
                            </div>
                            <Field label={t('profile_field_email', "Adresse email")} icon={<Mail size={14} />}
                                   value={email} onChange={setEmail} type="email" />
                            <Field label={t('profile_field_phone', "Téléphone")} icon={<Phone size={14} />}
                                   value={telephone} onChange={setTelephone} type="tel" />
                            <Field label={t('profile_field_ice', "ICE (Maroc)")} icon={<FileText size={14} />}
                                   value={ice} onChange={setIce} required={false} />
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    {t('profile_field_statut_fiscal', "Statut fiscal")}
                                </label>
                                <div className="relative">
                                    <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select value={statutFiscal} onChange={e => setStatutFiscal(e.target.value)}
                                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                        <option value="">{t('profile_select_default', "-- Choisir --")}</option>
                                        {STATUTS.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                                {loading ? t('profile_btn_saving', "Enregistrement...") : t('profile_btn_save_profile', "Enregistrer le profil")}
                            </button>
                        </form>
                    </Section>

                    {/* Config SMTP */}
                    <Section title={t('profile_section_smtp', "Configuration SMTP Email")} icon={<Mail size={16} />}>
                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                            <Lightbulb size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                {t('profile_smtp_notice', "Validation 2 étapes Google requise. Utilisez un \"Mot de passe d'application\" généré sur votre compte Google.")}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Field label={t('profile_field_smtp_email', "Adresse Gmail professionnelle")} icon={<Mail size={14} />}
                                   value={emailSmtp} onChange={setEmailSmtp} type="email" />
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    {t('profile_field_smtp_pwd', "Mot de passe d'application Google")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showSmtpPwd ? 'text' : 'password'}
                                        value={passwordSmtp}
                                        onChange={e => setPasswordSmtp(e.target.value)}
                                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button type="button" onClick={() => setShowSmtpPwd(p => !p)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showSmtpPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleSaveSmtp} disabled={savingSmtp}
                                    className="w-full h-11 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                <Link size={15} />
                                {savingSmtp ? t('profile_btn_linking', "Liaison...") : t('profile_btn_link_gmail', "Lier mon compte Gmail")}
                            </button>
                        </div>
                    </Section>

                    {/* Sécurité + Déconnexion */}
                    <Section title={t('profile_section_account', "Compte")} icon={<Key size={16} />}>
                        <div className="flex gap-3">
                            <button onClick={() => setShowPasswordModal(true)}
                                    className="flex-1 h-11 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                                <Key size={15} />
                                {t('profile_btn_security', "Sécurité")}
                            </button>
                            <button onClick={handleLogout}
                                    className="flex-1 h-11 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                                <LogOut size={15} />
                                {t('profile_btn_logout', "Déconnexion")}
                            </button>
                        </div>
                    </Section>
                </div>
            )}

            {/* ── ONGLET NOTIFICATIONS ── */}
            {activeTab === 'notifications' && prefs && (
                <div className="space-y-5">
                    {/* Rappels automatiques */}
                    <Section title={t('profile_section_reminders', "Rappels automatiques")} icon={<BellRing size={16} />}>
                        <div className="space-y-4 divide-y divide-slate-100">
                            <SwitchTile
                                icon={<Receipt size={15} />} iconColor="#ef4444" iconBg="#fef2f2"
                                title={t('profile_pref_invoice_title', "Rappel facture impayée")}
                                subtitle={t('profile_pref_invoice_sub', "Vous serez averti des factures en retard")}
                                checked={prefs.rappel_facture_impayee}
                                onChange={v => updatePref('rappel_facture_impayee', v)}
                            />
                            {prefs.rappel_facture_impayee && (
                                <DaysSelector
                                    label={t('profile_days_after', "Envoyer un rappel après")}
                                    value={prefs.rappel_facture_jours}
                                    onChange={v => updatePref('rappel_facture_jours', v)}
                                />
                            )}
                            <div className="pt-3">
                                <SwitchTile
                                    icon={<ClipboardList size={15} />} iconColor="#f97316" iconBg="#fff7ed"
                                    title={t('profile_pref_quote_title', "Rappel devis expirant")}
                                    subtitle={t('profile_pref_quote_sub', "Alerte avant expiration du devis")}
                                    checked={prefs.rappel_devis_expirant}
                                    onChange={v => updatePref('rappel_devis_expirant', v)}
                                />
                            </div>
                            {prefs.rappel_devis_expirant && (
                                <DaysSelector
                                    label={t('profile_days_before', "M'avertir avant expiration")}
                                    value={prefs.rappel_devis_jours_avant}
                                    onChange={v => updatePref('rappel_devis_jours_avant', v)}
                                />
                            )}
                            <div className="pt-3">
                                <SwitchTile
                                    icon={<Scale size={15} />} iconColor="#2563eb" iconBg="#eff6ff"
                                    title={t('profile_pref_tax_title', "Rappel déclaration fiscale")}
                                    subtitle={t('profile_pref_tax_sub', "Rappel trimestriel auto-entrepreneur / TPE")}
                                    checked={prefs.rappel_declaration_fiscale}
                                    onChange={v => updatePref('rappel_declaration_fiscale', v)}
                                />
                            </div>
                            <div className="pt-3">
                                <SwitchTile
                                    icon={<HeartPulse size={15} />} iconColor="#0d9488" iconBg="#f0fdfa"
                                    title={t('profile_pref_cnss_title', "Rappel cotisation CNSS")}
                                    subtitle={t('profile_pref_cnss_sub', "Rappel mensuel de paiement de cotisations")}
                                    checked={prefs.rappel_cotisation_cnss}
                                    onChange={v => updatePref('rappel_cotisation_cnss', v)}
                                />
                            </div>
                            <div className="pt-3">
                                <SwitchTile
                                    icon={<CreditCard size={15} />} iconColor="#7c3aed" iconBg="#f5f3ff"
                                    title={t('profile_pref_credit_title', "Notifications demande de crédit")}
                                    subtitle={t('profile_pref_credit_sub', "Changement de statut de dossier de crédit")}
                                    checked={prefs.notification_demande_credit}
                                    onChange={v => updatePref('notification_demande_credit', v)}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Modes de réception */}
                    <Section title={t('profile_section_channels', "Modes de réception")} icon={<Bell size={16} />}>
                        <div className="space-y-4 divide-y divide-slate-100">
                            <SwitchTile
                                icon={<Bell size={15} />} iconColor="#2563eb" iconBg="#eff6ff"
                                title={t('profile_channel_inapp', "Notification dans l'application")}
                                checked={prefs.canal_in_app}
                                onChange={v => updatePref('canal_in_app', v)}
                            />
                            <div className="pt-3">
                                <SwitchTile
                                    icon={<Smartphone size={15} />} iconColor="#22c55e" iconBg="#f0fdf4"
                                    title={t('profile_channel_push', "Notification Push")}
                                    checked={prefs.canal_push}
                                    onChange={v => updatePref('canal_push', v)}
                                />
                            </div>
                            <div className="pt-3">
                                <SwitchTile
                                    icon={<MessageSquare size={15} />} iconColor="#f97316" iconBg="#fff7ed"
                                    title={t('profile_channel_sms', "SMS")}
                                    subtitle={t('profile_channel_sms_sub', "Frais opérateur possibles")}
                                    checked={prefs.canal_sms}
                                    onChange={v => updatePref('canal_sms', v)}
                                />
                            </div>
                        </div>
                    </Section>
                </div>
            )}

            {activeTab === 'notifications' && !prefs && (
                <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm">
                    {t('profile_loading_prefs', "Chargement des préférences...")}
                </div>
            )}

            {showPasswordModal && (
                <PasswordModal
                    onConfirm={handleChangePassword}
                    onClose={() => setShowPasswordModal(false)}
                    loading={savingPassword}
                />
            )}
        </div>
    );
}


function Section({ title, icon, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 text-slate-700 mb-4">
                <span className="text-blue-600">{icon}</span>
                <h2 className="text-sm font-semibold">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function Field({ label, icon, value, onChange, type = 'text', required = true }) {
    return (
        <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>
        </div>
    );
}

function DaysSelector({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between pl-10 pt-2 pb-1">
            <span className="text-xs text-slate-500">{label}</span>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button onClick={() => value > 1 && onChange(value - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-slate-500 transition-colors text-sm font-bold">
                    −
                </button>
                <span className="w-10 text-center text-xs font-bold text-slate-700">{value} j</span>
                <button onClick={() => value < 30 && onChange(value + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-slate-500 transition-colors text-sm font-bold">
                    +
                </button>
            </div>
        </div>
    );
}