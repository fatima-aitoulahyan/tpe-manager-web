import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredit } from '../../../core/hooks/useCredit';
import { ArrowLeft, RefreshCw, TrendingUp, FileText, Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const DUREES = [3, 6, 12, 18, 24, 36];

export default function DemandeCreatePage() {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';
    const navigate = useNavigate();
    const { createDemande, loading } = useCredit();

    const TYPES = [
        { value: 'FONCTIONNEMENT', label: t('demande_type_fonctionnement', 'Crédit de fonctionnement'),
            plafond: `200 000 ${currency}`, icon: <RefreshCw size={18} /> },
        { value: 'INVESTISSEMENT', label: t('demande_type_investissement', "Crédit d'investissement"),
            plafond: `500 000 ${currency}`, icon: <TrendingUp size={18} /> },
        { value: 'AVANCE_FACTURE', label: t('demande_type_avance', 'Avance sur factures'),
            plafond: `100 000 ${currency}`, icon: <FileText size={18} /> },
    ];

    const [typeFinancement, setTypeFinancement] = useState('FONCTIONNEMENT');
    const [montant, setMontant]                 = useState('');
    const [dureeMois, setDureeMois]             = useState(12);
    const [objet, setObjet]                     = useState('');
    const [consentement, setConsentement]       = useState(false);
    const [errors, setErrors]                   = useState({});

    const validate = () => {
        const e = {};
        if (!montant || isNaN(montant) || Number(montant) <= 0)
            e.montant = t('demande_error_montant', 'Montant invalide');
        if (!objet.trim())
            e.objet = t('demande_error_objet', 'Champ requis');
        if (!consentement)
            e.consentement = t('demande_error_consentement', 'Vous devez accepter la transmission de vos données');
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await createDemande({
                type_financement:  typeFinancement,
                montant_demande:   parseFloat(montant),
                duree_mois:        dureeMois,
                objet_financement: objet.trim(),
                consentement_cndp: consentement,
            });
            toast.success(t('demande_toast_success', "Demande soumise avec succès !"));
            navigate('/credit');
        } catch (err) {
            toast.error(err.message || t('demande_toast_error', "Erreur lors de la soumission"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-1 relative">

            {/* Header */}
            <div className="flex items-center gap-3 pt-10 sm:pt-0">
                <button type="button" onClick={() => navigate(-1)}
                        className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('demande_title', "Nouvelle demande")}</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{t('demande_subtitle', "Soumettez une demande de financement.")}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">

                {/* Type de financement */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-3">
                        {t('demande_label_type', "Type de financement")}
                    </label>
                    <div className="space-y-2">
                        {TYPES.map((item) => {
                            const selected = typeFinancement === item.value;
                            return (
                                <button key={item.value} type="button"
                                        onClick={() => setTypeFinancement(item.value)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                                            selected
                                                ? 'border-blue-500 bg-blue-50/60'
                                                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                                        }`}
                                >
                                    <span className={selected ? 'text-blue-600' : 'text-slate-400'}>
                                        {item.icon}
                                    </span>
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${selected ? 'text-blue-700' : 'text-slate-700'}`}>
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-slate-400">Plafond : {item.plafond}</p>
                                    </div>
                                    {selected && <Check size={16} className="text-blue-600 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Montant */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t('demande_label_montant', "Montant demandé")} ({currency})
                    </label>
                    <input
                        type="number"
                        value={montant}
                        onChange={e => setMontant(e.target.value)}
                        placeholder="Ex : 50000"
                        className={`w-full text-sm bg-slate-50 border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                            errors.montant ? 'border-rose-400' : 'border-slate-200'
                        }`}
                    />
                    {errors.montant && <p className="text-xs text-rose-500 mt-1">{errors.montant}</p>}
                </div>

                {/* Durée */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-3">
                        {t('demande_label_duree', "Durée souhaitée")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DUREES.map((d) => (
                            <button key={d} type="button"
                                    onClick={() => setDureeMois(d)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                                        dureeMois === d
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {d} {t('demande_months', "mois")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Objet */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t('demande_label_objet', "Objet du financement")}
                    </label>
                    <textarea
                        value={objet}
                        onChange={e => setObjet(e.target.value)}
                        rows={3}
                        placeholder={t('demande_placeholder_objet', "Décrivez l'utilisation prévue des fonds...")}
                        className={`w-full text-sm bg-slate-50 border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                            errors.objet ? 'border-rose-400' : 'border-slate-200'
                        }`}
                    />
                    {errors.objet && <p className="text-xs text-rose-500 mt-1">{errors.objet}</p>}
                </div>

                {/* Consentement CNDP */}
                <div className={`bg-slate-50 rounded-xl p-4 border ${errors.consentement ? 'border-rose-300' : 'border-slate-100'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={consentement}
                            onChange={e => setConsentement(e.target.checked)}
                            className="mt-0.5 accent-blue-600"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                            {t('demande_cndp_text', "J'accepte la transmission de mes données financières aux partenaires financiers conformément à la réglementation CNDP.")}
                        </span>
                    </label>
                    {errors.consentement && (
                        <p className="text-xs text-rose-500 mt-2">{errors.consentement}</p>
                    )}
                </div>

                <button type="submit" disabled={loading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                    {loading ? t('demande_submitting', "Soumission...") : t('demande_submit_btn', "Soumettre la demande")}
                </button>
            </div>
        </form>
    );
}