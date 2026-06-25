'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { FiUser, FiMail, FiLock, FiStar, FiArrowRight, FiShield } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('admin', JSON.stringify(response.data.admin));
            router.push('/admin/dashboard');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#050505]">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full"></div>

            <div className="w-full max-w-xl px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-effect p-12 rounded-[2.5rem] border border-white/10 shadow-2xl"
                >
                    <div className="flex justify-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
                            <FiShield className="text-4xl text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-center mb-2 tracking-tight">Create <span className="gradient-text">Architect</span></h1>
                    <p className="text-center text-white/40 mb-10 font-medium">Initialize Administrative Access</p>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Display Name</label>
                            <div className="relative group">
                                <FiStar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                    placeholder="Malay Maity"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Username</label>
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                    placeholder="admin"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Official Email</label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Secret Key (Password)</label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 group relative py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-indigo-500 hover:text-white transition-all duration-500 active:scale-95 shadow-xl"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? 'Initializing...' : (
                                    <>
                                        Authorize New Admin
                                        <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <Link href="/admin/login" className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                            Already Have Access? <span className="text-indigo-400">Login Here</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
