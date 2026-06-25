'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Certificate } from '@/types';
import { FiPlus, FiTrash2, FiEdit2, FiArrowLeft, FiSave, FiX, FiAward, FiExternalLink, FiCamera, FiFileText } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminCertificatesPage() {
    const router = useRouter();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certificate | null>(null);
    const [formData, setFormData] = useState<Partial<Certificate>>({
        title: '',
        issuingOrganization: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        skills: []
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchCertificates();
    }, [router]);

    const fetchCertificates = async () => {
        try {
            const response = await api.get('/certificates');
            setCertificates(response.data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cert: Certificate | null = null) => {
        if (cert) {
            setEditingCert(cert);
            setFormData(cert);
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
            const img = cert.imageUrl;
            setImagePreview(img ? (img.startsWith('http') ? img : `${baseURL}${img}`) : null);
        } else {
            setEditingCert(null);
            setFormData({
                title: '',
                issuingOrganization: '',
                credentialId: '',
                credentialUrl: '',
                description: '',
                skills: []
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setPdfFile(null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                const value = formData[key as keyof Certificate];
                if (key === 'skills' && Array.isArray(value)) {
                    value.forEach(s => data.append('skills[]', s));
                } else if (value !== undefined && key !== '_id' && key !== 'imageUrl' && key !== 'pdfUrl') {
                    data.append(key, value.toString());
                }
            });

            if (imageFile) data.append('imageUrl', imageFile);
            if (pdfFile) data.append('pdfUrl', pdfFile);

            if (editingCert) {
                await api.put(`/certificates/${editingCert._id}`, data);
            } else {
                await api.post('/certificates', data);
            }
            fetchCertificates();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving certificate:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this certificate?')) {
            try {
                await api.delete(`/certificates/${id}`);
                fetchCertificates();
            } catch (error) {
                console.error('Error deleting certificate:', error);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-all font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                            <FiArrowLeft /> Back to Command Center
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter gradient-text uppercase">Hall of Merit</h1>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
                    >
                        <FiPlus className="text-lg" /> New Credential
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="premium-card p-0 group overflow-hidden flex flex-col h-full bg-foreground/5 border-border"
                        >
                            <div className="relative aspect-video bg-foreground/5 overflow-hidden">
                                {cert.imageUrl ? (
                                    <img src={cert.imageUrl.startsWith('http') ? cert.imageUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${cert.imageUrl}`} alt={cert.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                        <FiAward size={80} />
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 flex justify-end gap-3">
                                    <button onClick={() => handleOpenModal(cert)} className="p-3 bg-foreground text-background rounded-xl hover:bg-primary hover:text-white transition-all">
                                        <FiEdit2 />
                                    </button>
                                    <button onClick={() => handleDelete(cert._id!)} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                                <h3 className="text-2xl font-black mb-2 truncate uppercase tracking-tight">{cert.title}</h3>
                                <p className="text-primary text-xs font-black uppercase tracking-widest mb-6">{cert.issuingOrganization}</p>
                                <div className="flex flex-wrap gap-2 mt-auto justify-center md:justify-start">
                                    {cert.skills.slice(0, 3).map((s, i) => (
                                        <span key={i} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-foreground/10 rounded-md text-foreground/40">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-background/90 backdrop-blur-md" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-4xl bg-card border border-border rounded-[2.5rem] shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-12">
                                    <div className="flex justify-between items-center mb-10">
                                        <h2 className="text-4xl font-black tracking-tighter">
                                            {editingCert ? 'Modify Credential' : 'Record New Merit'}
                                        </h2>
                                        <button onClick={() => setIsModalOpen(false)} className="p-4 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-all">
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Credential Evidence (Badge/Certificate)</label>
                                            <div className="relative group aspect-video w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-foreground/5 border border-border flex items-center justify-center">
                                                {imagePreview ? (
                                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                ) : <FiCamera size={40} className="opacity-20" />}
                                                <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/60 transition-all cursor-pointer">
                                                    <FiPlus size={32} />
                                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Official Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Organization of Issuance</label>
                                            <input
                                                type="text"
                                                value={formData.issuingOrganization}
                                                onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                                                className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Summary of Achievement</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold min-h-[100px]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Assessed Skills (Comma Separated)</label>
                                            <input
                                                type="text"
                                                value={formData.skills?.join(', ')}
                                                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                                                className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Credential Identifier</label>
                                            <input
                                                type="text"
                                                value={formData.credentialId}
                                                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                                                className="w-full px-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Verification Link</label>
                                            <div className="relative group">
                                                <FiExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" />
                                                <input
                                                    type="url"
                                                    value={formData.credentialUrl}
                                                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                                                    className="w-full pl-16 pr-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Digital Payload (PDF)</label>
                                            <div className="relative group">
                                                <FiFileText className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" />
                                                <input
                                                    type="file"
                                                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                                    className="w-full pl-16 pr-6 py-4 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                    accept="application/pdf"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="md:col-span-2 w-full py-5 bg-foreground text-background rounded-2xl font-black text-xl hover:bg-primary hover:text-white transition-all shadow-2xl mt-6 disabled:opacity-50"
                                        >
                                            {saving ? 'Validating Credential...' : 'Commit to Hall of Merit'}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
