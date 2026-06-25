'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Project } from '@/types';
import { FiPlus, FiTrash2, FiEdit2, FiExternalLink, FiGithub, FiArrowLeft, FiSave, FiX, FiCamera, FiLayout, FiUpload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    const finalUrl = `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
    // console.log('Resolved Image URL:', finalUrl);
    return finalUrl;
};

const ProjectCard = ({ project, onEdit, onDelete }: { project: Project, onEdit: (p: Project) => void, onDelete: (id: string) => void }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    const images = project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls : [];

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 1) {
            setImgError(false);
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 1) {
            setImgError(false);
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col h-full bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Carousel Area */}
            <div className="relative aspect-video bg-black overflow-hidden">
                {images.length > 0 ? (
                    <AnimatePresence mode="wait">
                        {!imgError ? (
                            <motion.img
                                key={`${project._id}-${currentImageIndex}`}
                                src={resolveImageUrl(images[currentImageIndex])}
                                alt={project.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full object-cover"
                                onError={() => {
                                    console.error('Image load failed:', resolveImageUrl(images[currentImageIndex]));
                                    setImgError(true);
                                }}
                            />
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                className="w-full h-full flex flex-col items-center justify-center text-foreground/40 bg-zinc-900"
                            >
                                <FiCamera size={40} className="mb-2 opacity-50" />
                                <span className="text-[10px] font-mono">IMAGE LOAD FAILED</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/20">
                        <FiLayout size={40} />
                    </div>
                )}

                {/* Carousel Controls */}
                {images.length > 1 && isHovered && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-primary transition-colors backdrop-blur-sm z-10"
                        >
                            <FiChevronLeft size={16} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-primary transition-colors backdrop-blur-sm z-10"
                        >
                            <FiChevronRight size={16} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-3' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                    <button
                        onClick={() => onEdit(project)}
                        className="p-3 bg-white text-black rounded-lg hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-xl"
                        title="Edit Project"
                    >
                        <FiEdit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(project._id!)}
                        className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-xl"
                        title="Delete Project"
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold truncate pr-4 text-foreground">{project.title}</h3>
                    {project.featured && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary animate-pulse" title="Featured" />
                    )}
                </div>
                
                <p className="text-foreground/50 text-xs font-medium mb-4 line-clamp-3 leading-relaxed">
                    {project.description}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/10">
                                {t}
                            </span>
                        ))}
                        {project.technologies.length > 3 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-foreground/5 text-foreground/50 rounded-md">
                                +{project.technologies.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function AdminProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        description: '',
        technologies: [],
        projectUrl: '',
        githubUrl: '',
        featured: false,
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
        fetchProjects();
    }, [router]);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project: Project | null = null) => {
        if (project) {
            setEditingProject(project);
            setFormData(project);
            const imgs = project.imageUrls || [];
            setPreviews(imgs.map(img => resolveImageUrl(img)));
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                technologies: [],
                projectUrl: '',
                githubUrl: '',
                featured: false,
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
            Object.keys(formData).forEach(key => {
                const value = formData[key as keyof Project];
                if (key === 'technologies' && Array.isArray(value)) {
                    value.forEach(t => data.append('technologies[]', t));
                } else if (value !== undefined && key !== '_id' && !['imageUrls', 'pdfUrls', 'imageUrl'].includes(key)) {
                    data.append(key, value.toString());
                }
            });

            imageFiles.forEach(file => data.append('images', file));
            pdfFiles.forEach(file => data.append('pdfs', file));

            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, data);
            } else {
                await api.post('/projects', data);
            }
            fetchProjects();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground py-20 pb-48">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-primary hover:translate-x-[-4px] transition-all font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                            <FiArrowLeft /> Back to Command Center
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">Project Ledger</h1>
                        <p className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-xs">Chronicle of Strategic Deployments</p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="group flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <FiPlus className="text-lg group-hover:rotate-90 transition-transform" /> 
                        <span>New Deployment</span>
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <FiLayout size={60} className="mx-auto mb-4" />
                        <h3 className="text-xl font-bold">No Projects Deployed Yet</h3>
                        <p className="text-sm">Start by adding a new deployment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* CRUD Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            >
                                <div className="p-8 border-b border-border flex justify-between items-center bg-card/50">
                                    <h2 className="text-2xl font-black tracking-tight uppercase">
                                        {editingProject ? 'Modify Deployment' : 'New Strategic Move'}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                                        <FiX size={24} />
                                    </button>
                                </div>
                                
                                <div className="p-8 overflow-y-auto custom-scrollbar">
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">Project Assets</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                {previews.map((src, i) => (
                                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border relative group">
                                                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newPreviews = [...previews];
                                                                const removedUrl = newPreviews[i];
                                                                newPreviews.splice(i, 1);
                                                                setPreviews(newPreviews);
                                                                
                                                                // If it's a blobs/preview of a file we just added, remove from imageFiles
                                                                if (removedUrl.startsWith('data:') || removedUrl.startsWith('blob:')) {
                                                                    // We need to find which index in imageFiles this corresponds to
                                                                    // Since previews = [...existingImageUrls, ...newFilesPreviews]
                                                                    const existingCount = (formData.imageUrls || []).length;
                                                                    if (i >= existingCount) {
                                                                        const fileIndex = i - existingCount;
                                                                        const newFiles = [...imageFiles];
                                                                        newFiles.splice(fileIndex, 1);
                                                                        setImageFiles(newFiles);
                                                                    }
                                                                } else {
                                                                    // It's an existing URL, remove from formData.imageUrls
                                                                    const newUrls = (formData.imageUrls || []).filter(url => resolveImageUrl(url) !== removedUrl);
                                                                    setFormData({ ...formData, imageUrls: newUrls });
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <FiTrash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="aspect-square rounded-lg bg-foreground/5 border-2 border-dashed border-border flex flex-col gap-2 items-center justify-center hover:bg-foreground/10 hover:border-primary/50 transition-all cursor-pointer group">
                                                    <FiPlus size={24} className="opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                                    <span className="text-[10px] uppercase font-bold text-foreground/30">Add Image</span>
                                                    <input type="file" multiple className="hidden" onChange={handleImagesChange} accept="image/*" />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">Documentation (PDF)</label>
                                            <div className="relative h-20 group cursor-pointer">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="application/pdf"
                                                    onChange={(e) => e.target.files && setPdfFiles([...pdfFiles, ...Array.from(e.target.files)])}
                                                    className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                                />
                                                <div className="h-full border border-dashed border-border rounded-lg flex items-center justify-center gap-4 group-hover:bg-foreground/5 transition-all">
                                                    <FiUpload className="text-foreground/40" />
                                                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                                                        {pdfFiles.length > 0 ? `${pdfFiles.length} files selected` : 'Upload PDF Reports'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">Project Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-5 py-4 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold placeholder:text-foreground/20"
                                                placeholder="e.g. Quantum Analytics Dashboard"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-5 py-4 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold min-h-[120px] placeholder:text-foreground/20 resize-y"
                                                placeholder="Brief executive summary of the project..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">Tech Stack</label>
                                            <input
                                                type="text"
                                                value={formData.technologies?.join(', ')}
                                                onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(t => t.trim()) })}
                                                className="w-full px-5 py-4 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold placeholder:text-foreground/20"
                                                placeholder="React, Node, TypeScript..."
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">Status</label>
                                            <div className="flex items-center gap-4 h-[58px] px-5 rounded-lg bg-foreground/5 border border-border">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.featured}
                                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                    className="w-5 h-5 rounded accent-primary bg-transparent"
                                                />
                                                <span className="font-bold text-sm">Mark as Featured Project</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">Live URL</label>
                                            <div className="relative group">
                                                <FiExternalLink className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" />
                                                <input
                                                    type="url"
                                                    value={formData.projectUrl}
                                                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                                                    className="w-full pl-12 pr-5 py-4 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold placeholder:text-foreground/20"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-3">GitHub URL</label>
                                            <div className="relative group">
                                                <FiGithub className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" />
                                                <input
                                                    type="url"
                                                    value={formData.githubUrl}
                                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                                    className="w-full pl-12 pr-5 py-4 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold placeholder:text-foreground/20"
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="md:col-span-2 w-full py-5 bg-foreground text-background rounded-lg font-black text-lg hover:bg-primary hover:text-white transition-all shadow-xl mt-6 disabled:opacity-50"
                                        >
                                            {saving ? 'Processing...' : (editingProject ? 'Update Deployment' : 'Deploy Project')}
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
