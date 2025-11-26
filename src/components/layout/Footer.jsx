import React from 'react';

const Footer = () => (
    <footer className="bg-stone-50 py-12 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-lg font-bold font-serif text-stone-900">FORM<span className="font-sans font-normal text-stone-400">.Daily</span></span>
            <div className="text-sm text-stone-500">
                © {new Date().getFullYear()} FORM Daily. Oslo, Norway.
            </div>
        </div>
    </footer>
);

export default Footer;
