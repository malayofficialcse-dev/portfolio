'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin, FiDownload, FiExternalLink, FiGithub, FiLayers, FiFileText, FiDollarSign, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';

interface ExperienceProject {
    title: string;
    description: string;
    githubLink?: string;
    deployedLink?: string;
    images: string[];
}

interface Experience {
    _id: string;
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

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ImageCarousel = ({ images, title, API_BASE_URL }: { images: string[], title: string, API_BASE_URL: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (images.length <= 1 || isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length, isPaused]);

    const nextImage = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className="relative aspect-video rounded-[2px] overflow-hidden group/carousel border border-foreground/10 bg-black/20 touch-pan-y"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={resolveImageUrl(images[currentIndex])}
                    alt={`${title} - Artifact ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Navigation Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-[2px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-primary transition-all duration-300 z-30"
                    >
                        <FiChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-[2px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-primary transition-all duration-300 z-30"
                    >
                        <FiChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-30">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                                className={`h-1 rounded-[2px] transition-all duration-300 ${i === currentIndex ? 'w-4 md:w-6 bg-primary' : 'w-1.5 md:w-2 bg-white/30 hover:bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 z-20">
                <a
                    href={resolveImageUrl(images[currentIndex])}
                    download
                    className="w-12 h-12 rounded-[2px] bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                    <FiDownload size={20} />
                </a>
            </div>
        </div>
    );
};


export default function ExperiencePage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
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
        fetchExperiences();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-[2px]"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-[2px] border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-24 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-[2px] blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-[2px] blur-[140px] -z-10"></div>

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="max-w-4xl mb-24 mx-auto text-center md:text-left flex flex-col items-center md:items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-4 px-6 py-3 bg-primary/10 border border-primary/20 rounded-[2px] mb-8"
                    >
                        <FiBriefcase className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Professional Timeline</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-10 leading-none"
                    >
                        Career <span className="text-primary italic">Trajectory</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl text-foreground/40 font-medium leading-relaxed max-w-2xl mx-auto md:mx-0"
                    >
                        Chronicle of my engineering journey—bridging the gap between conceptual architecture and industrial-grade performance.
                    </motion.p>
                </div>

                {/* Experience Timeline */}
                <div className="space-y-32">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="premium-card p-10 md:p-16 border-foreground/5 hover:border-primary/50 transition-all group overflow-hidden">
                                {/* Decorative Index */}
                                <div className="absolute -top-10 -right-10 text-[200px] font-black text-foreground/[0.02] pointer-events-none group-hover:text-primary/[0.05] transition-colors">
                                    0{index + 1}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
                                    {/* LEFT COLUMN: Identity & Credentials */}
                                    <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">

                                        {/* Company & Role Meta */}
                                        <div className="flex flex-col items-center md:items-start gap-6 mb-8">
                                            <div className="w-20 h-20 bg-primary rounded-[2px] flex items-center justify-center text-white shadow-2xl shadow-primary/30 rotate-3">
                                                <FiBriefcase size={40} />
                                            </div>
                                            <div>
                                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight group-hover:text-primary transition-colors">{exp.role}</h2>
                                                <p className="text-xl font-black text-foreground/40 uppercase tracking-[0.3em] mt-2">{exp.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-16">
                                            <div className="flex items-center gap-3 px-6 py-3 bg-foreground/5 rounded-[2px] border border-foreground/5 backdrop-blur-sm">
                                                <FiCalendar className="text-primary" />
                                                <span className="text-[11px] font-black uppercase tracking-widest opacity-60">
                                                    {formatDate(exp.joinDate)} — {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'N/A'}
                                                </span>
                                            </div>
                                            {exp.stipend && (
                                                <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 rounded-[2px] border border-emerald-500/20 backdrop-blur-sm">
                                                    <FiDollarSign className="text-emerald-500" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500">{exp.stipend} Stipend</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Main Experience Carousel */}
                                        {exp.imageUrls && exp.imageUrls.length > 0 && (
                                            <div className="w-full mb-16">
                                                <ImageCarousel 
                                                    images={exp.imageUrls} 
                                                    title={exp.company} 
                                                    API_BASE_URL={API_BASE_URL} 
                                                />
                                            </div>
                                        )}

                                        {/* Credential Vault */}
                                        {exp.documentUrls && exp.documentUrls.length > 0 && (
                                            <div className="w-full space-y-8 mb-16">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 text-center md:text-left mb-8">Credential Vault</h4>
                                                <div className="grid grid-cols-1 gap-8">
                                                    {exp.documentUrls.map((docUrl: string, dIdx: number) => (
                                                        <div key={dIdx} className="group/doc relative bg-foreground/[0.03] border border-foreground/5 rounded-[2px] overflow-hidden hover:border-primary/30 transition-all duration-500">
                                                            {/* PDF Preview Snippet */}
                                                            <div className="h-40 w-full bg-white/5 relative overflow-hidden pointer-events-none opacity-40 group/doc:opacity-60 transition-opacity">
                                                                <iframe
                                                                    src={`${resolveImageUrl(docUrl)}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                    className="w-full h-[800px] border-none scale-100 origin-top"
                                                                    title={`Preview ${dIdx}`}
                                                                ></iframe>
                                                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                                                            </div>

                                                            {/* Content Info */}
                                                            <div className="p-6 flex items-center justify-between gap-4 relative z-10 bg-background/60 backdrop-blur-md border-t border-foreground/5">
                                                                <div className="flex items-center justify-start gap-4 min-w-0 text-left">
                                                                    <div className="w-12 h-12 bg-primary/10 rounded-[2px] flex items-center justify-center text-primary shrink-0">
                                                                        <FiFileText size={20} />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground truncate">Artifact_{dIdx + 1}.pdf</p>
                                                                        <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/30">Application/PDF Repository</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => setSelectedLetter(resolveImageUrl(docUrl))}
                                                                        className="w-10 h-10 bg-foreground text-background rounded-[2px] flex items-center justify-center hover:bg-primary transition-all active:scale-90"
                                                                    >
                                                                        <FiExternalLink size={16} />
                                                                    </button>
                                                                    <a
                                                                        href={resolveImageUrl(docUrl)}
                                                                        download
                                                                        className="w-10 h-10 bg-foreground/5 rounded-[2px] border border-foreground/10 hover:border-primary/50 text-primary flex items-center justify-center transition-all"
                                                                    >
                                                                        <FiDownload size={16} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Skills Acquired */}
                                        <div className="w-full">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 text-center md:text-left mb-8">Neural Stack</h4>
                                            <div className="flex flex-wrap gap-8 items-center justify-center md:justify-start">
                                                {exp.skills.map((skill, sIdx) => (
                                                    <div key={sIdx} className="relative group/skill">
                                                        {skill.iconUrl ? (
                                                            <div className="relative">
                                                                <img
                                                                    src={resolveImageUrl(skill.iconUrl)}
                                                                    alt={skill.name}
                                                                    className="w-16 h-16 object-contain rounded-[2px] shadow-lg transition-transform duration-500 group-hover/skill:scale-110"
                                                                />
                                                                {/* Tooltip */}
                                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-[8px] font-black uppercase tracking-widest rounded opacity-0 group-hover/skill:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                                                    {skill.name}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="px-5 py-2 bg-foreground/5 border border-foreground/10 rounded-[2px] text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-all">
                                                                {skill.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT COLUMN: Projects */}
                                    <div className="lg:col-span-7">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 mb-10 flex items-center justify-center md:justify-start gap-4">
                                            <FiLayers /> Project Contributions
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                            {exp.projects.map((proj: ExperienceProject, idx: number) => (
                                                <div key={idx} className="group/proj p-8 bg-foreground/5 rounded-[2px] border border-foreground/5 hover:border-primary/20 hover:bg-background transition-all shadow-sm flex flex-col justify-between text-left">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-6">
                                                            <h5 className="text-xl font-black uppercase tracking-tight group-hover/proj:text-primary transition-colors">{proj.title}</h5>
                                                            <div className="flex gap-3">
                                                                {proj.githubLink && (
                                                                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-primary">
                                                                        <FiGithub size={20} />
                                                                    </a>
                                                                )}
                                                                {proj.deployedLink && (
                                                                    <a href={proj.deployedLink} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-primary">
                                                                        <FiExternalLink size={20} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-foreground/40 font-medium leading-relaxed mb-8 line-clamp-3">
                                                            {proj.description}
                                                        </p>
                                                    </div>

                                                    {proj.images && proj.images.length > 0 && (
                                                        <div className="mt-auto">
                                                            <ImageCarousel
                                                                images={proj.images}
                                                                title={proj.title}
                                                                API_BASE_URL={API_BASE_URL}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* PDF Viewer Modal */}
            <AnimatePresence>
                {selectedLetter && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLetter(null)}
                            className="absolute inset-0 bg-background/90 backdrop-blur-3xl"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative z-10 w-full max-w-5xl h-full bg-white rounded-[2px] overflow-hidden shadow-3xl flex flex-col"
                        >
                            <div className="bg-foreground text-background p-6 flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Integrated Archive Viewer</span>
                                <button
                                    onClick={() => setSelectedLetter(null)}
                                    className="w-12 h-12 rounded-[2px] border border-background/20 flex items-center justify-center hover:bg-primary transition-all"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            <iframe
                                src={selectedLetter}
                                className="w-full flex-1 border-none"
                                title="Credential Viewer"
                            ></iframe>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
