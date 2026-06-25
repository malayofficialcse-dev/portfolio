'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLogOut, FiSettings, FiCode, FiFileText, FiBook, FiAward, FiArrowRight, FiActivity, FiUser, FiBriefcase } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        const adminData = localStorage.getItem('admin');

        if (!token || !adminData) {
            router.push('/admin/login');
            return;
        }

        setAdmin(JSON.parse(adminData));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        router.push('/admin/login');
    };

    if (!mounted) return null;

    const sections = [
        {
            title: 'Identity Architecture',
            desc: 'Manage global bio and image',
            icon: FiUser,
            href: '/admin/profile',
            color: 'indigo'
        },
        {
            title: 'Arsenal of Skills',
            desc: 'Edit technical & theoretical stacks',
            icon: FiCode,
            href: '/admin/skills',
            color: 'blue'
        },
        {
            title: 'Project Ledger',
            desc: 'Chronicle your deployments',
            icon: FiFileText,
            href: '/admin/projects',
            color: 'purple'
        },
        {
            title: 'Scholarly Works',
            desc: 'Research & academic papers',
            icon: FiBook,
            href: '/admin/research',
            color: 'emerald'
        },
        {
            title: 'Library of Knowledge',
            desc: 'Curate books and chapters',
            icon: FiBook,
            href: '/admin/books',
            color: 'rose'
        },
        {
            title: 'Professional Journey',
            desc: 'Curate your career timeline',
            icon: FiBriefcase,
            href: '/admin/experiences',
            color: 'cyan'
        },
        {
            title: 'Hall of Merit',
            desc: 'Official industry credentials',
            icon: FiAward,
            href: '/admin/certificates',
            color: 'orange'
        },
        {
            title: 'Academic Matrix',
            desc: 'Journey, degrees & semester results',
            icon: FiBook,
            href: '/admin/academics',
            color: 'yellow'
        },
        {
            title: 'Event Archives',
            desc: 'Hackathons, workshops & sessions',
            icon: FiActivity,
            href: '/admin/events',
            color: 'red'
        }

    ];

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48 selection:bg-primary/30">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-10 mb-20 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center md:items-start"
                    >
                        <div className="flex items-center gap-3 text-primary mb-4">
                            <FiActivity className="animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.4em]">System Active</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2">Command Center</h1>
                        <p className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-sm">Welcome back, Architect {admin?.name?.split(' ')[0]}</p>
                    </motion.div>

                    <button
                        onClick={handleLogout}
                        className="group w-full md:w-auto px-8 py-5 bg-foreground/5 border border-border rounded-2xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        Terminal Signal: Logout
                        <FiLogOut className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                href={section.href}
                                className="group relative block h-[320px] premium-card overflow-hidden hover-lift border border-border bg-foreground/5"
                            >
                                {/* Decorative Pattern */}
                                <div className="absolute top-0 right-0 p-12 opacity-5 scale-[2] pointer-events-none group-hover:scale-[2.5] transition-transform duration-700">
                                    <section.icon className="text-9xl" />
                                </div>

                                <div className="relative h-full flex flex-col justify-between p-10 z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <section.icon size={32} />
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-black tracking-tight mb-3 group-hover:translate-x-2 transition-transform duration-500">{section.title}</h3>
                                        <p className="text-foreground/40 font-medium group-hover:text-white transition-colors duration-500">{section.desc}</p>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500 text-primary">
                                        Open Interface <FiArrowRight />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* System Stats Footer */}
                <div className="mt-20 pt-16 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-12 text-center opacity-40">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Memory Usage</p>
                        <p className="text-2xl font-black">2.4 GB</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Network Status</p>
                        <p className="text-2xl font-black">Optimized</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Encrypted</p>
                        <p className="text-2xl font-black">AES-256</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Uptime</p>
                        <p className="text-2xl font-black">99.9%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
