'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiExternalLink, FiFileText, FiCalendar, FiX, FiMaximize, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '@/lib/api';
import { ResearchPaper } from '@/types';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    const finalUrl = `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
    return finalUrl;
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
                            className={`h-1.5 transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-primary text-primary-foreground' : 'w-4 bg-white/20'}`}
                            style={{ borderRadius: '2px' }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const ImageCarousel = ({ images, onImageClick }: { images: string[], onImageClick?: (index: number) => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
        <div 
            className="relative aspect-video w-full overflow-hidden border-b border-border/40 bg-black/40 cursor-pointer group/carousel" 
            style={{ borderRadius: '2px 2px 0 0' }}
            onClick={() => onImageClick?.(currentIndex)}
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={resolveImageUrl(images[currentIndex])}
                    alt="Research visual"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 1, ease: "anticipate" }}
                    className="w-full h-full object-cover"
                />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-black/20">
                <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] text-white" style={{ borderRadius: '2px' }}>
                    <FiMaximize /> Expand Intel
                </div>
            </div>

            {images.length > 1 && (
                <div className="absolute bottom-4 right-6 flex gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-0.5 transition-all duration-500 ${idx === currentIndex ? 'bg-primary w-8' : 'bg-white/20 w-4'}`}
                            style={{ borderRadius: '2px' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const PDFCard = ({ url }: { url: string }) => {
    const filename = url.split('/').pop() || 'Research Document';
    const finalUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${url}`;

    return (
        <motion.a
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01, x: 4 }}
            className="flex items-center gap-4 p-5 bg-foreground/[0.02] border border-foreground/5 hover:bg-foreground/[0.04] hover:border-primary/20 transition-all group"
            style={{ borderRadius: '2px' }}
        >
            <div className="p-3 bg-red-500/5 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm" style={{ borderRadius: '2px' }}>
                <FiFileText size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-1">Electronic Data</div>
                <div className="text-[11px] font-bold text-foreground truncate uppercase tracking-tight">{filename}</div>
            </div>
            <div className="p-2 text-foreground/10 group-hover:text-primary transition-colors">
                <FiDownload size={16} />
            </div>
        </motion.a>
    );
};

export default function ResearchPage() {
    const [papers, setPapers] = useState<ResearchPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [initialImageIndex, setInitialImageIndex] = useState(0);
    const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            const response = await api.get('/research');
            setPapers(response.data);
        } catch (error) {
            console.error('Error fetching research papers:', error);
        } finally {
            setLoading(false);
        }
    };

    const openFullscreen = (images: string[], index: number) => {
        setSelectedImages(images);
        setInitialImageIndex(index);
        setIsFullscreenModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" style={{ borderRadius: '2px' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48 selection:bg-primary/30">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.5em] text-[10px]">
                            <span className="w-10 h-[1px] bg-primary/30"></span> Intelligence Repository
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                            Cognitive <br />
                            <span className="gradient-text">Inquiries</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-foreground/30 font-medium leading-relaxed max-w-3xl border-l-2 border-primary/20 pl-8 mt-4 italic">
                            Systematic investigation into high-performance architectures, human-computer interfaces, and decentralized intelligence frameworks.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {papers.map((paper, i) => (
                        <motion.div
                            key={paper._id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="group flex flex-col h-full bg-foreground/[0.01] border border-foreground/5 hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-2xl"
                            style={{ borderRadius: '2px' }}
                        >
                            {paper.imageUrls && paper.imageUrls.length > 0 && (
                                <ImageCarousel 
                                    images={paper.imageUrls} 
                                    onImageClick={(index) => openFullscreen(paper.imageUrls!, index)}
                                />
                            )}

                            <div className="p-10 md:p-14 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
                                    <div className="flex items-center gap-2 text-primary">
                                        <FiCalendar /> {paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : 'IN PRESS'}
                                    </div>
                                    <div className="truncate max-w-[200px]">
                                        {paper.journal || paper.conference || 'Internal Repository'}
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tighter leading-tight uppercase group-hover:text-primary transition-colors duration-500">
                                    {paper.title}
                                </h2>

                                <div className="flex flex-wrap gap-2 mb-10">
                                    {paper.authors.map((author, idx) => (
                                        <span key={idx} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-foreground/5 border border-foreground/5" style={{ borderRadius: '2px' }}>
                                            {author}
                                        </span>
                                    ))}
                                </div>

                                <div className="mb-12 flex-1">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/10 mb-6 flex items-center gap-3">
                                        Abstract Overview
                                    </h4>
                                    <p className="text-base md:text-lg text-foreground/40 leading-relaxed font-medium italic line-clamp-6">
                                        {paper.abstract}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-foreground/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {paper.pdfUrls && paper.pdfUrls.map((url, idx) => (
                                            <PDFCard key={idx} url={url} />
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
                                        <div className="flex flex-wrap gap-2">
                                            {paper.keywords.map((word, idx) => (
                                                <span key={idx} className="text-[8px] font-black uppercase px-3 py-1 bg-primary/5 text-primary/40" style={{ borderRadius: '2px' }}>
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                        {paper.doi && (
                                            <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95" style={{ borderRadius: '2px' }}>
                                                DOI SOURCE <FiExternalLink />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {papers.length === 0 && (
                    <div className="text-center py-48 opacity-10">
                        <FiFileText size={80} className="mx-auto mb-8" />
                        <p className="text-4xl font-black italic uppercase tracking-tighter">Repository Exhausted.</p>
                    </div>
                )}
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
