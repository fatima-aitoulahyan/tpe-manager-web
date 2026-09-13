import React from 'react';

const Spinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div
                className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-indigo-200 border-t-indigo-600`}
            />
        </div>
    );
};

export default Spinner;