'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit3, FiSave, FiX, FiBriefcase, FiArrowLeft, FiImage, FiFileText, FiUpload, FiLayers, FiLink, FiGithub, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';

interface ExperienceProject {
    title: string;
    description: string;
    githubLink?: string;
    deployedLink?: string;
    images: string[];
}

interface Experience {
    _id?: string;
    company: string;
    role: string;
    joinDate: string;
    endDate?: string;
    isCurrent: boolean;
    documentUrls: string[];
    stipend?: string;
    skills: Array<{ name: string; iconUrl?: string }>;
    projects: ExperienceProject[];
    imageUrls?: string[];
}

export default function AdminExperiences() {
    const router = useRouter();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [formData, setFormData] = useState<Experience>({
        company: '',
        role: '',
        joinDate: '',
        endDate: '',
        isCurrent: false,
        stipend: '',
        skills: [],
        documentUrls: [],
        projects: [],
        imageUrls: []
    });

    // File states
    const [documents, setDocuments] = useState<File[]>([]);
    const [mainImages, setMainImages] = useState<File[]>([]);
    const [projectImagesMap, setProjectImagesMap] = useState<{ [key: number]: File[] }>({});
    const [skillIcons, setSkillIcons] = useState<File[]>([]);

    const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';

    const fetchExperiences = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/experiences`);
            setExperiences(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchExperiences();
    }, [router]);

    const handleOpenModal = (exp: Experience | null = null) => {
        if (exp) {
            setEditingExp(exp);
            setFormData({
                ...exp,
                joinDate: exp.joinDate.split('T')[0],
                endDate: exp.endDate ? exp.endDate.split('T')[0] : ''
            });
        } else {
            setEditingExp(null);
            setFormData({
                company: '',
                role: '',
                joinDate: '',
                endDate: '',
                isCurrent: false,
                stipend: '',
                skills: [],
                documentUrls: [],
                projects: []
            });
        }
        setDocuments([]);
        setMainImages([]);
        setProjectImagesMap({});
        setSkillIcons([]);
        setIsModalOpen(true);
    };

    const handleAddProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, { title: '', description: '', githubLink: '', deployedLink: '', images: [] }]
        });
    };

    const handleRemoveProject = (index: number) => {
        const updatedProjects = formData.projects.filter((_, i) => i !== index);
        setFormData({ ...formData, projects: updatedProjects });
    };

    const handleProjectChange = (index: number, field: string, value: string) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index] = { ...updatedProjects[index], [field]: value };
        setFormData({ ...formData, projects: updatedProjects });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();

            data.append('company', formData.company);
            data.append('role', formData.role);
            data.append('joinDate', formData.joinDate);
            data.append('isCurrent', String(formData.isCurrent));
            if (formData.endDate && !formData.isCurrent) data.append('endDate', formData.endDate);
            if (formData.stipend) data.append('stipend', formData.stipend);
            data.append('skills', JSON.stringify(formData.skills));

            // Filter out empty projects and keep track of their original indices to map images
            const projectsWithOriginalIndices = formData.projects
                .map((p, originalIdx) => ({ ...p, originalIdx }))
                .filter(p => p.title.trim() !== '' && p.description.trim() !== '');

            const validProjects = projectsWithOriginalIndices.map(({ originalIdx, ...p }) => p);
            data.append('projects', JSON.stringify(validProjects));

            documents.forEach((doc) => data.append('documents', doc));

            // Append images per project using the NEW index in the filtered array
            projectsWithOriginalIndices.forEach((p, newIdx) => {
                const files = projectImagesMap[p.originalIdx];
                if (files && files.length > 0) {
                    files.forEach(file => data.append(`project_${newIdx}_images`, file));
                }
            });

            mainImages.forEach((file) => data.append('images', file));

            skillIcons.forEach((file, i) => data.append(`skill_icon_${i}`, file));

            if (editingExp) {
                await axios.put(`${API_BASE_URL}/api/experiences/${editingExp._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/experiences`, data, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                });
            }

            setIsModalOpen(false);
            fetchExperiences();
        } catch (error) {
            console.error('Error saving experience:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/experiences/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExperiences();
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-10 mb-16 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 hover:translate-x-[-4px] transition-transform">
                            <FiArrowLeft /> Back to Command Center
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-2">Expertise Ledger</h1>
                        <p className="text-foreground/40 font-black uppercase tracking-[0.2em] text-xs">Architecting your professional narrative</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-foreground text-background rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                        <FiPlus size={18} /> Deploy New Milestone
                    </button>
                </div>

                {/* Experiences List */}
                <div className="grid grid-cols-1 gap-8">
                    {experiences.map((exp) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="premium-card p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 group hover:border-primary/50 bg-foreground/5 border-border"
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <FiBriefcase size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase mb-1">{exp.role}</h3>
                                    <p className="text-xl font-black text-foreground/40 uppercase tracking-widest">{exp.company}</p>
                                    <div className="flex gap-4 mt-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">
                                            {new Date(exp.joinDate).toLocaleDateString()} — {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleOpenModal(exp)}
                                    className="w-14 h-14 bg-foreground/5 border border-border flex items-center justify-center rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg"
                                >
                                    <FiEdit3 size={24} />
                                </button>
                                <button
                                    onClick={() => exp._id && handleDelete(exp._id)}
                                    className="w-14 h-14 bg-foreground/5 border border-border flex items-center justify-center rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                >
                                    <FiTrash2 size={24} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                            ></motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                className="bg-card border border-border rounded-[3rem] w-full max-w-4xl p-10 md:p-16 relative z-10 shadow-3xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-center mb-16">
                                    <div>
                                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">
                                            {editingExp ? 'Refine' : 'Initialize'} <span className="text-primary">Milestone</span>
                                        </h2>
                                        <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-all border border-border">
                                        <FiX size={32} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Corporation / Entity</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full bg-foreground/5 border border-border rounded-2xl px-8 py-5 focus:border-primary outline-none font-bold placeholder:text-foreground/20 transition-all shadow-sm"
                                                placeholder="e.g. Google DeepMind"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Designation / Role</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-foreground/5 border border-border rounded-2xl px-8 py-5 focus:border-primary outline-none font-bold placeholder:text-foreground/20 transition-all shadow-sm"
                                                placeholder="e.g. Identity Architect"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Deployment Date (Join)</label>
                                            <input
                                                required
                                                type="date"
                                                value={formData.joinDate}
                                                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                                className="w-full bg-foreground/5 border border-border rounded-2xl px-8 py-5 focus:border-primary outline-none font-bold transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Termination Date (Leave)</label>
                                            <div className="flex gap-4 items-center">
                                                <input
                                                    disabled={formData.isCurrent}
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    className="w-full bg-foreground/5 border border-border rounded-2xl px-8 py-5 focus:border-primary outline-none font-bold transition-all shadow-sm disabled:opacity-20"
                                                />
                                                <label className="flex items-center gap-3 cursor-pointer min-w-max">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isCurrent}
                                                        onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                                        className="w-6 h-6 rounded-lg bg-primary text-primary"
                                                    />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Till Now</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Stipend / Package (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.stipend}
                                            onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                                            className="w-full bg-foreground/5 border border-border rounded-2xl px-8 py-5 focus:border-primary outline-none font-bold placeholder:text-foreground/20 transition-all shadow-sm"
                                            placeholder="e.g. $5000 / Month"
                                        />
                                    </div>

                                    {/* Main Experience Images */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Artifact Imagery (Main Experience Carousel)</label>
                                        <div className="relative h-48 group cursor-pointer">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => e.target.files && setMainImages([...mainImages, ...Array.from(e.target.files)])}
                                                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                            />
                                            <div className="h-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-all">
                                                <FiImage className="text-foreground/20 mb-3 group-hover:text-primary" size={32} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center px-6">
                                                    {mainImages.length > 0 ? `${mainImages.length} images staged` : (formData.imageUrls?.length ? 'Existing images present (Replace?)' : 'Upload Workplace/Team Photos')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Uploads */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Credential Vault (Multiple PDFs)</label>
                                        <div className="relative h-48 group cursor-pointer">
                                            <input
                                                type="file"
                                                multiple
                                                accept="application/pdf"
                                                onChange={(e) => e.target.files && setDocuments([...documents, ...Array.from(e.target.files)])}
                                                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                            />
                                            <div className="h-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-all">
                                                <FiUpload className="text-foreground/20 mb-3 group-hover:text-primary" size={32} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center px-6">
                                                    {documents.length > 0 ? `${documents.length} documents staged` : (editingExp?.documentUrls?.length ? 'Existing documents present (Change?)' : 'Upload Academic/Professional Artifacts')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Neural Stack (Skills - enter separated by commas)</label>
                                        <input
                                            type="text"
                                            value={formData.skills.map(s => s.name).join(', ')}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => ({ name: s.trim() })) })}
                                            className="w-full bg-foreground/5 border border-border rounded-2xl px-8 py-5 focus:border-primary outline-none font-bold placeholder:text-foreground/20 transition-all shadow-sm"
                                            placeholder="e.g. Next.js, TypeScript, Docker"
                                        />
                                    </div>

                                    {/* Skill Icons Upload */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 px-2">Neural Stack Icons (Upload in same order as skills)</label>
                                        <div className="relative h-24 group cursor-pointer">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => e.target.files && setSkillIcons([...skillIcons, ...Array.from(e.target.files)])}
                                                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                            />
                                            <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-4 group-hover:bg-primary/5 group-hover:border-primary/30 transition-all">
                                                <FiImage className="text-foreground/20 group-hover:text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center px-4">
                                                    {skillIcons.length > 0 ? `${skillIcons.length} icons staged` : 'Upload Skill Logos'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Projects Section */}
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Project Contributions</h4>
                                            <button
                                                type="button"
                                                onClick={handleAddProject}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:translate-x-2 transition-transform"
                                            >
                                                <FiPlus /> Append Project
                                            </button>
                                        </div>

                                        <div className="space-y-10">
                                            {formData.projects.map((proj, idx) => (
                                                <div key={idx} className="p-10 bg-foreground/5 rounded-[2.5rem] border border-border space-y-8 relative group/card">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveProject(idx)}
                                                        className="absolute top-8 right-8 text-foreground/20 hover:text-red-500 transition-colors"
                                                    >
                                                        <FiTrash2 size={20} />
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-foreground/20">Project Identifier</label>
                                                            <input
                                                                type="text"
                                                                value={proj.title}
                                                                onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                                                                className="w-full bg-card border border-border rounded-xl px-6 py-4 focus:border-primary outline-none font-bold text-sm"
                                                                placeholder="Project Title"
                                                            />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-foreground/20">Project Description</label>
                                                            <input
                                                                type="text"
                                                                value={proj.description}
                                                                onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                                                                className="w-full bg-card border border-border rounded-xl px-6 py-4 focus:border-primary outline-none font-bold text-sm"
                                                                placeholder="Brief scope/impact"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-foreground/20 flex items-center gap-2">
                                                                <FiGithub /> Repository Link
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={proj.githubLink}
                                                                onChange={(e) => handleProjectChange(idx, 'githubLink', e.target.value)}
                                                                className="w-full bg-card border border-border rounded-xl px-6 py-4 focus:border-primary outline-none font-bold text-sm"
                                                                placeholder="https://github.com/..."
                                                            />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-foreground/20 flex items-center gap-2">
                                                                <FiExternalLink /> Live Deployment
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={proj.deployedLink}
                                                                onChange={(e) => handleProjectChange(idx, 'deployedLink', e.target.value)}
                                                                className="w-full bg-card border border-border rounded-xl px-6 py-4 focus:border-primary outline-none font-bold text-sm"
                                                                placeholder="https://..."
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/20 text-primary">Artifact Imagery (Evidence for this project)</label>
                                                        <div className="relative h-24 group cursor-pointer">
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files) {
                                                                        setProjectImagesMap(prev => ({
                                                                            ...prev,
                                                                            [idx]: [...(prev[idx] || []), ...Array.from(e.target.files!)]
                                                                        }));
                                                                    }
                                                                }}
                                                                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                                            />
                                                            <div className="h-full border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-4 group-hover:bg-primary/5 group-hover:border-primary/30 transition-all">
                                                                <FiImage className="text-foreground/20 group-hover:text-primary" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                                                    {projectImagesMap[idx]?.length > 0
                                                                        ? `${projectImagesMap[idx].length} images selected`
                                                                        : (proj.images?.length ? 'Existing images present (Replace?)' : 'Select Screenshots')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-10 flex gap-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 flex items-center justify-center gap-4 bg-foreground text-background py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-white active:scale-95 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiSave size={20} /> {loading ? 'Processing...' : 'Establish Terminal Milestone'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 flex items-center justify-center gap-4 bg-foreground/[0.05] border border-border py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                        >
                                            <FiArrowLeft size={20} /> Abort Operation
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
