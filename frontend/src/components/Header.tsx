'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiArrowRight, FiHexagon } from 'react-icons/fi';

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/experience', label: 'Experience' },
        { href: '/skills', label: 'Skills' },
        { href: '/projects', label: 'Projects' },
        { href: '/research', label: 'Research' },
        { href: '/books', label: 'Books' },
        { href: '/academic', label: 'Academics' },
        { href: '/events', label: 'Events' },
        { href: '/certificates', label: 'Certificates' },
    ];

    if (!mounted) return null;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled
                ? 'py-4 bg-background/60 backdrop-blur-2xl border-b border-foreground/5 shadow-2xl'
                : 'py-8 bg-transparent'
                }`}
        >
            <nav className="container mx-auto px-6">
                <div className="flex flex-row items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="group relative flex items-center gap-4">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <FiHexagon className="absolute inset-0 text-foreground/10 w-full h-full transform group-hover:rotate-90 transition-transform duration-700" />
                                <span className="relative text-foreground font-black text-2xl tracking-tighter">M</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold tracking-tighter block leading-none text-foreground uppercase">Malay</span>
                                <span className="text-[8px] font-bold tracking-[0.5em] uppercase opacity-40 block mt-1 text-foreground transition-all group-hover:tracking-[0.6em]">Architecture</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center p-1 bg-foreground/[0.03] backdrop-blur-xl rounded-[2px] border border-foreground/5">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-6 py-2.5 rounded-[2px] text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:text-foreground ${isActive
                                        ? 'text-background'
                                        : 'text-foreground/40 hover:text-foreground'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-bg"
                                            className="absolute inset-0 bg-foreground rounded-[2px] -z-10 shadow-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Utility & Mobile Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-10 h-10 md:w-11 md:h-11 rounded-[2px] bg-foreground/5 border border-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-all active:scale-95"
                        >
                            {theme === 'dark' ? (
                                <FiSun className="w-4 h-4 text-primary" />
                            ) : (
                                <FiMoon className="w-4 h-4 text-foreground/60" />
                            )}
                        </button>

                        <Link
                            href="mailto:maitymalay27747@gmail.com"
                            className="hidden md:flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-[2px] font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10"
                        >
                            Connect <FiArrowRight className="text-primary" />
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-10 h-10 rounded-[2px] flex items-center justify-center transition-all bg-foreground text-background"
                        >
                            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="lg:hidden absolute top-full left-0 right-0 p-6 z-50"
                        >
                            <div className="bg-background/95 backdrop-blur-3xl rounded-[2px] p-8 border border-foreground/10 shadow-3xl space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between text-xl font-bold px-6 py-4 hover:bg-foreground/5 rounded-[2px] transition-all text-foreground"
                                    >
                                        <span className="uppercase tracking-tighter italic">{link.label}</span>
                                        <FiArrowRight className="text-primary opacity-40" />
                                    </Link>
                                ))}
                                <div className="pt-6 border-t border-foreground/5">
                                    <Link
                                        href="mailto:maitymalay27747@gmail.com"
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-slate-900 rounded-[2px] font-bold uppercase tracking-widest text-xs"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Initiate Liaison <FiArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
