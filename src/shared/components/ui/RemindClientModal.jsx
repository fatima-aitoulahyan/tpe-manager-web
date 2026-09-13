import React from "react";
import { MessageCircle, Mail, X } from "lucide-react";

export default function RemindClientModal({
                                              docNumero,
                                              clientNom,
                                              telephone,
                                              email,
                                              montant,
                                              dateInfo,
                                              onClose,
                                          }) {
    const handleWhatsApp = () => {
        onClose();
        if (!telephone) return;

        const message = encodeURIComponent(
            `Bonjour ${clientNom},\n\nNous vous rappelons le document *${docNumero}* d'un montant de ${montant.toFixed(
                2
            )} MAD (${dateInfo}).`
        );

        let phone = telephone.replace(/\s/g, "").replace(/-/g, "");
        if (phone.startsWith("0")) phone = `+212${phone.substring(1)}`;

        window.open(`https://wa.me/${phone.replace("+", "")}?text=${message}`, "_blank");
    };

    const handleEmail = () => {
        onClose();
        if (!email) return;

        const subject = encodeURIComponent(`Rappel - ${docNumero}`);
        const body = encodeURIComponent(`Bonjour ${clientNom},\n\nNous vous rappelons le document ${docNumero}.`);

        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            "_blank"
        );
    };
    return (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-sm shadow-xl animate-slide-up">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="font-bold text-base text-slate-800">Relancer le client</h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                            {docNumero} — {clientNom}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-4 space-y-1">
                    <button
                        onClick={handleWhatsApp}
                        disabled={!telephone}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-left"
                    >
                        <MessageCircle size={20} className="text-[#25D366]" />
                        <div>
                            <p className="text-sm text-slate-800">Envoyer via WhatsApp</p>
                            <p className="text-xs text-slate-400">{telephone || "Aucun numéro"}</p>
                        </div>
                    </button>

                    <button
                        onClick={handleEmail}
                        disabled={!email}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-left"
                    >
                        <Mail size={20} className="text-blue-600" />
                        <div>
                            <p className="text-sm text-slate-800">Envoyer par Email</p>
                            <p className="text-xs text-slate-400">{email || "Aucune adresse"}</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}