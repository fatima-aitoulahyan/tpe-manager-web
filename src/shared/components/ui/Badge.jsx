import React from 'react';

export default function Badge({ children, variant = 'gray' }) {
    const variants = {
        gray: 'bg-gray-100 text-gray-700',
        blue: 'bg-blue-100 text-blue-700',
        green: 'bg-green-100 text-green-700',
        orange: 'bg-orange-100 text-orange-700',
        red: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant] || variants.gray}`}>
            {children}
        </span>
    );
}