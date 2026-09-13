import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDevis } from '../../../core/hooks/useDevis';
import { useClients } from '../../../core/hooks/useClients';
import LigneDevisForm from '../components/LigneDevisForm';
import ClientForm from '../../clients/components/ClientForm';
import { ArrowLeft, Trash2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ClientSelector from "../../../shared/components/form/ClientSelect.jsx";

export default function DevisEditPage() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchOne, update, loading: saving } = useDevis();
    const { fetchAll: fetchClients, create: createClient } = useClients();

    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [submittingClient, setSubmittingClient] = useState(false);

    const [clientId, setClientId] = useState('');
    const [dateValidite, setDateValidite] = useState('');
    const [tva, setTva] = useState(20);
    const [modePaiement, setModePaiement] = useState('VIREMENT');
    const [conditions, setConditions] = useState('');
    const [lignes, setLignes] = useState([]);



    const loadClients = async (selectNewClientId = null) => {
        try {
            const data = await fetchClients();
            setClients(data);
            if (selectNewClientId) setClientId(String(selectNewClientId));
        } catch (err) {
            toast.error(t('devis_edit_toast_error_clients', "Erreur lors du chargement des clients"));
        } finally {
            setLoadingClients(false);
        }
    };

    useEffect(() => {
        const initData = async () => {
            try {
                const [devisData] = await Promise.all([
                    fetchOne(id),
                    loadClients()
                ]);

                setClientId(
                    typeof devisData.client === 'object'
                        ? String(devisData.client.id)
                        : String(devisData.client)
                );
                setDateValidite(devisData.date_validite ?? '');
                setTva(devisData.taux_tva ?? 20);
                setModePaiement(devisData.mode_paiement ?? 'VIREMENT');
                setConditions(devisData.conditions ?? '');
                setLignes(devisData.lignes ?? []);
            } catch (err) {
                toast.error(t('devis_edit_toast_error_load', "Erreur lors du chargement du devis"));
                navigate('/devis');
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, [id]);

    const handleQuickClientSubmit = async (clientFormData) => {
        setSubmittingClient(true);
        try {
            const newClient = await createClient(clientFormData);
            toast.success(t('devis_edit_toast_client_success', "Client {{nom}} créé avec succès !").replace('{{nom}}', newClient.nom));
            setIsClientModalOpen(false);
            await loadClients(newClient.id);
        } catch (err) {
            toast.error(err.message || t('devis_edit_toast_client_error', "Échec de la création du client"));
        } finally {
            setSubmittingClient(false);
        }
    };

    const totalHt = lignes.reduce(
        (sum, l) => sum + (Number(l.prix_unitaire) * Number(l.quantite)), 0
    );
    const totalTtc = totalHt * (1 + tva / 100);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clientId) return toast.error(t('devis_edit_error_client', "Sélectionnez un client"));
        if (!dateValidite) return toast.error(t('devis_edit_error_date', "Date de validité requise"));
        if (lignes.length === 0) return toast.error(t('devis_edit_error_lignes', "Ajoutez au moins une prestation"));

        try {
            await update(id, {
                client: parseInt(clientId),
                date_validite: dateValidite,
                taux_tva: parseFloat(tva),
                mode_paiement: modePaiement,
                conditions,
                lignes
            });
            toast.success(t('devis_edit_toast_success', "Devis mis à jour avec succès !"));
            navigate(`/devis/${id}`);
        } catch (err) {
            toast.error(err.message || t('devis_edit_toast_error_update', "Erreur lors de la mise à jour"));
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            {t('devis_edit_loading', "Chargement du devis...")}
        </div>
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-1 relative">



                <div className="flex items-center gap-3 pt-10 sm:pt-0">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{t('devis_edit_title', "Modifier le devis")}</h1>
                        <p className="text-slate-500 text-sm mt-0.5">{t('devis_edit_subtitle', "Modifiez les informations de la proposition commerciale.")}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            {loadingClients ? (
                                <div className="text-xs font-medium text-slate-400 animate-pulse mt-6">
                                    {t('devis_clients_loading', "Chargement des clients...")}
                                </div>
                            ) : (
                                <ClientSelector
                                    clients={clients}
                                    selectedClientId={clientId}
                                    onSelectClient={setClientId}
                                    onOpenCreateModal={() => setIsClientModalOpen(true)}
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                {t('devis_label_validite', "Valable jusqu'au")}
                            </label>
                            <input
                                type="date"
                                required
                                value={dateValidite}
                                onChange={e => setDateValidite(e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                {t('devis_label_tva', "Taux TVA (%)")}
                            </label>
                            <input
                                type="number"
                                value={tva}
                                onChange={e => setTva(e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                {t('devis_label_paiement', "Mode de règlement")}
                            </label>
                            <select
                                value={modePaiement}
                                onChange={e => setModePaiement(e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                            >
                                <option value="VIREMENT">{t('devis_pay_virement', "Virement")}</option>
                                <option value="ESPECES">{t('devis_pay_especes', "Espèces")}</option>
                                <option value="MOBILE_MONEY">{t('devis_pay_mobile', "Mobile Money")}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                            {t('devis_label_prestations', "Prestations ajoutées")}
                        </label>
                        <LigneDevisForm onAdd={(l) => setLignes([...lignes, l])} />
                    </div>

                    {lignes.length > 0 && (
                        <div className="border border-slate-100 rounded-xl overflow-hidden mt-3 text-sm">
                            {lignes.map((l, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-slate-50/50 border-b border-slate-100 last:border-none"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">{l.libelle}</p>
                                        <p className="text-xs text-slate-400">
                                            {l.quantite} × {Number(l.prix_unitaire).toFixed(2)} DH
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">
                                            {(Number(l.quantite) * Number(l.prix_unitaire)).toFixed(2)} DH
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setLignes(lignes.filter((_, i) => i !== index))}
                                            className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            {t('devis_label_conditions', "Conditions particulières (Optionnel)")}
                        </label>
                        <textarea
                            value={conditions}
                            onChange={e => setConditions(e.target.value)}
                            rows="2"
                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                        />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-100">
                        <div className="flex justify-between text-slate-500">
                            <span>{t('devis_total_ht', "Total HT")}</span>
                            <span>{totalHt.toFixed(2)} DH</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>{t('devis_tva', "TVA")} ({tva}%)</span>
                            <span>{(totalTtc - totalHt).toFixed(2)} DH</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200/60 pt-2 text-base">
                            <span>{t('devis_total_ttc', "Total TTC")}</span>
                            <span className="text-blue-600">{totalTtc.toFixed(2)} DH</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {saving ? t('devis_edit_saving', "Enregistrement...") : t('devis_edit_submit_btn', "Enregistrer les modifications")}
                    </button>
                </div>
            </form>

            {isClientModalOpen && (
                <ClientForm
                    onSubmit={handleQuickClientSubmit}
                    onClose={() => setIsClientModalOpen(false)}
                    loading={submittingClient}
                />
            )}
        </>
    );
}