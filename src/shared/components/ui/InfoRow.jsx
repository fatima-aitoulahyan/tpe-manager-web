import React from 'react';

export default function InfoRow({ icon, label, text }) {
    return (
        <div className="flex gap-3 py-2 text-slate-600 text-sm items-center">
            {icon}
            {label && <span className="font-medium text-slate-700">{label} :</span>}
            <span className="text-slate-600">{text}</span>
        </div>
    );
}