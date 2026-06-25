'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiBookmark, FiExternalLink, FiSearch, FiLayers, FiType, FiX, FiMaximize, FiChevronLeft, FiChevronRight, FiFileText, FiDownload } from 'react-icons/fi';
import Image from 'next/image';
import api from '@/lib/api';
import { Book } from '@/types';

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

const ImageCarousel = ({ images, onImageClick }: { images: string[], onImageClick?: (index: number) => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
        <div 
            className="relative aspect-video w-full overflow-hidden cursor-pointer group/carousel bg-black/40" 
            style={{ borderRadius: '2px 2px 0 0' }}
            onClick={() => onImageClick?.(currentIndex)}
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={resolveImageUrl(images[currentIndex])}
                    alt="Book visual"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-full h-full object-cover"
                />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] text-white" style={{ borderRadius: '2px' }}>
                    <FiMaximize /> Expand Gallery
                </div>
            </div>
            
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20" onClick={(e) => e.stopPropagation()}>
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1 transition-all duration-500 ${i === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-white/20'}`}
                            style={{ borderRadius: '1px' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const PDFCard = ({ url }: { url: string }) => {
    const fileName = url.split('/').pop()?.replace(/^[0-9]+-/, '') || 'Document.pdf';
    return (
        <motion.a
            href={resolveImageUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center gap-4 p-4 bg-foreground/[0.03] border border-foreground/5 hover:bg-foreground/[0.06] hover:border-primary/30 transition-all group"
            style={{ borderRadius: '2px' }}
        >
            <div className="p-3 bg-red-500/10 text-red-500 transition-all shadow-lg" style={{ borderRadius: '2px' }}>
                <FiFileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Electronic Resource</p>
                <p className="text-sm font-bold truncate uppercase tracking-tight">{fileName}</p>
            </div>
            <div className="p-2 opacity-0 group-hover:opacity-100 transition-all text-primary">
                <FiDownload size={18} />
            </div>
        </motion.a>
    );
};

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'full-book' | 'chapter'>('all');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [initialImageIndex, setInitialImageIndex] = useState(0);
    const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const openFullscreen = (images: string[], index: number) => {
        setSelectedImages(images);
        setInitialImageIndex(index);
        setIsFullscreenModalOpen(true);
    };

    const filteredBooks = filter === 'all' ? books : books.filter(b => b.type === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" style={{ borderRadius: '2px' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48 selection:bg-primary/30 transition-colors duration-500">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-end mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center md:text-left"
                    >
                        <div className="inline-flex items-center gap-3 text-primary mb-8 font-black uppercase tracking-[0.4em] text-[10px] bg-primary/5 px-4 py-2 border border-primary/10" style={{ borderRadius: '2px' }}>
                            <FiBook /> Literary Repository
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none uppercase">
                            Published <span className="gradient-text">Volumes</span>
                        </h1>
                        <p className="text-lg md:text-xl text-foreground/40 font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                            A curated selection of published monographs, technical volumes, and theoretical chapters contributing to the global engineering discourse.
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-8 lg:items-end items-center">
                        <div className="flex p-1.5 bg-foreground/5 border border-foreground/5 backdrop-blur-3xl" style={{ borderRadius: '2px' }}>
                            {[
                                { id: 'all', label: 'All Volumes' },
                                { id: 'full-book', label: 'Full Books' },
                                { id: 'chapter', label: 'Chapters' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilter(tab.id as any)}
                                    className={`px-6 md:px-8 py-3 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${filter === tab.id ? 'bg-primary text-slate-900 shadow-xl shadow-primary/20' : 'text-foreground/40 hover:text-foreground'
                                        }`}
                                    style={{ borderRadius: '2px' }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <AnimatePresence mode='popLayout'>
                        {filteredBooks.map((book, i) => {
                            const allImages = [
                                book.coverImageUrl,
                                ...(book.imageUrls || [])
                            ].filter(Boolean) as string[];

                            return (
                                <motion.div
                                    key={book._id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                >
                                    <div className="premium-card p-0 flex flex-col h-full transition-all duration-700 bg-foreground/[0.01] border-foreground/5 relative overflow-hidden hover:border-primary/50" style={{ borderRadius: '2px' }}>
                                        {/* Image Carousel at Top */}
                                        <div className="w-full shrink-0 bg-foreground/5 border-b border-foreground/5">
                                            {allImages.length > 0 ? (
                                                <ImageCarousel 
                                                    images={allImages} 
                                                    onImageClick={(index) => openFullscreen(allImages, index)}
                                                />
                                            ) : (
                                                <div className="w-full aspect-video flex items-center justify-center opacity-10">
                                                    <FiBook size={60} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 md:p-10 flex flex-col flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                                    <FiBookmark /> {book.publisher || 'Independent Press'}
                                                </div>
                                                <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20" style={{ borderRadius: '2px' }}>
                                                    {book.type === 'full-book' ? 'Volume' : 'Chapter'}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter leading-tight uppercase group-hover:text-primary transition-colors">
                                                {book.title}
                                            </h3>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                                                {book.authors.map((author, idx) => (
                                                    <span key={idx} className="text-[10px] font-black uppercase opacity-40 tracking-widest border-l-2 border-primary/30 pl-3">{author}</span>
                                                ))}
                                            </div>

                                            <p className="text-sm text-foreground/50 leading-relaxed font-medium line-clamp-3 mb-8">
                                                {book.description}
                                            </p>

                                            {/* Branded Purchase Links */}
                                            {book.purchaseLinks && book.purchaseLinks.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                                                    {book.purchaseLinks.map((link, lIdx) => (
                                                        <a 
                                                            key={lIdx} 
                                                            href={link.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex flex-col items-center justify-center p-4 bg-foreground/[0.03] border border-foreground/5 hover:bg-foreground/[0.06] hover:border-primary/30 transition-all group"
                                                            style={{ borderRadius: '2px' }}
                                                        >
                                                            {link.logoUrl && (
                                                                <img src={resolveImageUrl(link.logoUrl)} className="h-6 w-auto object-contain mb-2 grayscale group-hover:grayscale-0 transition-all" alt={link.label} />
                                                            )}
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover:text-foreground">{link.label}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {/* PDF Downloads */}
                                            {book.pdfUrls && book.pdfUrls.length > 0 && (
                                                <div className="space-y-3 mt-auto pt-6 border-t border-foreground/5">
                                                    {book.pdfUrls.map((url, pIdx) => (
                                                        <PDFCard key={pIdx} url={url} />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-6 flex items-center justify-between opacity-20">
                                                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node ID: {book.isbn || '978-X-XXXX-X'}</span>
                                                <FiLayers size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-32 opacity-20">
                        <FiBook size={80} className="mx-auto mb-8" />
                        <p className="text-3xl font-black italic uppercase tracking-tighter">No literary assets found.</p>
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
