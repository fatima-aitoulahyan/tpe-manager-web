import React from 'react';

export default function ActionButton({ icon, text, onClick, primary, danger }) {
    return (
        <button
            onClick={onClick}
            className={`w-full h-12 rounded-xl mb-3 flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-sm ${
                primary ? "bg-blue-600 text-white hover:bg-blue-700" :
                    danger ? "bg-white border border-red-200 text-red-600 hover:bg-red-50" :
                        "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
        >
            {icon} {text}
        </button>
    );
}