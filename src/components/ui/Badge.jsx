import React from 'react';

const Badge = ({ children, className = '' }) => (
    <span className={`inline-block px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold text-stone-600 tracking-wide uppercase mb-6 ${className}`}>
        {children}
    </span>
);

export default Badge;
