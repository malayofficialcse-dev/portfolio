'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check if already logged in
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                identity: formData.username,
                password: formData.password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('admin', JSON.stringify(response.data.admin));
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Unauthorized Access Denied');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background text-foreground">
            {/* Animated Gradient Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-lg px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass-effect p-12 rounded-[2.5rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden bg-card"
                >
                    {/* Security Icon Badge */}
                    <div className="flex justify-center mb-10">
                        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transform p-1">
                            <div className="w-full h-full bg-black/20 rounded-2xl flex items-center justify-center">
                                <FiShield className="text-4xl text-white" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-center mb-2 tracking-tight">
                        Access Portal
                    </h1>
                    <p className="text-center text-foreground/50 mb-10 font-medium">
                        Secure Authentication Required
                    </p>

                    <AnimatePresence mode='wait'>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 mb-3 ml-1">Identity</label>
                            <div className="relative group">
                                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-foreground/5 border border-border focus:outline-none focus:border-primary focus:bg-foreground/[0.08] transition-all text-foreground placeholder:text-foreground/20 font-medium"
                                    placeholder="Username or Email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 mb-3 ml-1">Security Key</label>
                            <div className="relative group">
                                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-14 pr-14 py-5 rounded-2xl bg-foreground/5 border border-border focus:outline-none focus:border-primary focus:bg-foreground/[0.08] transition-all text-foreground placeholder:text-foreground/20 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative py-5 rounded-2xl bg-foreground text-background font-black text-lg hover:bg-primary hover:text-white transition-all duration-500 active:scale-[0.98] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-primary/40"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? 'Validating...' : (
                                    <>
                                        Authorize Access
                                        <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Subtle Footer */}
                    <div className="mt-12 pt-8 border-t border-border text-center">
                        <p className="text-xs font-bold text-foreground/20 uppercase tracking-[0.3em]">
                            End-to-End Encryption Enabled
                        </p>
                    </div>
                </motion.div>

                <p className="mt-8 text-center text-foreground/20 text-sm font-medium">
                    Protected by Advanced Guard System
                </p>
            </div>
        </div>
    );
}
