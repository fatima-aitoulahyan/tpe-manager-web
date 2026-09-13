import React, { useEffect, useState, useCallback, useRef } from "react";
import { Eye, EyeOff, Plus, Trash2, X, Globe, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useCashflow } from "../../../core/hooks/useCashflow";
import TransactionTable from "../components/TransactionTable";
import CashflowBarChart from "../components/CashflowBarChart";
import CashflowPieChart from "../components/CashflowPieChart";
import TransactionForm from "../components/TransactionForm";
import { Section, ConfirmModal } from "../../../shared/components/ui";

export default function CashflowPage() {
    const { t, i18n } = useTranslation();
    const currency = i18n.language === 'ar' ? 'د.م.' : 'DH';

    const TABS = [
        { key: null, label: t("cashflow_tab_all", "Tout") },
        { key: "RECETTE", label: t("cashflow_tab_income", "Recettes") },
        { key: "DEPENSE", label: t("cashflow_tab_expense", "Dépenses") },
    ];

    const {
        dashboard,
        transactions,
        hasMore,
        loading,
        loadingMore,
        fetchDashboard,
        fetchTransactions,
        loadMore,
        addTransaction,
        deleteTransaction,
        deleteMultiple,
    } = useCashflow();

    const [activeTab, setActiveTab] = useState(null);
    const [isBalanceVisible, setIsBalanceVisible] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const debounceRef = useRef(null);

    const refreshAll = useCallback(() => {
        fetchDashboard();
        fetchTransactions({ type: activeTab, search: searchQuery });
    }, [fetchDashboard, fetchTransactions, activeTab, searchQuery]);

    useEffect(() => {
        refreshAll();
    }, [activeTab, searchQuery]);

    // Debounce de la saisie de recherche (400ms)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [searchInput]);

    const handleClearSearch = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setSearchInput("");
        setSearchQuery("");
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleAddTransaction = async (data) => {
        await addTransaction(data);
        toast.success(
            data.type === "RECETTE"
                ? t("cashflow_toast_income", "Paiement enregistré ✓")
                : t("cashflow_toast_expense", "Dépense enregistrée ✓")
        );
        refreshAll();
    };

    const handleDeleteOne = async (id) => {
        try {
            await deleteTransaction(id);
            toast.success(t("cashflow_toast_deleted", "Transaction supprimée"));
            fetchDashboard();
        } catch (err) {
            toast.error(err.message || t("cashflow_toast_error", "Erreur lors de la suppression"));
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await deleteMultiple(selectedIds);
            toast.success(`${selectedIds.length} ${t("cashflow_toast_deleted_multiple", "transaction(s) supprimée(s)")}`);
            setSelectedIds([]);
            fetchDashboard();
        } catch (err) {
            toast.error(err.message || t("cashflow_toast_error", "Erreur lors de la suppression"));
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const recettesMois = Number(dashboard?.recettes_mois ?? dashboard?.recettesMois ?? 0);
    const depensesMois = Number(dashboard?.depenses_mois ?? dashboard?.depensesMois ?? 0);
    const solde = Number(dashboard?.solde ?? 0);

    return (
        <div className="bg-slate-50 min-h-screen p-6 max-w-5xl mx-auto relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl text-slate-800">
                    {selectedIds.length > 0
                        ? `${selectedIds.length} ${t("cashflow_selected", "sélectionné(s)")}`
                        : t("cashflow_title", "Trésorerie")}
                </h1>

                {selectedIds.length > 0 ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedIds([])}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                        >
                            <X size={18} />
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-sm hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} /> {t("cashflow_new_btn", "Nouvelle transaction")}
                    </button>
                )}
            </div>

            <Section title={t("cashflow_section_summary", "Résumé financier")}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">
                        {t("cashflow_available_balance", "Solde disponible")}
                    </span>
                    <button
                        onClick={() => setIsBalanceVisible((v) => !v)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        {isBalanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-5">
                    {isBalanceVisible
                        ? `${solde.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
                        : `•••••• ${currency}`}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CashflowBarChart recettes={recettesMois} depenses={depensesMois} />
                    <CashflowPieChart recettes={recettesMois} depenses={depensesMois} />
                </div>
            </Section>

            {/* Barre de recherche */}
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t("cashflow_search_placeholder", "Rechercher (description, catégorie, montant, date, facture)...")}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchInput && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="flex gap-2 mb-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === tab.key
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                    {t("cashflow_loading", "Chargement...")}
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                    {searchQuery
                        ? t("cashflow_no_search_results", "Aucun résultat pour cette recherche")
                        : t("cashflow_no_transactions", "Aucune transaction")}
                </div>
            ) : (
                <>
                    <TransactionTable
                        transactions={transactions}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelect}
                        onDelete={handleDeleteOne}
                    />

                    {hasMore && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => loadMore({ type: activeTab, search: searchQuery })}
                                disabled={loadingMore}
                                className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                {loadingMore ? t("cashflow_loading", "Chargement...") : t("cashflow_load_more", "Charger plus")}
                            </button>
                        </div>
                    )}
                </>
            )}

            {showForm && (
                <TransactionForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handleAddTransaction}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    title={t("cashflow_delete_modal_title", "Suppression multiple")}
                    message={`${t("cashflow_delete_modal_msg_prefix", "Voulez-vous vraiment supprimer les")} ${selectedIds.length} ${t("cashflow_delete_modal_msg_suffix", "transaction(s) sélectionnée(s) ?")}`}
                    confirmLabel={t("cashflow_delete_confirm_btn", "Supprimer")}
                    danger
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDeleteSelected}
                />
            )}
        </div>
    );
}