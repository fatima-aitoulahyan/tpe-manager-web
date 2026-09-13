import React from 'react';

export default function Section({ title, children }) {
    return (
        <div className="mb-6">
            <h3 className="font-bold text-slate-800 mb-3 text-base">{title}</h3>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                {children}
            </div>
        </div>
    );
}