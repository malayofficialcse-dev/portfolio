'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiCode, FiTerminal, FiLayout, FiChevronLeft, FiChevronRight, FiCamera } from 'react-icons/fi';
import Image from 'next/image';
import api from '@/lib/api';
import { Project } from '@/types';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ProjectCard = ({ project }: { project: Project }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const images = project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls : [];

    // Auto-rotate carousel every 2 seconds
    useEffect(() => {
        if (images.length > 1 && !isHovered && !isFullscreen) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [images.length, isHovered, isFullscreen]);

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

    const openFullscreen = () => {
        if (images.length > 0 && !imgError) {
            setIsFullscreen(true);
        }
    };

    const closeFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullscreen(false);
    };

    // Reset error state when image changes
    useEffect(() => {
        setImgError(false);
    }, [currentImageIndex, project._id]);

    // Prevent body scroll when fullscreen is open
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group relative flex flex-col lg:flex-row h-full overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-[2px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <div className="relative flex flex-col lg:flex-row h-full w-full bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/30 rounded-[2px] overflow-hidden shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/40 transition-all duration-500">
                    
                    {/* Large Image Carousel Area - 60% width on desktop */}
                    <div className="relative lg:w-[60%] aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-black via-zinc-900 to-black overflow-hidden cursor-pointer" onClick={openFullscreen}>
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 opacity-80"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {images.length > 0 ? (
                            <AnimatePresence mode="wait">
                                {!imgError ? (
                                    <motion.img
                                        key={`${project._id}-${currentImageIndex}`}
                                        src={resolveImageUrl(images[currentImageIndex])}
                                        alt={project.title}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        onError={() => {
                                            console.error('Image load failed:', resolveImageUrl(images[currentImageIndex]));
                                            setImgError(true);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-foreground/40 bg-gradient-to-br from-zinc-900 to-black">
                                        <FiCamera size={48} className="mb-3 opacity-50 animate-pulse" />
                                        <span className="text-xs font-mono tracking-wider">IMAGE UNAVAILABLE</span>
                                    </div>
                                )}
                            </AnimatePresence>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground/20">
                                <FiLayout size={72} className="animate-pulse" />
                            </div>
                        )}

                        {/* Image Counter */}
                        {images.length > 0 && (
                            <div className="absolute top-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-[2px] z-20 border border-white/10">
                                <span className="text-white font-bold text-sm tracking-wider">
                                    {currentImageIndex + 1} / {images.length}
                                </span>
                            </div>
                        )}

                        {/* Enhanced Carousel Controls */}
                        {images.length > 1 && (
                            <>
                                <motion.button
                                    onClick={prevImage}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 text-white rounded-[2px] hover:bg-primary hover:scale-110 transition-all backdrop-blur-md z-20 shadow-xl border border-white/10"
                                >
                                    <FiChevronLeft size={24} />
                                </motion.button>
                                <motion.button
                                    onClick={nextImage}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 text-white rounded-[2px] hover:bg-primary hover:scale-110 transition-all backdrop-blur-md z-20 shadow-xl border border-white/10"
                                >
                                    <FiChevronRight size={24} />
                                </motion.button>
                                
                                {/* Enhanced progress indicators */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                    {images.map((_, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: idx === currentImageIndex ? 1 : 0.8 }}
                                            className={`h-1.5 rounded-[2px] transition-all duration-300 ${
                                                idx === currentImageIndex 
                                                    ? 'bg-primary w-8 shadow-lg shadow-primary/50' 
                                                    : 'bg-white/40 w-1.5 hover:bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Click to expand hint */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-[2px] z-20 border border-white/10"
                        >
                            <span className="text-white text-xs font-medium tracking-wide">Click to expand</span>
                        </motion.div>
                    </div>

                    {/* Content Body - 40% width on desktop */}
                    <div className="lg:w-[40%] p-8 lg:p-10 flex flex-col relative z-20">
                        {/* Tech stack badges */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {project.technologies.slice(0, 5).map((tech, idx) => (
                                <motion.span 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-[2px] text-primary shadow-sm hover:shadow-primary/30 hover:scale-105 transition-all"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                            {project.technologies.length > 5 && (
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-foreground/10 rounded-[2px] text-foreground/50">
                                    +{project.technologies.length - 5}
                                </span>
                            )}
                        </div>
                        
                        <h3 className="text-3xl lg:text-4xl font-black mb-4 tracking-tight uppercase bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300 line-clamp-2">
                            {project.title}
                        </h3>
                        
                        <p className="text-foreground/60 font-medium leading-relaxed mb-6 text-base">
                            {project.description}
                        </p>

                        {/* Links Section */}
                        <div className="flex gap-4 mb-6">
                            {project.githubUrl && (
                                <motion.a 
                                    href={project.githubUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-foreground to-foreground/80 text-background rounded-[2px] hover:from-primary hover:to-primary/80 transition-all shadow-lg font-bold text-sm"
                                >
                                    <FiGithub size={18} />
                                    GitHub
                                </motion.a>
                            )}
                            {project.projectUrl && (
                                <motion.a 
                                    href={project.projectUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-[2px] hover:from-primary/80 hover:to-primary transition-all shadow-lg font-bold text-sm"
                                >
                                    <FiExternalLink size={18} />
                                    Live Demo
                                </motion.a>
                            )}
                        </div>

                        {/* Artifact Archive */}
                        {project.pdfUrls && project.pdfUrls.length > 0 && (
                            <div className="mb-6 w-full p-4 bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-[2px] border border-foreground/10 backdrop-blur-sm">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/70 block mb-3">Documentation</span>
                                <div className="flex flex-wrap gap-2">
                                    {project.pdfUrls.map((pdf, idx) => (
                                        <a
                                            key={idx}
                                            href={resolveImageUrl(pdf)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-background/80 border border-foreground/20 rounded-[2px] text-[10px] font-bold uppercase tracking-wider hover:text-primary hover:border-primary/50 hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
                                        >
                                            <FiCode size={12} />
                                            PDF {idx + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-auto w-full pt-5 border-t border-foreground/10 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                            <span className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-[2px] bg-primary animate-pulse"></div>
                                {project.startDate ? new Date(project.startDate).getFullYear() : '2024'}
                            </span>
                            <FiCode className="text-primary group-hover:rotate-180 transition-transform duration-500" size={16} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Fullscreen Image Viewer */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={closeFullscreen}
                    >
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeFullscreen}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-[2px] transition-all z-50 backdrop-blur-md"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        {/* Fullscreen Image Counter */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-[2px] z-50 border border-white/20">
                            <span className="text-white font-bold text-lg tracking-wider">
                                {currentImageIndex + 1} / {images.length}
                            </span>
                        </div>

                        <motion.img
                            key={currentImageIndex}
                            src={resolveImageUrl(images[currentImageIndex])}
                            alt={project.title}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Fullscreen Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md z-50"
                                >
                                    <FiChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md z-50"
                                >
                                    <FiChevronRight size={32} />
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.technologies.some(t => t.toLowerCase().includes(filter.toLowerCase())));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-[2px] animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-24 pb-32 selection:bg-primary/30 transition-colors duration-500">
            <div className="container mx-auto px-6 max-w-[1400px]">

                {/* Enhanced Header Container */}
                <div className="relative mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-3 px-8 py-3 rounded-[2px] bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-8 backdrop-blur-sm">
                            <FiTerminal className="text-primary animate-pulse" size={18} />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Deployment Registry</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none uppercase">
                            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">Registry of </span>
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">Architectures</span>
                        </h1>
                        <p className="text-lg md:text-xl text-foreground/50 max-w-3xl font-medium leading-relaxed">
                            A curated exhibition of strategic digital implementations, from high-performance microservices to experimental cognitive interfaces.
                        </p>
                    </motion.div>
                </div>

                {/* Enhanced Filter Tags */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {['all', 'React', 'Node', 'TypeScript', 'Web3', 'AI'].map((tag) => (
                        <motion.button
                            key={tag}
                            onClick={() => setFilter(tag)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-3 rounded-[2px] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border ${filter === tag
                                ? 'bg-gradient-to-r from-primary to-purple-500 text-white border-primary shadow-xl shadow-primary/30'
                                : 'bg-foreground/5 text-foreground/40 border-foreground/10 hover:bg-foreground/10 hover:text-foreground/60 hover:border-foreground/20'
                                }`}
                        >
                            {tag}
                        </motion.button>
                    ))}
                </div>

                {/* Full-Width Projects Grid - 1 card per row */}
                <div className="grid grid-cols-1 gap-10">
                    <AnimatePresence mode='popLayout'>
                        {filteredProjects.map((project) => (
                           <ProjectCard key={project._id} project={project} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Enhanced Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32"
                    >
                        <FiTerminal size={100} className="mx-auto mb-8 text-foreground/10 animate-pulse" />
                        <p className="text-4xl font-black italic uppercase tracking-tighter text-foreground/20">No deployments found.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
