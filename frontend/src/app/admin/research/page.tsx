'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { ResearchPaper } from '@/types';
import { FiPlus, FiTrash2, FiEdit2, FiArrowLeft, FiSave, FiX, FiFileText, FiLink, FiUser, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    const finalUrl = `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
    return finalUrl;
};

export default function AdminResearchPage() {
    const router = useRouter();
    const [papers, setPapers] = useState<ResearchPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null);
    const [formData, setFormData] = useState<Partial<ResearchPaper>>({
        title: '',
        authors: [],
        abstract: '',
        journal: '',
        conference: '',
        doi: '',
        externalLinks: [],
        keywords: [],
        imageUrls: [],
        pdfUrls: []
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchPapers();
    }, [router]);

    const fetchPapers = async () => {
        try {
            const response = await api.get('/research');
            setPapers(response.data);
        } catch (error) {
            console.error('Error fetching papers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (paper: ResearchPaper | null = null) => {
        if (paper) {
            setEditingPaper(paper);
            setFormData(paper);
            const imgs = paper.imageUrls || [];
            setPreviews(imgs.map(img => resolveImageUrl(img)));
        } else {
            setEditingPaper(null);
            setFormData({
                title: '',
                authors: [],
                abstract: '',
                journal: '',
                conference: '',
                doi: '',
                externalLinks: [],
                keywords: [],
                imageUrls: [],
                pdfUrls: []
            });
            setPreviews([]);
        }
        setImageFiles([]);
        setPdfFiles([]);
        setIsModalOpen(true);
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setImageFiles([...imageFiles, ...files]);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            (Object.keys(formData) as Array<keyof ResearchPaper>).forEach(key => {
                const value = formData[key];
                if (key === 'externalLinks' && Array.isArray(value)) {
                    data.append('externalLinks', JSON.stringify(value));
                } else if (Array.isArray(value)) {
                    value.forEach(v => {
                        if (typeof v === 'string') {
                            data.append(`${key}[]`, v);
                        }
                    });
                } else if (value !== undefined && key !== '_id' && !['imageUrls', 'pdfUrls'].includes(key)) {
                    data.append(key, value.toString());
                }
            });

            imageFiles.forEach(file => data.append('images', file));
            pdfFiles.forEach(file => data.append('pdfs', file));

            if (editingPaper) {
                await api.put(`/research/${editingPaper._id}`, data);
            } else {
                await api.post('/research', data);
            }
            fetchPapers();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving paper:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this publication?')) {
            try {
                await api.delete(`/research/${id}`);
                fetchPapers();
            } catch (error) {
                console.error('Error deleting paper:', error);
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
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter gradient-text uppercase">Academic Registry</h1>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
                        style={{ borderRadius: '2px' }}
                    >
                        <FiPlus className="text-lg" /> New Publication
                    </button>
                </div>

                <div className="space-y-6">
                    {papers.map((paper) => (
                        <motion.div
                            key={paper._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-card p-10 flex flex-col md:flex-row items-center gap-10 group text-center md:text-left shadow-lg border border-border"
                            style={{ borderRadius: '2px' }}
                        >
                            <div className="w-16 h-16 bg-foreground/5 flex items-center justify-center text-primary" style={{ borderRadius: '2px' }}>
                                <FiFileText size={32} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-2xl font-black mb-3 truncate group-hover:text-primary transition-colors uppercase tracking-tight">{paper.title}</h3>
                                <div className="flex flex-wrap gap-4 text-xs font-bold text-foreground/30 uppercase tracking-widest justify-center md:justify-start">
                                    <span className="flex items-center gap-2"><FiUser /> {paper.authors.join(', ')}</span>
                                    {paper.journal && <span className="flex items-center gap-2"><FiFileText /> {paper.journal}</span>}
                                    {paper.publicationDate && <span className="flex items-center gap-2"><FiCalendar /> {new Date(paper.publicationDate).getFullYear()}</span>}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => handleOpenModal(paper)} className="p-4 bg-foreground/5 text-foreground/60 hover:bg-foreground hover:text-background transition-all" style={{ borderRadius: '2px' }}>
                                    <FiEdit2 />
                                </button>
                                <button onClick={() => handleDelete(paper._id!)} className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all" style={{ borderRadius: '2px' }}>
                                    <FiTrash2 />
                                </button>
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
                                className="relative w-full max-w-4xl bg-card border border-border shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
                                style={{ borderRadius: '2px' }}
                            >
                                <div className="p-12">
                                    <div className="flex justify-between items-center mb-10">
                                        <h2 className="text-4xl font-black tracking-tighter">
                                            {editingPaper ? 'Modify Entry' : 'New Publication Record'}
                                        </h2>
                                        <button onClick={() => setIsModalOpen(false)} className="p-4 bg-foreground/5 hover:bg-foreground/10 transition-all" style={{ borderRadius: '2px' }}>
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Supporting Visuals (Images)</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                {previews.map((src, i) => (
                                                    <div key={i} className="aspect-video overflow-hidden border border-border relative group bg-black/40" style={{ borderRadius: '2px' }}>
                                                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newPreviews = [...previews];
                                                                const removedUrl = newPreviews[i];
                                                                newPreviews.splice(i, 1);
                                                                setPreviews(newPreviews);
                                                                
                                                                if (removedUrl.startsWith('data:') || removedUrl.startsWith('blob:')) {
                                                                    const existingCount = (formData.imageUrls || []).length;
                                                                    if (i >= existingCount) {
                                                                        const fileIndex = i - existingCount;
                                                                        const newFiles = [...imageFiles];
                                                                        newFiles.splice(fileIndex, 1);
                                                                        setImageFiles(newFiles);
                                                                    }
                                                                } else {
                                                                    const newUrls = (formData.imageUrls || []).filter(url => resolveImageUrl(url) !== removedUrl);
                                                                    setFormData({ ...formData, imageUrls: newUrls });
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                            style={{ borderRadius: '2px' }}
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="aspect-video bg-foreground/5 border-2 border-dashed border-border flex flex-col gap-2 items-center justify-center hover:bg-foreground/10 hover:border-primary transition-all cursor-pointer group" style={{ borderRadius: '2px' }}>
                                                    <FiPlus size={24} className="opacity-40 group-hover:opacity-100 group-hover:text-primary" />
                                                    <span className="text-[10px] uppercase font-black text-foreground/20">Inject Visual</span>
                                                    <input type="file" multiple className="hidden" onChange={handleImagesChange} accept="image/*" />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Research Artifacts (PDFs)</label>
                                            <div className="space-y-3">
                                                {pdfFiles.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-foreground/5 border border-border" style={{ borderRadius: '2px' }}>
                                                        <div className="flex items-center gap-3">
                                                            <FiFileText className="text-primary" />
                                                            <span className="text-xs font-bold truncate max-w-[200px]">{file.name}</span>
                                                        </div>
                                                        <button type="button" onClick={() => setPdfFiles(pdfFiles.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-600">
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(formData.pdfUrls || []).map((url, i) => (
                                                    <div key={`existing-${i}`} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20" style={{ borderRadius: '2px' }}>
                                                        <div className="flex items-center gap-3">
                                                            <FiFileText className="text-primary" />
                                                            <span className="text-xs font-bold truncate max-w-[200px]">Existing: {url.split('/').pop()}</span>
                                                        </div>
                                                        <button type="button" onClick={() => setFormData({ ...formData, pdfUrls: formData.pdfUrls?.filter((_, idx) => idx !== i) })} className="text-red-500 hover:text-red-600">
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border hover:bg-foreground/5 cursor-pointer transition-all" style={{ borderRadius: '2px' }}>
                                                    <FiPlus className="text-foreground/20" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-foreground/20">Annex PDF Data</span>
                                                    <input type="file" multiple accept="application/pdf" className="hidden" onChange={(e) => setPdfFiles([...pdfFiles, ...Array.from(e.target.files || [])])} />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Publication Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                style={{ borderRadius: '2px' }}
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Abstract Ledger</label>
                                            <textarea
                                                value={formData.abstract}
                                                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                                                className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold min-h-[150px]"
                                                style={{ borderRadius: '2px' }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Authors (Comma Separated)</label>
                                            <input
                                                type="text"
                                                value={formData.authors?.join(', ')}
                                                onChange={(e) => setFormData({ ...formData, authors: e.target.value.split(',').map(a => a.trim()) })}
                                                className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                style={{ borderRadius: '2px' }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Journal/Conference</label>
                                            <input
                                                type="text"
                                                value={formData.journal || formData.conference}
                                                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                                                className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                style={{ borderRadius: '2px' }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">DOI</label>
                                            <input
                                                type="text"
                                                value={formData.doi}
                                                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                                                className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                style={{ borderRadius: '2px' }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">Keywords (Comma Separated)</label>
                                            <input
                                                type="text"
                                                value={formData.keywords?.join(', ')}
                                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value.split(',').map(k => k.trim()) })}
                                                className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                                                style={{ borderRadius: '2px' }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="md:col-span-2 w-full py-5 bg-foreground text-background font-black text-xl hover:bg-primary hover:text-white transition-all shadow-2xl mt-6 disabled:opacity-50"
                                            style={{ borderRadius: '2px' }}
                                        >
                                            {saving ? 'Transmitting Data...' : 'Finalize Archival'}
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
