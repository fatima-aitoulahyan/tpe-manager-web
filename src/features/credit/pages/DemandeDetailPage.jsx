import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredit } from '../../../core/hooks/useCredit';
import { ArrowLeft, RefreshCw, TrendingUp, FileText, Upload, Trash2, Paperclip, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function DemandeDetailPage() {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchDemande, uploadJustificatif, deleteJustificatif, loading } = useCredit();

    const [demande, setDemande]       = useState(null);
    const [typeDoc, setTypeDoc]       = useState('BILAN');
    const [uploading, setUploading]   = useState(false);

    const TYPE_LABELS = {
        FONCTIONNEMENT: t('detail_type_fonctionnement', 'Crédit de fonctionnement'),
        INVESTISSEMENT: t('detail_type_investissement', "Crédit d'investissement"),
        AVANCE_FACTURE: t('detail_type_avance', 'Avance sur factures'),
    };

    const STATUT_CONFIG = {
        SOUMISE:           { label: t('detail_statut_soumise', 'Soumise'),            color: '#2563eb', bg: '#eff6ff' },
        DOSSIER_INCOMPLET: { label: t('detail_statut_incomplet', 'Dossier incomplet'),  color: '#f97316', bg: '#fff7ed' },
        EN_ETUDE:          { label: t('detail_statut_etude', 'En étude'),           color: '#7c3aed', bg: '#f5f3ff' },
        FAVORABLE:         { label: t('detail_statut_favorable', 'Favorable'),          color: '#22c55e', bg: '#f0fdf4' },
        DEFAVORABLE:       { label: t('detail_statut_defavorable', 'Défavorable'),        color: '#ef4444', bg: '#fef2f2' },
        ACCEPTEE:          { label: t('detail_statut_acceptee', 'Acceptée'),           color: '#22c55e', bg: '#f0fdf4' },
        REFUSEE:           { label: t('detail_statut_refusee', 'Refusée'),            color: '#ef4444', bg: '#fef2f2' },
    };

    const TYPE_DOCS = [
        { value: 'BILAN',           label: t('detail_doc_bilan', 'Bilan comptable') },
        { value: 'RELEVE_BANCAIRE', label: t('detail_doc_releve', 'Relevé bancaire') },
        { value: 'PATENTE',         label: t('detail_doc_patente', 'Patente / RC') },
        { value: 'AUTRE',           label: t('detail_doc_autre', 'Autre document') },
    ];

    const loadDemande = async () => {
        try {
            const data = await fetchDemande(id);
            setDemande(data);
        } catch {
            toast.error(t('detail_toast_error_load', "Erreur de chargement"));
            navigate('/credit');
        }
    };

    useEffect(() => { loadDemande(); }, [id]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('type_document', typeDoc);
            fd.append('fichier', file);
            await uploadJustificatif(id, fd);
            toast.success(t('detail_toast_success_upload', "Justificatif ajouté"));
            loadDemande();
        } catch (err) {
            toast.error(err.message || t('detail_toast_error_upload', "Erreur lors de l'upload"));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDeleteDoc = async (justifId) => {
        try {
            await deleteJustificatif(id, justifId);
            toast.success(t('detail_toast_success_delete', "Document supprimé"));
            loadDemande();
        } catch {
            toast.error(t('detail_toast_error_delete', "Erreur lors de la suppression"));
        }
    };

    if (loading || !demande) return (
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            {t('detail_loading', "Chargement...")}
        </div>
    );

    const statut = STATUT_CONFIG[demande.statut] || { label: demande.statut, color: '#64748b', bg: '#f1f5f9' };
    const formattedMontant = Number(demande.montant_demande || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="space-y-5 max-w-2xl mx-auto p-1 relative">
            {/* Header */}
            <div className="flex items-center gap-3 pt-10 sm:pt-0">
                <button onClick={() => navigate('/credit')}
                        className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={16} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {TYPE_LABELS[demande.type_financement] || demande.type_financement}
                    </h1>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ color: statut.color, backgroundColor: statut.bg }}>
                    {statut.label}
                </span>
            </div>

            {/* Infos principales */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {t('detail_general_info', "Informations générales")}
                </h2>
                {[
                    [t('detail_label_amount', "Montant demandé"), `${formattedMontant} ${currency}`],
                    [t('detail_label_duration', "Durée"), `${demande.duree_mois} ${t('detail_months', "mois")}`],
                    [t('detail_label_date', "Date de soumission"), demande.date_soumission || demande.created_at?.split('T')[0] || '-'],
                ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-500">{label}</span>
                        <span className="text-sm font-semibold text-slate-800">{value}</span>
                    </div>
                ))}
            </div>

            {/* Objet */}
            {demande.objet_financement && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        {t('detail_object_title', "Objet du financement")}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{demande.objet_financement}</p>
                </div>
            )}

            {/* Justificatifs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t('detail_documents_title', "Justificatifs")}
                </h2>

                {/* Documents existants */}
                {demande.justificatifs?.length > 0 ? (
                    <div className="space-y-2">
                        {demande.justificatifs.map((j) => (
                            <div key={j.id}
                                 className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Paperclip size={14} className="text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {TYPE_DOCS.find(t => t.value === j.type_document)?.label || j.type_document}
                                        </p>
                                        <p className="text-xs text-slate-400">{j.nom_fichier || t('detail_document_default', 'Document')}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteDoc(j.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">{t('detail_no_documents', "Aucun document ajouté.")}</p>
                )}

                {/* Upload */}
                {['SOUMISE', 'DOSSIER_INCOMPLET'].includes(demande.statut) && (
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-medium text-slate-600">{t('detail_add_document', "Ajouter un document")}</p>
                        <div className="flex gap-2">
                            <select value={typeDoc} onChange={e => setTypeDoc(e.target.value)}
                                    className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none">
                                {TYPE_DOCS.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
                                uploading
                                    ? 'bg-slate-100 text-slate-400'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}>
                                <Upload size={14} />
                                {uploading ? t('detail_uploading', 'Upload...') : t('detail_choose', 'Choisir')}
                                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}