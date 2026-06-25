'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Profile } from '@/types';
import { FiSave, FiArrowLeft, FiCamera, FiUser, FiGlobe, FiMail, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile>({
        name: '',
        title: '',
        bio: '',
        description: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        twitter: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchProfile();
    }, [router]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            setProfile(response.data);
            if (response.data.profileImage) {
                const img = response.data.profileImage;
                const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
                setImagePreview(img.startsWith('http') ? img : `${baseURL}${img}`);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            console.log('[FRONTEND] Starting Profile Update');
            const data = new FormData();

            // Core data
            data.append('name', profile.name || '');
            data.append('title', profile.title || '');
            data.append('bio', profile.bio || '');
            data.append('description', profile.description || '');
            data.append('email', profile.email || '');
            data.append('phone', profile.phone || '');
            data.append('location', profile.location || '');
            data.append('website', profile.website || '');
            data.append('github', profile.github || '');
            data.append('linkedin', profile.linkedin || '');
            data.append('twitter', profile.twitter || '');

            if (imageFile) {
                console.log('[FRONTEND] Attaching image file:', imageFile.name, imageFile.size, 'bytes');
                data.append('profileImage', imageFile);
            } else {
                console.log('[FRONTEND] No new image file selected');
            }

            const response = await api.put('/profile', data);

            console.log('[FRONTEND] Update response:', response.data);
            setProfile(response.data.profile);
            setMessage({ type: 'success', text: 'Identity Architecture Updated Successfully' });
            setImageFile(null);
        } catch (error: any) {
            console.error('[FRONTEND] Update error:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Evolutionary Update Failed' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48">
            <div className="container mx-auto px-6 max-w-6xl">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-10 mb-16 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start">
                            <Link
                                href="/admin/dashboard"
                                className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-all font-bold uppercase tracking-[0.2em] text-[10px] mb-6"
                            >
                                <FiArrowLeft /> Back to Command Center
                            </Link>
                            <h1 className="text-5xl md:text-7xl font-black gradient-text tracking-tighter uppercase whitespace-nowrap">My Identity</h1>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <><FiSave className="text-lg" /> Sync Changes</>
                            )}
                        </button>
                    </div>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-12 p-6 rounded-2xl border flex items-center gap-4 font-bold ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}
                        >
                            <FiCheckCircle size={24} />
                            {message.text}
                        </motion.div>
                    )}

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left Sidebar - Profile & Socials */}
                        <div className="lg:col-span-4 space-y-12">
                            {/* Avatar Card */}
                            <div className="premium-card p-10 text-center relative group">
                                <div className="relative w-48 h-48 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-[2.5rem] rotate-6 transform transition-transform group-hover:rotate-12 duration-500 shadow-2xl opacity-50"></div>
                                    <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden border-4 border-foreground/5 shadow-inner bg-foreground/5">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl font-black opacity-20">
                                                {profile.name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-4 -right-4 w-14 h-14 bg-foreground text-background rounded-2xl flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all shadow-2xl">
                                        <FiCamera size={24} />
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                                <h2 className="text-2xl font-black mb-1">{profile.name || 'Set Your Name'}</h2>
                                <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">{profile.title || 'Set Your Title'}</p>
                            </div>

                            {/* Social Links Card */}
                            <div className="premium-card p-10">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                                    <FiGlobe /> Digital Footprint
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { icon: FiGithub, label: 'GitHub', key: 'github', placeholder: 'https://github.com/...' },
                                        { icon: FiLinkedin, label: 'LinkedIn', key: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
                                        { icon: FiTwitter, label: 'Twitter', key: 'twitter', placeholder: 'https://twitter.com/...' },
                                        { icon: FiGlobe, label: 'Website', key: 'website', placeholder: 'https://...' },
                                    ].map((item) => (
                                        <div key={item.key}>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">{item.label}</label>
                                            <div className="relative group">
                                                <item.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-foreground transition-all" />
                                                <input
                                                    type="url"
                                                    value={(profile[item.key as keyof Profile] as any) || ''}
                                                    onChange={(e) => setProfile({ ...profile, [item.key]: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary/50 transition-all text-sm font-bold"
                                                    placeholder={item.placeholder}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Main Info */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Personal Details */}
                            <div className="premium-card p-12">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-10 border-b border-foreground/5 pb-6">Core Statistics</h3>
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Professional Signature</label>
                                        <input
                                            type="text"
                                            value={profile.name || ''}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary/50 transition-all font-bold"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Architectural Title</label>
                                        <input
                                            type="text"
                                            value={profile.title || ''}
                                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                            className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary/50 transition-all font-bold"
                                            placeholder="e.g. Lead System Architect"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Secretariat Email</label>
                                        <input
                                            type="email"
                                            value={profile.email || ''}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary/50 transition-all font-bold"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Operational Base</label>
                                        <input
                                            type="text"
                                            value={profile.location || ''}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary/50 transition-all font-bold"
                                            placeholder="City, Nation"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio & Narrative */}
                            <div className="premium-card p-12">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-10 border-b border-foreground/5 pb-6">Executive Summary</h3>
                                <div className="space-y-10">
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Elevator Pitch (Bio)</label>
                                        <textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary/50 transition-all font-bold resize-none"
                                            placeholder="Summarize your existence in code..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 block mb-3">Comprehensive Narrative (Description)</label>
                                        <textarea
                                            value={profile.description}
                                            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                            rows={8}
                                            className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary/50 transition-all font-bold"
                                            placeholder="Detail your professional evolution and specialized expertise..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
