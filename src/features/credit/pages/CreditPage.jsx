import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredit } from '../../../core/hooks/useCredit';
import EligibiliteGauge from '../components/EligibiliteGauge';
import DemandeCard from '../components/DemandeCard';
import { Plus, Lightbulb, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function CreditPage() {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';
    const navigate = useNavigate();
    const { fetchEligibilite, fetchDemandes, removeDemande, loading } = useCredit();

    const [eligibilite, setEligibilite] = useState(null);
    const [demandes, setDemandes]       = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // id à supprimer

    const loadAll = async () => {
        try {
            const [elig, dem] = await Promise.all([
                fetchEligibilite(),
                fetchDemandes()
            ]);
            setEligibilite(elig);
            setDemandes(Array.isArray(dem) ? dem : (dem.results || []));
        } catch {
            toast.error(t('credit_toast_error_load', "Erreur de chargement"));
        }
    };

    useEffect(() => { loadAll(); }, []);

    const handleDelete = async (id) => {
        try {
            await removeDemande(id);
            toast.success(t('credit_toast_deleted', "Demande supprimée"));
            setShowDeleteConfirm(null);
            loadAll();
        } catch (err) {
            toast.error(err.message || t('credit_toast_error_delete', "Erreur lors de la suppression"));
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-1 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-10 sm:pt-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('credit_title', "Financement")}</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {t('credit_subtitle', "Évaluez votre éligibilité et gérez vos demandes.")}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/credit/create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
                >
                    <Plus size={16} /> {t('credit_new_btn', "Nouvelle demande")}
                </button>
            </div>

            {/* Carte éligibilité */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">{t('credit_eligibility_title', "Votre éligibilité")}</h2>
                {loading && !eligibilite ? (
                    <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
                        {t('credit_loading', "Chargement...")}
                    </div>
                ) : eligibilite ? (
                    <>
                        <div className="flex justify-center mb-4">
                            <EligibiliteGauge score={eligibilite.score} niveau={eligibilite.niveau} />
                        </div>

                        {eligibilite.conseils?.length > 0 && (
                            <>
                                <hr className="border-slate-100 my-4" />
                                <p className="text-xs font-semibold text-slate-500 mb-3">
                                    {t('credit_tips_title', "Conseils pour améliorer votre score")}
                                </p>
                                <div className="space-y-2">
                                    {eligibilite.conseils.map((c, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Lightbulb size={13} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-slate-500">{c}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : null}
            </div>

            {/* Liste des demandes */}
            <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-3">{t('credit_my_requests', "Mes demandes")}</h2>
                {loading && demandes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400 text-sm">
                        {t('credit_loading', "Chargement...")}
                    </div>
                ) : demandes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                        <p className="text-slate-400 text-sm">{t('credit_no_requests', "Aucune demande de financement.")}</p>
                        <button
                            onClick={() => navigate('/credit/create')}
                            className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                        >
                            {t('credit_create_first', "Créer ma première demande →")}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {demandes.map((d) => (
                            <DemandeCard
                                key={d.id}
                                demande={d}
                                currency={currency}
                                onView={() => navigate(`/credit/${d.id}`)}
                                onDelete={() => setShowDeleteConfirm(d.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal confirmation suppression */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="font-bold text-slate-900 mb-2">{t('credit_modal_delete_title', "Supprimer la demande")}</h3>
                        <p className="text-sm text-slate-500 mb-5">
                            {t('credit_modal_delete_desc', "Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.")}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 h-10 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                            >
                                {t('credit_modal_cancel', "Annuler")}
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold"
                            >
                                {t('credit_modal_confirm', "Supprimer")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}