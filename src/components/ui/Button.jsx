import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-stone-900 text-white hover:bg-stone-800 hover:shadow-lg border border-transparent",
        secondary: "bg-white text-stone-900 border border-stone-200 hover:border-stone-900 hover:bg-stone-50",
        text: "bg-transparent text-stone-600 hover:text-stone-900 px-0 hover:bg-transparent"
    };

    return (
        <button
            className={cn(baseStyle, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
