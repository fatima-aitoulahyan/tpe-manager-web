import React from 'react';

export default function Button({
                                   children,
                                   onClick,
                                   variant = 'primary',
                                   type = 'button',
                                   disabled = false,
                                   className = ''
                               }) {
    const baseStyle = "px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
        secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50",
        danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}