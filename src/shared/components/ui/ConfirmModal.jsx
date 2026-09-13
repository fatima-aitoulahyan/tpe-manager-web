import React from 'react';

export default function ConfirmModal({ title, message, confirmLabel, danger, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <h3 className="font-bold text-lg text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-6">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className={`flex-1 h-11 rounded-xl font-semibold text-sm text-white ${danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}