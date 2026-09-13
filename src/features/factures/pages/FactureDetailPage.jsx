import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // <-- Ajouté useLocation
import { useFactures } from "../../../core/hooks/useFactures";
import TransactionForm from "../../cashflow/components/TransactionForm";
import { toast } from "react-hot-toast";
import {
    ArrowLeft, FileDown, Receipt, Pencil, Send, Trash2,
    CreditCard, BellRing, Archive, Globe
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { adminApi } from '../../../core/api/adminApi';

import {
    Section,
    InfoRow,
    PriceSummary,
    ActionButton,
    ConfirmModal
} from "../../../shared/components/ui";
import StatutBadge from "../../devis/components/StatutBadge.jsx";

export default function FactureDetailPage() {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // <-- Déclaration de location
    const isAdminRoute = location.pathname.startsWith('/admin'); // <-- Déclaration de isAdminRoute

    const { fetchOne, changeStatus, downloadPdf, pay, remove } = useFactures();

    const [facture, setFacture] = useState(null);
    const [loading, setLoading] = useState(true); // <-- State de chargement local (isolé de l'admin)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        loadDetail();
    }, [id, isAdminRoute]);

    const loadDetail = async () => {
        try {
            let data;
            if (isAdminRoute) {
                data = await adminApi.getFactureDetail(id); // Utilise la route admin
            } else {
                data = await fetchOne(id);
            }
            setFacture(data);
        } catch {
            toast.error(t('facture_detail_toast_error_load', "Erreur de chargement"));
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (apiCall, msg) => {
        try {
            await apiCall();
            toast.success(msg);
            loadDetail();
        } catch (err) {
            toast.error(err.message || t('facture_detail_toast_error_generic', "Une erreur est survenue"));
        }
    };

    const handleDownload = async () => {
        try {
            const blob = await downloadPdf(id);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Facture_${facture?.numero || 'export'}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error(t('facture_detail_toast_error_pdf', "Erreur PDF"));
        }
    };

    const handleAddPayment = async (data) => {
        try {
            await pay(id, data.montant);
            toast.success(t('facture_detail_toast_payment_success', "Paiement enregistré avec succès"));
            setShowPaymentModal(false);
            loadDetail();
        } catch (err) {
            toast.error(err.message || t('facture_detail_toast_error_payment', "Erreur lors de l'enregistrement"));
        }
    };

    if (loading || !facture) return <div className="p-10 text-center">{t('facture_detail_loading', "Chargement...")}</div>;

    const ht = Number(facture.montant_ht || 0);
    const ttc = Number(facture.montant_ttc || 0);
    const tva = (ttc - ht).toFixed(2);
    const client = facture.client_detail || facture.client || {};

    const formatMontant = (val) => `${Number(val || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

    return (
        <div className="bg-slate-50 min-h-screen p-6 max-w-4xl mx-auto relative">
            {showPaymentModal && (
                <TransactionForm
                    factureId={id}
                    defaultMontant={facture.reste_a_payer || facture.resteAPayer || ""}
                    defaultDescription={t('facture_payment_desc', "Paiement facture {{numero}}", { numero: facture.numero })}
                    onClose={() => setShowPaymentModal(false)}
                    onSubmit={handleAddPayment}
                />
            )}
            <div className="flex items-center justify-between mb-6 pt-10 sm:pt-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="bg-blue-600 text-white p-2 rounded-lg">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="font-bold text-2xl text-slate-800">
                        {t('facture_detail_title', "Facture {{numero}}", { numero: facture.numero })}
                    </h1>
                </div>

                <StatutBadge statut={facture.statut} />
            </div>

            <Section title={t('facture_section_general', "Informations générales")}>
                <InfoRow
                    label={t('facture_label_client', "Client")}
                    text={`${client.nom || ""} ${client.prenom || ""}`.trim() || t('facture_client_unspecified', "Non spécifié")}
                />

                {(client.nom_entreprise || client.nomEntreprise) && (
                    <InfoRow label={t('facture_label_entreprise', "Entreprise")} text={client.nom_entreprise || client.nomEntreprise} />
                )}

                {facture.date_echeance && (
                    <InfoRow label={t('facture_label_echeance', "Date d'échéance")} text={facture.date_echeance} />
                )}
                <InfoRow label={t('facture_label_reglement', "Mode de règlement")} text={facture.mode_paiement || "-"} />
            </Section>

            <Section title={t('facture_section_prestations', "Prestations")}>
                {facture.lignes?.map((l, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg">
                                <Receipt size={16} className="text-slate-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-800">{l.libelle}</h4>
                                <p className="text-xs text-slate-400">{l.quantite} × {formatMontant(l.prix_unitaire)}</p>
                            </div>
                        </div>
                        <span className="font-bold text-slate-800">
                            {formatMontant(l.prix_unitaire * l.quantite)}
                        </span>
                    </div>
                ))}
            </Section>

            {facture.conditions && (
                <Section title={t('facture_section_conditions', "Conditions particulières")}>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-600 text-sm">
                        {facture.conditions}
                    </div>
                </Section>
            )}

            {["BROUILLON"].includes(facture.statut) && (
                <Section title={t('facture_section_financial', "Résumé financier")}>
                    <PriceSummary
                        ht={ht.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        tva={Number(tva).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        ttc={ttc.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        tauxTva={facture.taux_tva}
                    />
                </Section>
            )}

            {["ENVOYE", "PARTIELLEMENT_PAYEE", "PAYEE"].includes(facture.statut) && (
                <Section title={t('facture_section_financial', "Résumé financier")}>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-500">{t('facture_total_ht', "Total HT")}</span>
                            <span className="font-semibold">{formatMontant(ht)}</span>
                        </div>

                        <div className="flex justify-between text-green-600">
                            <span className="font-medium">{t('facture_montant_paye', "Montant Payé")}</span>
                            <span className="font-semibold">{formatMontant(facture.montant_paye || 0)}</span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                            <span className="font-medium">{t('facture_reste_a_payer', "Reste à payer")}</span>
                            <span className="font-semibold">{formatMontant(facture.reste_a_payer || 0)}</span>
                        </div>

                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>{t('facture_total_ttc', "Total TTC")}</span>
                            <span>{formatMontant(ttc)}</span>
                        </div>
                    </div>
                </Section>
            )}

            {facture.devis && (
                <Section title={t('facture_section_origin', "Origine du document")}>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">
                                    {facture.devis_numero || t('facture_devis_num', "Devis #{{devis}}", { devis: facture.devis })}
                                </h4>
                                <p className="text-sm text-slate-500">
                                    {t('facture_devis_origin_desc', "Facture générée à partir de ce devis.")}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(isAdminRoute ? `/admin/devis/${facture.devis}` : `/devis/${facture.devis}`)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm"
                            >
                                {t('facture_btn_view', "Voir")}
                            </button>
                        </div>
                    </div>
                </Section>
            )}

            {/* Actions (masquées si l'admin consulte en lecture seule) */}
            {!isAdminRoute && (
                <Section title={t('facture_section_actions', "Actions disponibles")}>
                    {facture.statut === "BROUILLON" && (
                        <>
                            <ActionButton icon={<Pencil size={16} />} text={t('facture_action_edit', "Modifier")} primary onClick={() => navigate(`/factures/${id}/edit`)} />
                            <ActionButton
                                icon={<Send size={16} />}
                                text={t('facture_action_validate', "Valider et Envoyer")}
                                onClick={() => handleAction(() => changeStatus(id, "ENVOYE"), t('facture_toast_sent', "Facture envoyée"))}
                            />
                            <ActionButton icon={<Trash2 size={16} />} text={t('facture_action_delete', "Supprimer")} danger onClick={() => setShowDeleteConfirm(true)} />
                        </>
                    )}

                    {(facture.statut === "ENVOYE" || facture.statut === "PARTIELLEMENT_PAYEE") && (
                        <ActionButton
                            icon={<CreditCard size={16} />}
                            text={t('facture_action_payment', "Enregistrer un paiement")}
                            primary
                            onClick={() => setShowPaymentModal(true)}
                        />
                    )}

                    {["PAYEE", "EN_ATTENTE", "ENVOYE"].includes(facture.statut) && (
                        <ActionButton icon={<Archive size={16} />} text={t('facture_action_archive', "Archiver")} onClick={() => setShowArchiveConfirm(true)} />
                    )}

                    <hr className="my-3 border-slate-200" />
                    <ActionButton icon={<FileDown size={16} />} text={t('facture_action_download_pdf', "Télécharger PDF")} onClick={handleDownload} />
                </Section>
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    title={t('facture_modal_delete_title', "Supprimer")}
                    message={t('facture_modal_delete_msg', "Confirmer la suppression ? Cette action est irréversible.")}
                    confirmLabel={t('facture_modal_delete_confirm', "Supprimer")}
                    danger
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={async () => {
                        try {
                            await remove(id);
                            toast.success(t('facture_toast_deleted', "Facture supprimée"));
                            setShowDeleteConfirm(false);
                            navigate("/factures");
                        } catch (err) {
                            toast.error(t('facture_toast_error_delete', "Erreur lors de la suppression"));
                        }
                    }}
                />
            )}

            {showArchiveConfirm && (
                <ConfirmModal
                    title={t('facture_modal_archive_title', "Archiver la facture")}
                    message={t('facture_modal_archive_msg', "Confirmer l'archivage de cette facture ?")}
                    confirmLabel={t('facture_modal_archive_confirm', "Archiver")}
                    onCancel={() => setShowArchiveConfirm(false)}
                    onConfirm={async () => {
                        await handleAction(
                            () => changeStatus(id, "ARCHIVE"),
                            t('facture_toast_archived', "Facture archivée")
                        );
                        setShowArchiveConfirm(false);
                        navigate("/factures");
                    }}
                />
            )}
        </div>
    );
}