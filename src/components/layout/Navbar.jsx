import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
            <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                <a href="#" className="text-xl font-bold tracking-tight text-stone-900 font-serif z-50 relative">
                    FORM<span className="font-sans font-normal text-stone-400">.Daily</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#how-it-works" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">How it works</a>
                    <a href="#stories" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">Stories</a>
                    <a href="#pricing" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">Membership</a>
                    <Button variant="primary" className="h-9 px-5 text-xs">Apply Now</Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-stone-900 z-50 relative p-2 -mr-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                    <a href="#how-it-works" className="text-2xl font-medium text-stone-900" onClick={() => setMobileMenuOpen(false)}>How it works</a>
                    <a href="#stories" className="text-2xl font-medium text-stone-900" onClick={() => setMobileMenuOpen(false)}>Stories</a>
                    <a href="#pricing" className="text-2xl font-medium text-stone-900" onClick={() => setMobileMenuOpen(false)}>Membership</a>
                    <Button variant="primary" className="w-64 text-lg py-4" onClick={() => setMobileMenuOpen(false)}>Apply Now</Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
