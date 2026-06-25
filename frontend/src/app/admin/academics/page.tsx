'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Academic } from '@/types';
import { FiPlus, FiTrash2, FiEdit2, FiArrowLeft, FiSave, FiX, FiUpload, FiDownload, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import Link from 'next/link';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function AdminAcademicsPage() {
    const router = useRouter();
    const [academics, setAcademics] = useState<Academic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAcademic, setEditingAcademic] = useState<Academic | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Academic>>({
        institution: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        semesterResults: []
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [degreeFile, setDegreeFile] = useState<File | null>(null);
    const [regFile, setRegFile] = useState<File | null>(null);
    const [semesterFiles, setSemesterFiles] = useState<{ [key: string]: File }>({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchAcademics();
    }, [router]);

    const fetchAcademics = async () => {
        try {
            const response = await api.get('/academics');
            setAcademics(response.data);
        } catch (error) {
            console.error('Error fetching academics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (academic: Academic | null = null) => {
        if (academic) {
            setEditingAcademic(academic);
            setFormData({
                ...academic,
                startDate: academic.startDate ? new Date(academic.startDate).toISOString().split('T')[0] : '',
                endDate: academic.endDate ? new Date(academic.endDate).toISOString().split('T')[0] : ''
            });
        } else {
            setEditingAcademic(null);
            setFormData({
                institution: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                location: '',
                description: '',
                semesterResults: []
            });
        }
        setLogoFile(null);
        setImageFiles([]);
        setDegreeFile(null);
        setRegFile(null);
        setSemesterFiles({});
        setIsModalOpen(true);
    };

    const addSemester = () => {
        const results = [...(formData.semesterResults || [])];
        results.push({ semester: `Semester ${results.length + 1}`, gpa: 0 });
        setFormData({ ...formData, semesterResults: results });
    };

    const updateSemester = (index: number, field: string, value: any) => {
        const results = [...(formData.semesterResults || [])];
        results[index] = { ...results[index], [field]: value };
        setFormData({ ...formData, semesterResults: results });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                const value = (formData as any)[key];
                if (key === 'semesterResults') {
                    data.append('semesterResults', JSON.stringify(value));
                } else if (value !== undefined && key !== '_id' && !['logoUrl', 'imageUrls', 'degreeCertificateUrl', 'registrationCertificateUrl'].includes(key)) {
                    data.append(key, value.toString());
                }
            });

            if (logoFile) data.append('logo', logoFile);
            imageFiles.forEach(file => data.append('images', file));
            if (degreeFile) data.append('degreeCertificate', degreeFile);
            if (regFile) data.append('registrationCertificate', regFile);
            
            Object.keys(semesterFiles).forEach(key => {
                data.append(key, semesterFiles[key]);
            });

            if (editingAcademic) {
                await api.put(`/academics/${editingAcademic._id}`, data);
            } else {
                await api.post('/academics', data);
            }
            fetchAcademics();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving academic record:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this record?')) {
            try {
                await api.delete(`/academics/${id}`);
                fetchAcademics();
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-16">
                    <div>
                        <Link href="/admin/dashboard" className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                            <FiArrowLeft /> Dashboard
                        </Link>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">Academic Ledger</h1>
                    </div>
                    <button onClick={() => handleOpenModal()} className="px-8 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:scale-105 transition-transform">
                        Add New Journey
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {academics.map((academic) => (
                        <div key={academic._id} className="p-8 rounded-3xl bg-white/5 border border-white/5 group hover:border-primary/40 transition-all">
                            <h3 className="text-2xl font-black uppercase mb-2">{academic.institution}</h3>
                            <p className="text-primary font-bold text-xs uppercase mb-6 tracking-widest">{academic.degree}</p>
                            <div className="flex gap-4">
                                <button onClick={() => handleOpenModal(academic)} className="p-3 rounded-lg bg-white/10 hover:bg-primary hover:text-black transition-all">
                                    <FiEdit2 />
                                </button>
                                <button onClick={() => handleDelete(academic._id!)} className="p-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-card border border-border rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
                                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                    <h2 className="text-2xl font-black uppercase">Configure Academic Module</h2>
                                    <button onClick={() => setIsModalOpen(false)}><FiX size={24} /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-4">Institution Name</label>
                                                <input type="text" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" required />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-4">Degree & Major</label>
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="w-1/2 bg-white/5 border border-white/10 p-4 rounded-xl" required />
                                                    <input type="text" placeholder="Major" value={formData.major} onChange={(e) => setFormData({...formData, major: e.target.value})} className="w-1/2 bg-white/5 border border-white/10 p-4 rounded-xl" required />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-4">Institution Logo</label>
                                                <input type="file" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" accept="image/*" />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-4">Duration & Location</label>
                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl" required />
                                                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl" />
                                                </div>
                                                <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" required />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-4">Core Files (PDF)</label>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                                                        <span className="text-[9px] uppercase font-black w-24">Degree:</span>
                                                        <input type="file" onChange={(e) => setDegreeFile(e.target.files?.[0] || null)} className="text-[9px]" accept=".pdf" />
                                                    </div>
                                                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                                                        <span className="text-[9px] uppercase font-black w-24">Registration:</span>
                                                        <input type="file" onChange={(e) => setRegFile(e.target.files?.[0] || null)} className="text-[9px]" accept=".pdf" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-4">Description</label>
                                        <textarea 
                                            value={formData.description} 
                                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl h-32 resize-none" 
                                            placeholder="Describe your academic experience, achievements, research focus, etc."
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-6">Gallery Images (Carousel)</label>
                                        <input type="file" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" accept="image/*" />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20">Semester Milestones</label>
                                            <button type="button" onClick={addSemester} className="text-primary flex items-center gap-2 text-[10px] font-black uppercase"><FiPlusCircle /> Add Semester</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {formData.semesterResults?.map((sem, idx) => (
                                                <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <input type="text" value={sem.semester} onChange={(e) => updateSemester(idx, 'semester', e.target.value)} className="bg-transparent font-black uppercase text-primary outline-none" />
                                                        <input type="number" step="0.01" value={sem.gpa} onChange={(e) => updateSemester(idx, 'gpa', parseFloat(e.target.value))} className="bg-white/5 border border-white/10 p-2 rounded-lg w-20 text-center" placeholder="GPA" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[8px] font-black uppercase opacity-20">Marksheet</span>
                                                            <input type="file" onChange={(e) => setSemesterFiles(prev => ({...prev, [`marksheet_${idx}`]: e.target.files![0]}))} className="text-[8px]" accept=".pdf" />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[8px] font-black uppercase opacity-20">Certificate</span>
                                                            <input type="file" onChange={(e) => setSemesterFiles(prev => ({...prev, [`certificate_${idx}`]: e.target.files![0]}))} className="text-[8px]" accept=".pdf" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" disabled={saving} className="w-full py-6 bg-primary text-black font-black uppercase rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50">
                                        {saving ? 'Transmitting Data...' : 'Save Academic Record'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
