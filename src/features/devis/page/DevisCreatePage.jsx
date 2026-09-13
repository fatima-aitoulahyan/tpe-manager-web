import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevis } from '../../../core/hooks/useDevis';
import { useClients } from '../../../core/hooks/useClients';
import LigneDevisForm from '../components/LigneDevisForm';
import ClientForm from '../../clients/components/ClientForm';
import { ArrowLeft, Trash2, Sparkles, Loader2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ClientSelector from "../../../shared/components/form/ClientSelect.jsx";

export default function DevisCreatePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { create, loading, generateFromText } = useDevis();
    const { fetchAll: fetchClients, create: createClient } = useClients();

    // Clients states
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [submittingClient, setSubmittingClient] = useState(false);
    const [prefillClientName, setPrefillClientName] = useState('');

    const [clientId, setClientId] = useState('');
    const [dateValidite, setDateValidite] = useState('');
    const [tva, setTva] = useState(20);
    const [modePaiement, setModePaiement] = useState('VIREMENT');
    const [conditions, setConditions] = useState('');
    const [lignes, setLignes] = useState([]);

    // ── IA : génération à partir de texte libre ──
    const [aiText, setAiText] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(true);


    const loadClients = async (selectNewClientId = null) => {
        try {
            const data = await fetchClients();
            setClients(data);
            if (selectNewClientId) {
                setClientId(selectNewClientId);
            }
        } catch (err) {
            toast.error(t('devis_create_toast_error_clients', "Erreur lors du chargement des clients"));
        } finally {
            setLoadingClients(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleQuickClientSubmit = async (clientFormData) => {
        setSubmittingClient(true);
        try {
            const newClient = await createClient(clientFormData);
            toast.success(t('devis_create_toast_client_success', "Client {{nom}} créé avec succès !").replace('{{nom}}', newClient.nom));
            setIsClientModalOpen(false);
            setPrefillClientName('');
            await loadClients(newClient.id);
        } catch (err) {
            toast.error(err.message || t('devis_create_toast_client_error', "Échec de la création du client"));
        } finally {
            setSubmittingClient(false);
        }
    };

    // ── Génération IA ──
    const handleGenerateAi = async () => {
        if (!aiText.trim()) {
            return toast.error(t('devis_create_toast_ai_empty', "Décrivez le devis à générer"));
        }

        setAiLoading(true);
        try {
            const devisGenere = await generateFromText(aiText);

            // Pré-remplissage du formulaire avec le devis créé par l'IA
            setClientId(String(devisGenere.client));
            setConditions(devisGenere.conditions || '');
            setModePaiement(devisGenere.mode_paiement || 'VIREMENT');
            setTva(devisGenere.taux_tva ?? 20);

            const lignesGenerees = (devisGenere.lignes || []).map(l => ({
                libelle: l.libelle,
                quantite: parseFloat(l.quantite),
                prix_unitaire: parseFloat(l.prix_unitaire),
            }));
            setLignes(lignesGenerees);

            toast.success(t('devis_create_toast_ai_success', "Devis généré ! Vérifiez les informations avant de l'émettre."));
            setShowAiPanel(false);

            // Le devis a déjà été créé côté backend par l'IA (statut BROUILLON).
            // On redirige directement dessus plutôt que de le recréer.
            navigate(`/devis/${devisGenere.id}`);

        } catch (err) {
            if (err.status === 404 && err.payload?.client_nom_detecte) {
                // Client non trouvé : on propose de l'ajouter directement
                setPrefillClientName(err.payload.client_nom_detecte);
                setIsClientModalOpen(true);
                toast.error(
                    t('devis_create_toast_client_not_found', "Client \"{{nom}}\" introuvable. Ajoutez-le pour continuer.").replace('{{nom}}', err.payload.client_nom_detecte)
                );
            } else {
                toast.error(err.message || t('devis_create_toast_ai_error', "Erreur lors de la génération IA"));
            }
        } finally {
            setAiLoading(false);
        }
    };

    const totalHt = lignes.reduce((sum, l) => sum + (l.prix_unitaire * l.quantite), 0);
    const totalTtc = totalHt * (1 + tva / 100);
    const aujourdhui = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clientId) return toast.error(t('devis_create_error_client', "Sélectionnez un client"));
        if (!dateValidite) return toast.error(t('devis_create_error_date', "Date de validité requise"));
        if (lignes.length === 0) return toast.error(t('devis_create_error_lignes', "Ajoutez au moins une prestation"));

        try {
            await create({
                client: parseInt(clientId),
                date_validite: dateValidite,
                taux_tva: parseFloat(tva),
                mode_paiement: modePaiement,
                conditions,
                lignes
            });
            toast.success(t('devis_create_toast_success', "Devis créé !"));
            navigate('/devis');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-1 relative">


                <div className="flex items-center gap-3 pt-10 sm:pt-0">
                    <button type="button" onClick={() => navigate('/devis')} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{t('devis_create_title', "Nouveau Devis")}</h1>
                        <p className="text-slate-500 text-sm mt-0.5">{t('devis_create_subtitle', "Enregistrez une nouvelle proposition commerciale.")}</p>
                    </div>
                </div>

                {/* ── Panneau génération IA ── */}
                {showAiPanel && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-blue-600" />
                            <h2 className="text-sm font-semibold text-slate-900">{t('devis_ai_title', "Générer avec l'IA")}</h2>
                        </div>
                        <p className="text-xs text-slate-500">
                            {t('devis_ai_desc', "Décrivez le devis en langage naturel (client, prestations, montants) et laissez l'IA le préremplir.")}
                        </p>
                        <textarea
                            value={aiText}
                            onChange={e => setAiText(e.target.value)}
                            rows="3"
                            placeholder={t('devis_ai_placeholder', "Ex : Devis pour Ahmed Bennani, installation électrique 3 prises à 150 DH chacune, paiement à 30 jours")}
                            className="w-full text-sm bg-white border border-blue-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleGenerateAi}
                                disabled={aiLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {aiLoading ? (
                                    <><Loader2 size={16} className="animate-spin" /> {t('devis_ai_loading', "Génération...")}</>
                                ) : (
                                    <><Sparkles size={16} /> {t('devis_ai_btn', "Générer le devis")}</>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            {loadingClients ? (
                                <div className="text-xs font-medium text-slate-400 animate-pulse mt-6">{t('devis_clients_loading', "Chargement des clients...")}</div>
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
                            <label className="block text-xs font-medium text-slate-700 mb-1">{t('devis_label_validite', "Valable jusqu'au")}</label>
                            <input
                                type="date"
                                required
                                min={aujourdhui}
                                value={dateValidite}
                                onChange={e => setDateValidite(e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">{t('devis_label_tva', "Taux TVA (%)")}</label>
                            <input type="number" value={tva} onChange={e => setTva(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">{t('devis_label_paiement', "Mode de règlement")}</label>
                            <select value={modePaiement} onChange={e => setModePaiement(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none">
                                <option value="VIREMENT">{t('devis_pay_virement', "Virement")}</option>
                                <option value="ESPECES">{t('devis_pay_especes', "Espèces")}</option>
                                <option value="MOBILE_MONEY">{t('devis_pay_mobile', "Mobile Money")}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">{t('devis_label_prestations', "Prestations ajoutées")}</label>
                        <LigneDevisForm onAdd={(l) => setLignes([...lignes, l])} />
                    </div>

                    {lignes.length > 0 && (
                        <div className="border border-slate-100 rounded-xl overflow-hidden mt-3 text-sm">
                            {lignes.map((l, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50/50 border-b border-slate-100 last:border-none">
                                    <div>
                                        <p className="font-medium text-slate-900">{l.libelle}</p>
                                        <p className="text-xs text-slate-400">{l.quantite} × {l.prix_unitaire.toFixed(2)} DH</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">{(l.quantite * l.prix_unitaire).toFixed(2)} DH</span>
                                        <button type="button" onClick={() => setLignes(lignes.filter((_, i) => i !== index))} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">{t('devis_label_conditions', "Conditions particulières (Optionnel)")}</label>
                        <textarea value={conditions} onChange={e => setConditions(e.target.value)} rows="2" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"></textarea>
                    </div>

                    {/* Résumé Financier */}
                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-100">
                        <div className="flex justify-between text-slate-500"><span>{t('devis_total_ht', "Total HT")}</span><span>{totalHt.toFixed(2)} DH</span></div>
                        <div className="flex justify-between text-slate-500"><span>{t('devis_tva', "TVA")} ({tva}%)</span><span>{(totalTtc - totalHt).toFixed(2)} DH</span></div>
                        <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200/60 pt-2 text-base"><span>{t('devis_total_ttc', "Total TTC")}</span><span className="text-blue-600">{totalTtc.toFixed(2)} DH</span></div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                        {loading ? t('devis_submitting', "Création...") : t('devis_submit_btn', "Émettre le devis")}
                    </button>
                </div>
            </form>

            {isClientModalOpen && (
                <ClientForm
                    initialData={prefillClientName ? { nom: prefillClientName } : undefined}
                    onSubmit={handleQuickClientSubmit}
                    onClose={() => {
                        setIsClientModalOpen(false);
                        setPrefillClientName('');
                    }}
                    loading={submittingClient}
                />
            )}
        </>
    );
}