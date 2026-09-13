import React from 'react';

export default function Card({ title, children, className = '' }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}