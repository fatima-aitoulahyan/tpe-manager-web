import React, { useEffect, useState } from 'react';
import { useClients } from '../../../core/hooks/useClients';
import ClientTable from '../components/ClientTable';
import ClientForm from '../components/ClientForm';
import { Plus, Search, Users, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function ClientsPage() {
    const { t, i18n } = useTranslation();
    const { fetchAll, create, update, remove, loading } = useClients();
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);



    const loadClients = async () => {
        try {
            const data = await fetchAll();
            setClients(data);
        } catch (err) {
            toast.error(t('clients_toast_load_error', "Impossible de charger le carnet de clients"));
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const filteredClients = clients.filter(c => {
        const query = searchQuery.toLowerCase();
        return (
            c.nom?.toLowerCase().includes(query) ||
            c.prenom?.toLowerCase().includes(query) ||
            c.nom_entreprise?.toLowerCase().includes(query)
        );
    });

    const handleOpenCreate = () => {
        setSelectedClient(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (client) => {
        setSelectedClient(client);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (selectedClient) {
                await update(selectedClient.id, formData);
                toast.success(t('clients_toast_updated', "Client mis à jour avec succès"));
            } else {
                await create(formData);
                toast.success(t('clients_toast_created', "Nouveau client enregistré !"));
            }
            setIsFormOpen(false);
            loadClients();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('clients_confirm_delete', "Êtes-vous sûr de vouloir supprimer ce client ? Cela peut impacter vos devis et factures associés."))) {
            try {
                await remove(id);
                toast.success(t('clients_toast_deleted', "Client dissocié avec succès"));
                loadClients();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-1 relative">


            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-10 sm:pt-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Users size={24} className="text-blue-600" /> {t('clients_title', "Annuaire des clients")}
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {t('clients_subtitle', "Gérez les profils clients et les coordonnées de vos partenaires.")}
                    </p>
                </div>
                <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto">
                    <Plus size={16} /> {t('clients_add_btn', "Ajouter un client")}
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('clients_search_placeholder', "Rechercher par nom, entreprise...")}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl p-2.5 pl-10 focus:outline-none focus:border-blue-600 shadow-sm transition-colors"
                />
            </div>

            {/* Main Data Render */}
            {loading && clients.length === 0 ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <ClientTable
                    clients={filteredClients}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Modal Form Dialog */}
            {isFormOpen && (
                <ClientForm
                    initialData={selectedClient}
                    onSubmit={handleFormSubmit}
                    onClose={() => setIsFormOpen(false)}
                    loading={loading}
                />
            )}
        </div>
    );
}