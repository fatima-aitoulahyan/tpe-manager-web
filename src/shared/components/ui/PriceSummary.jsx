import React from 'react';

export default function PriceSummary({ ht, tva, ttc, tauxTva }) {
    return (
        <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-100">
            <div className="flex justify-between text-slate-500"><span>Total HT</span><span>{ht} MAD</span></div>
            <div className="flex justify-between text-slate-500"><span>TVA ({tauxTva}%)</span><span>{tva} MAD</span></div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200/60 pt-2 text-base">
                <span>Total TTC</span><span className="text-blue-600">{ttc} MAD</span>
            </div>
        </div>
    );
}