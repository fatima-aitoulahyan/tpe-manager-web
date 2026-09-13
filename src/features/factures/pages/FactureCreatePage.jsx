import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFactures } from '../../../core/hooks/useFactures';
import { useClients } from '../../../core/hooks/useClients';
import LigneDevisForm from '../../devis/components/LigneDevisForm';
import ClientForm from '../../clients/components/ClientForm';
import { ArrowLeft, Trash2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ClientSelector from "../../../shared/components/form/ClientSelect.jsx";

export default function FactureCreatePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { create, loading } = useFactures();
    const { fetchAll: fetchClients, create: createClient } = useClients();

    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [submittingClient, setSubmittingClient] = useState(false);

    const [clientId, setClientId] = useState('');
    const [dateEcheance, setDateEcheance] = useState('');
    const [tva, setTva] = useState(20);
    const [modePaiement, setModePaiement] = useState('VIREMENT');
    const [conditions, setConditions] = useState('');
    const [lignes, setLignes] = useState([]);



    const loadClients = async (selectNewClientId = null) => {
        try {
            const data = await fetchClients();
            setClients(data);
            if (selectNewClientId) setClientId(selectNewClientId);
        } catch (err) {
            toast.error(t('facture_create_toast_error_clients', "Erreur lors du chargement des clients"));
        } finally {
            setLoadingClients(false);
        }
    };

    useEffect(() => { loadClients(); }, []);

    const handleQuickClientSubmit = async (clientFormData) => {
        setSubmittingClient(true);
        try {
            const newClient = await createClient(clientFormData);
            toast.success(t('facture_create_toast_client_success', "Client {{nom}} créé avec succès !").replace('{{nom}}', newClient.nom));
            setIsClientModalOpen(false);
            await loadClients(newClient.id);
        } catch (err) {
            toast.error(err.message || t('facture_create_toast_client_error', "Échec de la création du client"));
        } finally {
            setSubmittingClient(false);
        }
    };

    const totalHt = lignes.reduce((sum, l) => sum + (Number(l.prix_unitaire) * Number(l.quantite)), 0);
    const totalTtc = totalHt * (1 + tva / 100);
    const aujourdhui = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clientId) return toast.error(t('facture_create_error_client', "Sélectionnez un client"));
        if (!dateEcheance) return toast.error(t('facture_create_error_date', "Date d'échéance requise"));
        if (lignes.length === 0) return toast.error(t('facture_create_error_lignes', "Ajoutez au moins une ligne"));

        try {
            await create({
                client: parseInt(clientId),
                date_echeance: dateEcheance,
                taux_tva: parseFloat(tva),
                mode_paiement: modePaiement,
                conditions,
                lignes
            });
            toast.success(t('facture_create_toast_success', "Facture créée avec succès !"));
            navigate('/factures');
        } catch (err) {
            toast.error(err.message || t('facture_create_toast_error_create', "Erreur lors de la création"));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-1 relative">


                <div className="flex items-center gap-3 pt-10 sm:pt-0">
                    <button type="button" onClick={() => navigate('/factures')} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{t('facture_create_title', "Nouvelle Facture")}</h1>
                        <p className="text-slate-500 text-sm mt-0.5">{t('facture_create_subtitle', "Émettez une nouvelle facture client.")}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            {loadingClients ? <div className="text-xs text-slate-400 mt-6">{t('facture_clients_loading', "Chargement...")}</div> : (
                                <ClientSelector
                                    clients={clients}
                                    selectedClientId={clientId}
                                    onSelectClient={setClientId}
                                    onOpenCreateModal={() => setIsClientModalOpen(true)}
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">{t('facture_label_echeance', "Date d'échéance")}</label>
                            <input type="date" required min={aujourdhui} value={dateEcheance} onChange={e => setDateEcheance(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">{t('facture_label_tva', "Taux TVA (%)")}</label>
                            <input type="number" value={tva} onChange={e => setTva(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">{t('facture_label_paiement', "Mode de règlement")}</label>
                            <select value={modePaiement} onChange={e => setModePaiement(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none">
                                <option value="VIREMENT">{t('facture_pay_virement', "Virement")}</option>
                                <option value="ESPECES">{t('facture_pay_especes', "Espèces")}</option>
                                <option value="CHEQUE">{t('facture_pay_cheque', "Chèque")}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">{t('facture_label_lignes', "Lignes de facturation")}</label>
                        <LigneDevisForm onAdd={(l) => setLignes([...lignes, l])} />
                    </div>

                    {lignes.length > 0 && (
                        <div className="border border-slate-100 rounded-xl overflow-hidden mt-3 text-sm">
                            {lignes.map((l, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50/50 border-b border-slate-100">
                                    <div>
                                        <p className="font-medium text-slate-900">{l.libelle}</p>
                                        <p className="text-xs text-slate-400">{l.quantite} × {Number(l.prix_unitaire).toFixed(2)} DH</p>
                                    </div>
                                    <button type="button" onClick={() => setLignes(lignes.filter((_, i) => i !== index))} className="text-rose-500 p-1.5"><Trash2 size={15} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">{t('facture_label_conditions', "Conditions particulières (Optionnel)")}</label>
                        <textarea value={conditions} onChange={e => setConditions(e.target.value)} rows="2" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"></textarea>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                        <div className="flex justify-between text-slate-500"><span>{t('facture_total_ht', "Total HT")}</span><span>{totalHt.toFixed(2)} DH</span></div>
                        <div className="flex justify-between font-bold text-slate-900 border-t pt-2"><span>{t('facture_total_ttc', "Total TTC")}</span><span className="text-blue-600">{totalTtc.toFixed(2)} DH</span></div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 text-white font-semibold rounded-xl">
                        {loading ? t('facture_create_loading_btn', "Création...") : t('facture_create_submit_btn', "Générer la facture")}
                    </button>
                </div>
            </form>

            {isClientModalOpen && (
                <ClientForm onSubmit={handleQuickClientSubmit} onClose={() => setIsClientModalOpen(false)} loading={submittingClient} />
            )}
        </>
    );
}