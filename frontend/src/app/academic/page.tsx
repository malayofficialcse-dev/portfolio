'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCalendar, FiBookOpen, FiDownload, FiChevronLeft, FiChevronRight, FiAward, FiFileText, FiX } from 'react-icons/fi';
import api from '@/lib/api';
import { Academic } from '@/types';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const FullscreenModal = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={onClose}
        >
            <button 
                className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors z-[1010] p-4 bg-white/5 hover:bg-white/10"
                style={{ borderRadius: '2px' }}
                onClick={onClose}
            >
                <FiX size={30} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={resolveImageUrl(images[currentIndex])}
                        alt="Fullscreen visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="max-w-full max-h-full object-contain shadow-2xl border border-white/10"
                        style={{ borderRadius: '2px' }}
                    />
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <button 
                            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-6 bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md"
                            style={{ borderRadius: '2px' }}
                            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                        >
                            <FiChevronLeft size={30} />
                        </button>
                        <button 
                            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-6 bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md"
                            style={{ borderRadius: '2px' }}
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                        >
                            <FiChevronRight size={30} />
                        </button>
                    </>
                )}

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                    {images.map((_, idx) => (
                        <div 
                            key={idx}
                            className={`h-1.5 transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-primary' : 'w-4 bg-white/20'}`}
                            style={{ borderRadius: '2px' }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const AcademicCard = ({ academic, onImageClick }: { academic: Academic, onImageClick: (index: number) => void }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const images = academic.imageUrls && academic.imageUrls.length > 0 ? academic.imageUrls : [];

    useEffect(() => {
        if (images.length > 1 && !isHovered) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [images.length, isHovered]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-foreground/[0.01] border border-foreground/5 overflow-hidden hover:border-primary/50 transition-all duration-700 flex flex-col h-full"
            style={{ borderRadius: '2px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Carousel Section - Matching Books style */}
            <div 
                className="relative aspect-video overflow-hidden bg-foreground/5 border-b border-foreground/5 cursor-pointer"
                onClick={() => onImageClick(currentImageIndex)}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={resolveImageUrl(images[currentImageIndex])}
                        alt={academic.institution}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8 }}
                    />
                </AnimatePresence>
                
                {/* Carousel Controls */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                className={`h-1 transition-all duration-500 ${idx === currentImageIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
                                style={{ borderRadius: '1px' }}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] text-white" style={{ borderRadius: '2px' }}>
                        <FiBookOpen /> View Gallery
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-8 md:p-12 flex flex-col flex-1">
                <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        {academic.logoUrl && (
                            <div className="w-16 h-16 bg-foreground/5 p-3 border border-foreground/5 shrink-0" style={{ borderRadius: '2px' }}>
                                <img src={resolveImageUrl(academic.logoUrl)} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">{academic.institution}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1"><FiMapPin className="text-primary" /> {academic.location}</span>
                                <span className="flex items-center gap-1"><FiCalendar className="text-primary" /> {new Date(academic.startDate).getFullYear()} - {academic.endDate ? new Date(academic.endDate).getFullYear() : 'Present'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <h4 className="text-xl font-black text-primary uppercase tracking-wider mb-4">{academic.degree} in {academic.major}</h4>
                    <p className="text-foreground/60 leading-relaxed text-sm max-w-2xl">{academic.description}</p>
                </div>

                {/* Semester Timeline - Delivery style */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-10">
                        <h5 className="text-[10px] font-black uppercase tracking-[.3em] text-foreground/20">Scholastic Progression Matrix</h5>
                        <div className="h-[1px] flex-1 bg-foreground/5" />
                    </div>
                    
                    <div className="relative">
                        {/* Connecting Line - Desktop Only */}
                        <div className="absolute top-[15px] left-4 right-4 h-[2px] bg-foreground/5 hidden md:block" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-8">
                            {academic.semesterResults.map((sem, idx) => (
                                <div key={idx} className="relative group/sem flex md:flex-col items-center md:items-start gap-6 md:gap-0">
                                    {/* Status Node */}
                                    <div className="relative z-10 shrink-0">
                                        <div className="w-8 h-8 bg-background border border-foreground/10 flex items-center justify-center group-hover/sem:border-primary group-hover/sem:bg-primary/10 transition-all duration-700 shadow-xl" style={{ borderRadius: '2px' }}>
                                            <div className="w-1.5 h-1.5 bg-primary animate-pulse" style={{ borderRadius: '1px' }} />
                                        </div>
                                        {/* Mobile vertical line */}
                                        {idx !== academic.semesterResults.length - 1 && (
                                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-foreground/5 md:hidden" />
                                        )}
                                    </div>

                                    {/* Info Block */}
                                    <div className="flex-1 md:mt-6">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-1">{sem.semester}</p>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">GPA {sem.gpa.toFixed(2)}</span>
                                            <div className="px-1.5 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase" style={{ borderRadius: '1px' }}>Completed</div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {sem.marksheetUrl && (
                                                <a href={resolveImageUrl(sem.marksheetUrl)} target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.03] text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all border border-foreground/5" style={{ borderRadius: '2px' }}>
                                                    <FiDownload size={10} />
                                                    <span className="text-[8px] font-bold uppercase tracking-widest">Marksheet</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Core Credentials */}
                <div className="mt-auto pt-8 border-t border-foreground/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {academic.degreeCertificateUrl && (
                        <a href={resolveImageUrl(academic.degreeCertificateUrl)} target="_blank" className="flex items-center gap-4 p-5 bg-foreground/[0.03] border border-foreground/5 hover:border-primary/40 hover:bg-primary/5 transition-all group/link" style={{ borderRadius: '2px' }}>
                            <div className="p-3 bg-primary/10 text-primary" style={{ borderRadius: '2px' }}>
                                <FiAward size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Official Conferral</p>
                                <span className="text-[11px] font-bold uppercase tracking-widest">Degree Certificate</span>
                            </div>
                            <FiDownload className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity text-primary" />
                        </a>
                    )}
                    {academic.registrationCertificateUrl && (
                        <a href={resolveImageUrl(academic.registrationCertificateUrl)} target="_blank" className="flex items-center gap-4 p-5 bg-foreground/[0.03] border border-foreground/5 hover:border-primary/40 hover:bg-primary/5 transition-all group/link" style={{ borderRadius: '2px' }}>
                            <div className="p-3 bg-primary/10 text-primary" style={{ borderRadius: '2px' }}>
                                <FiFileText size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Council Enrollment</p>
                                <span className="text-[11px] font-bold uppercase tracking-widest">Registration Cert.</span>
                            </div>
                            <FiDownload className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity text-primary" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default function AcademicsPage() {
    const [academics, setAcademics] = useState<Academic[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [initialImageIndex, setInitialImageIndex] = useState(0);
    const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

    useEffect(() => {
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
        fetchAcademics();
    }, []);

    const openFullscreen = (images: string[], index: number) => {
        setSelectedImages(images);
        setInitialImageIndex(index);
        setIsFullscreenModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" style={{ borderRadius: '2px' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48 selection:bg-primary/30">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center md:text-left"
                    >
                        <div className="inline-flex items-center gap-3 text-primary mb-8 font-black uppercase tracking-[0.4em] text-[10px] bg-primary/5 px-4 py-2 border border-primary/10" style={{ borderRadius: '2px' }}>
                            <FiBookOpen /> Scholastic Ledger
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none uppercase">
                            Academic <span className="gradient-text">Odyssey</span>
                        </h1>
                        <p className="text-lg md:text-xl text-foreground/40 font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                            A record of formal education, pedagogical milestones, and professional certifications acquired through rigorous academic pursuit.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-24">
                    {academics.map((academic) => (
                        <AcademicCard 
                            key={academic._id} 
                            academic={academic} 
                            onImageClick={(index) => openFullscreen(academic.imageUrls || [], index)}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {isFullscreenModalOpen && (
                    <FullscreenModal 
                        images={selectedImages} 
                        initialIndex={initialImageIndex} 
                        onClose={() => setIsFullscreenModalOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
