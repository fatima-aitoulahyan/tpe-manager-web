import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDevis } from "../../../core/hooks/useDevis";
import StatutBadge from "../components/StatutBadge";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { adminApi } from '../../../core/api/adminApi';

import {
    ArrowLeft,
    User,
    Building2,
    Calendar,
    CreditCard,
    Receipt,
    FileDown,
    CheckCircle2,
    Copy,
    RefreshCw,
    Pencil,
    Trash2,
    XCircle,
    History,
    BellRing,
    Archive,
    Globe,
} from "lucide-react";

import RemindClientModal from "../../../shared/components/ui/RemindClientModal.jsx";
import {
    Section,
    InfoRow,
    PriceSummary,
    ActionButton,
    ConfirmModal,
} from "../../../shared/components/ui";

export default function DevisDetailPage() {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const {
        fetchOne,
        changeStatus,
        convertToFacture,
        duplicate,
        downloadPdf,
        remove,
    } = useDevis();

    const [devis, setDevis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showConvertConfirm, setShowConvertConfirm] = useState(false);
    const [showRemindModal, setShowRemindModal] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                let data;
                if (isAdminRoute) {
                    data = await adminApi.getDevisDetail(id);
                } else {
                    data = await fetchOne(id);
                }
                setDevis(data);
            } catch (error) {
                console.error("Erreur de chargement", error);
                toast.error(t('devis_detail_toast_error_load', "Erreur chargement"));
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, isAdminRoute]);

    const loadDetail = async () => {
        try {
            let data;
            if (isAdminRoute) {
                data = await adminApi.getDevisDetail(id);
            } else {
                data = await fetchOne(id);
            }
            setDevis(data);
        } catch {
            toast.error(t('devis_detail_toast_error_load', "Erreur chargement"));
        }
    };

    const handleAction = async (apiCall, msg) => {
        try {
            await apiCall(id);
            toast.success(msg);
            loadDetail();
        } catch (err) {
            toast.error(err.message || t('devis_detail_toast_error_default', "Une erreur est survenue"));
        }
    };

    const handleDownload = async () => {
        try {
            const blob = await downloadPdf(id);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${devis?.numero || "devis"}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error(t('devis_detail_toast_error_pdf', "Erreur PDF"));
        }
    };

    const handleDelete = async () => {
        try {
            await remove(id);
            toast.success(t('devis_detail_toast_success_delete', "Devis supprimé avec succès"));
            navigate(isAdminRoute ? "/admin/users" : "/devis");
        } catch (err) {
            toast.error(err.message || t('devis_detail_toast_error_delete', "Erreur lors de la suppression"));
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const handleConvert = async () => {
        setShowConvertConfirm(false);
        try {
            const result = await convertToFacture(id);
            toast.success(t('devis_detail_toast_success_convert', "Devis converti en facture avec succès"));
            navigate(isAdminRoute ? `/admin/factures/${result.facture_id || result.id}` : `/factures/${result.facture_id || result.id}`);
        } catch (err) {
            toast.error(err.message || t('devis_detail_toast_error_convert', "Erreur lors de la conversion"));
        }
    };

    if (loading || !devis)
        return <div className="flex justify-center p-10">{t('devis_detail_loading', "Chargement...")}</div>;

    const client = devis.client_detail || devis.clientDetail || {};
    const montantHt = Number(devis.montant_ht || devis.montantHt || 0);
    const montantTtc = Number(devis.montant_ttc || devis.montantTtc || 0);
    const tauxTva = Number(devis.taux_tva || devis.tauxTva || 0);
    const tva = montantTtc - montantHt;

    const formatMontant = (val) => `${Number(val || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

    const handleRemindClient = () => {
        const phone = (client.telephone || "").replace(/\D/g, "");
        const message = `Bonjour ${client.nom || ""}, votre devis ${devis.numero} (${formatMontant(montantTtc)}) est ${devis.date_validite ? `valable jusqu'au ${devis.date_validite}` : "toujours en attente"}. Merci de nous confirmer votre réponse.`;

        if (phone) {
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
        } else if (client.email) {
            window.open(
                `mailto:${client.email}?subject=Relance devis ${devis.numero}&body=${encodeURIComponent(message)}`,
                "_blank"
            );
        } else {
            toast.error(t('devis_detail_toast_error_contact', "Aucun contact disponible pour ce client"));
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-6 relative">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-10 sm:pt-0">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white p-2 rounded-lg"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="font-bold text-2xl text-slate-800">{t('devis_detail_title', "Détail du devis")}</h1>
                    <p className="text-slate-500 text-sm">{devis.numero}</p>
                </div>
            </div>

            {/* Informations générales */}
            <Section title={t('devis_detail_section_info', "Informations générales")}>
                <div className="flex justify-between mb-5">
                    <h2 className="font-bold text-slate-800">{devis.numero}</h2>
                    <StatutBadge statut={devis.statut} />
                </div>

                <InfoRow
                    icon={<User size={16} />}
                    label={t('devis_detail_label_client', "Client")}
                    text={`${client.nom || ""} ${client.prenom || ""}`.trim() || t('devis_detail_unspecified', "Non spécifié")}
                />

                {(client.nom_entreprise || client.nomEntreprise) && (
                    <InfoRow
                        icon={<Building2 size={16} />}
                        label={t('devis_detail_label_entreprise', "Entreprise")}
                        text={client.nom_entreprise || client.nomEntreprise}
                    />
                )}

                {client.ice && (
                    <InfoRow icon={<Receipt size={16} />} label="ICE" text={client.ice} />
                )}

                <InfoRow
                    icon={<Calendar size={16} />}
                    label={t('devis_detail_label_validite', "Valide jusqu'au")}
                    text={devis.date_validite || devis.dateValidite || "-"}
                />

                <InfoRow
                    icon={<CreditCard size={16} />}
                    label={t('devis_detail_label_reglement', "Règlement")}
                    text={devis.mode_paiement || devis.modePaiement || "-"}
                />
            </Section>

            {/* Prestations */}
            <Section title={t('devis_detail_section_prestations', "Prestations")}>
                {devis.lignes?.map((l, i) => {
                    const pu = Number(l.prix_unitaire || l.prixUnitaire || 0);
                    const qte = Number(l.quantite || 0);

                    return (
                        <div
                            key={i}
                            className="flex justify-between items-center p-4 bg-white border-b border-slate-100 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 p-2 rounded-lg">
                                    <Receipt size={16} className="text-slate-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-800">{l.libelle}</h4>
                                    <p className="text-xs text-slate-400">
                                        {qte} × {formatMontant(pu)}
                                    </p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-800">
                                {formatMontant(qte * pu)}
                            </span>
                        </div>
                    );
                })}
            </Section>

            {/* Résumé financier */}
            <Section title={t('devis_detail_section_resume', "Résumé financier")}>
                <PriceSummary
                    ht={montantHt.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    tva={tva.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    ttc={montantTtc.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    tauxTva={tauxTva}
                />
            </Section>

            {/* Facture liée */}
            {devis.facture_id && (
                <Section title={t('devis_detail_section_facture_liee', "Facture liée")}>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">{devis.facture_numero}</h4>
                                <p className="text-sm text-slate-500">{t('devis_detail_facture_convertie', "Ce devis a été converti")}</p>
                            </div>
                            <button
                                onClick={() => navigate(isAdminRoute ? `/admin/factures/${devis.facture_id}` : `/factures/${devis.facture_id}`)}
                                className="text-blue-600 font-semibold text-sm hover:underline"
                            >
                                {t('devis_detail_btn_voir', "Voir")}
                            </button>
                        </div>
                    </div>
                </Section>
            )}

            {/* Conditions */}
            {devis.conditions && (
                <Section title={t('devis_detail_section_conditions', "Conditions particulières")}>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-600 text-sm">
                        {devis.conditions}
                    </div>
                </Section>
            )}

            {/* Actions (Masquées ou adaptées si l'admin consulte en lecture seule) */}
            {!isAdminRoute && (
                <Section title={t('devis_detail_section_actions', "Actions disponibles")}>
                    {devis.statut === "BROUILLON" && (
                        <>
                            <ActionButton
                                icon={<Pencil size={16} />}
                                text={t('devis_detail_action_modifier', "Modifier le devis")}
                                primary
                                onClick={() => navigate(`/devis/${id}/edit`)}
                            />
                            <ActionButton
                                icon={<CheckCircle2 size={16} />}
                                text={t('devis_detail_action_envoye', "Marquer comme Envoyé")}
                                onClick={() => handleAction(() => changeStatus(id, "ENVOYE"), t('devis_detail_toast_envoye', "Envoyé avec succès"))}
                            />
                            <ActionButton
                                icon={<Trash2 size={16} />}
                                text={t('devis_detail_action_supprimer', "Supprimer")}
                                danger
                                onClick={() => setShowDeleteConfirm(true)}
                            />
                        </>
                    )}

                    {devis.statut === "ENVOYE" && (
                        <>
                            <ActionButton
                                icon={<BellRing size={16} />}
                                text={t('devis_detail_action_relancer', "Relancer le client")}
                                primary
                                onClick={() => setShowRemindModal(true)}
                            />
                            <ActionButton
                                icon={<CheckCircle2 size={16} />}
                                text={t('devis_detail_action_accepte', "Marquer comme Accepté")}
                                onClick={() => handleAction(() => changeStatus(id, "ACCEPTE"), t('devis_detail_toast_statut_maj', "Statut mis à jour"))}
                            />
                            <ActionButton
                                icon={<XCircle size={16} />}
                                text={t('devis_detail_action_refuse', "Marquer comme Refusé")}
                                onClick={() => handleAction(() => changeStatus(id, "REFUSE"), t('devis_detail_toast_statut_maj', "Statut mis à jour"))}
                            />
                            <ActionButton
                                icon={<History size={16} />}
                                text={t('devis_detail_action_brouillon', "Remettre en Brouillon")}
                                onClick={() => handleAction(() => changeStatus(id, "BROUILLON"), t('devis_detail_toast_statut_maj', "Statut mis à jour"))}
                            />
                        </>
                    )}

                    {devis.statut === "ACCEPTE" && !devis.facture_id && (
                        <ActionButton
                            icon={<RefreshCw size={16} />}
                            text={t('devis_detail_action_convertir', "Convertir en facture")}
                            primary
                            onClick={() => setShowConvertConfirm(true)}
                        />
                    )}

                    {(devis.statut === "REFUSE" || devis.statut === "EXPIRE") && (
                        <>
                            <ActionButton
                                icon={<Copy size={16} />}
                                text={t('devis_detail_action_dupliquer', "Dupliquer le devis")}
                                primary
                                onClick={() => handleAction(duplicate, t('devis_detail_toast_duplique', "Devis dupliqué avec succès"))}
                            />
                            <ActionButton
                                icon={<Archive size={16} />}
                                text={t('devis_detail_action_archiver', "Archiver le devis")}
                                onClick={() => handleAction(() => changeStatus(id, "ARCHIVE"), t('devis_detail_toast_archive', "Devis archivé"))}
                            />
                        </>
                    )}

                    <hr className="my-3 border-slate-200" />

                    <ActionButton
                        icon={<FileDown size={16} />}
                        text={t('devis_detail_action_pdf', "Télécharger / Partager le PDF")}
                        onClick={handleDownload}
                    />
                </Section>
            )}

            {showRemindModal && (
                <RemindClientModal
                    docNumero={devis.numero}
                    clientNom={`${client.nom || ""} ${client.prenom || ""}`.trim()}
                    telephone={client.telephone}
                    email={client.email}
                    montant={montantTtc}
                    dateInfo={`valable jusqu'au ${devis.date_validite || devis.dateValidite || ""}`}
                    onClose={() => setShowRemindModal(false)}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    title={t('devis_detail_modal_delete_title', "Supprimer le devis")}
                    message={t('devis_detail_modal_delete_msg', "Cette action est irréversible. Voulez-vous vraiment supprimer ce devis ?")}
                    confirmLabel={t('devis_detail_modal_delete_btn', "Supprimer")}
                    danger
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDelete}
                />
            )}

            {showConvertConfirm && (
                <ConfirmModal
                    title={t('devis_detail_modal_convert_title', "Convertir en facture")}
                    message={t('devis_detail_modal_convert_msg', "Un brouillon de facture sera créé à partir de ce devis. Continuer ?")}
                    confirmLabel={t('devis_detail_modal_convert_btn', "Convertir")}
                    onCancel={() => setShowConvertConfirm(false)}
                    onConfirm={handleConvert}
                />
            )}
        </div>
    );
}