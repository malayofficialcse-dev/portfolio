'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiExternalLink, FiDownload, FiCheckCircle, FiShield, FiCalendar, FiX } from 'react-icons/fi';
import Image from 'next/image';
import api from '@/lib/api';
import { Certificate } from '@/types';

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-[2px] animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48 selection:bg-primary/30 transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative">
                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
                    <FiShield size={400} className="text-foreground" />
                </div>

                {/* Credentials Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="max-w-2xl px-2"
                    >
                        <div className="inline-flex items-center gap-3 text-primary mb-10 font-black uppercase tracking-[0.5em] text-[9px] bg-primary/5 px-5 py-2.5 rounded-[2px] border border-primary/10 backdrop-blur-md">
                            <FiShield className="animate-pulse" /> Validated Infrastructure Assets
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-10 leading-[0.85] uppercase group">
                            <span className="block text-foreground transition-transform group-hover:translate-x-2">PROFESSIONAL</span>
                            <span className="gradient-text block transition-transform group-hover:translate-x-4">CREDENTIALS</span>
                        </h1>
                        <p className="text-sm md:text-lg text-foreground/40 font-medium leading-relaxed max-w-xl italic uppercase tracking-widest border-l-2 border-primary/20 pl-6">
                            Verified industry credentials and professional acknowledgments across enterprise technologies and architectural domains.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center lg:items-end w-full lg:w-auto px-4"
                    >
                        <div className="relative">
                            <div className="text-8xl md:text-[10rem] font-black gradient-text opacity-10 leading-none">{certificates.length}</div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-2xl font-black tracking-tighter uppercase mb-4">Total</div>
                            </div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.8em] text-foreground/30 -mt-2 md:-mt-6 pr-2">Validated Assets</div>
                    </motion.div>
                </div>

                {/* Certificates Display (Surgical Precision Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                            whileHover={{ y: -6 }}
                            className="group relative"
                        >
                            {/* Card Container with 3px Sharp Corners */}
                            <div className="relative h-full flex flex-col overflow-hidden bg-foreground/[0.02] border border-foreground/[0.08] group-hover:border-primary/40 rounded-[2px] transition-all duration-500 backdrop-blur-[2px] group-hover:bg-foreground/[0.04]">

                                {/* ID Header Overlay - Compact */}
                                <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
                                    <div className="px-3 py-1 rounded-[2px] bg-background/90 backdrop-blur-md border border-foreground/[0.05] group-hover:border-primary/20 transition-all">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover:text-primary transition-colors">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                                        <FiCheckCircle size={14} className="text-primary" />
                                    </div>
                                </div>

                                {/* Certificate Visual / Preview - Reduced Height */}
                                <div
                                    className="relative h-48 bg-foreground/[0.05] overflow-hidden rounded-[2px] cursor-pointer"
                                    onClick={() => {
                                        if (cert.imageUrl) {
                                            const url = cert.imageUrl.startsWith('http') ? cert.imageUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${cert.imageUrl}`;
                                            setSelectedImage(url);
                                        }
                                    }}
                                >
                                    {cert.imageUrl ? (
                                        <Image
                                            src={cert.imageUrl.startsWith('http') ? cert.imageUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${cert.imageUrl}`}
                                            alt={cert.title}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-110 transition-all duration-[1s] ease-out rounded-[2px]"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-5">
                                            <FiAward size={80} className="text-primary" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                                </div>

                                {/* Credentials Body - Streamlined */}
                                <div className="p-6 flex-1 flex flex-col relative z-20">
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-primary/40 mb-3 group-hover:text-primary transition-colors">
                                        <FiCalendar size={10} /> {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Verified'}
                                    </div>

                                    <h3 className="text-lg font-black mb-2 tracking-tighter leading-tight uppercase group-hover:translate-x-1 transition-all">
                                        {cert.title}
                                    </h3>

                                    <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.1em] mb-4 line-clamp-1">{cert.issuingOrganization}</p>

                                    {/* Restored Skills Display */}
                                    {cert.skills && cert.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {cert.skills.map((skill, idx) => (
                                                <span key={idx} className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 bg-foreground/[0.03] border border-foreground/[0.05] group-hover:border-primary/10 rounded-[1px] text-foreground/40 group-hover:text-foreground transition-all">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Architecture - Surgical Buttons */}
                                    <div className="mt-auto pt-6 border-t border-foreground/[0.05] grid grid-cols-2 gap-3">
                                        {cert.credentialUrl && (
                                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-[2px] font-black text-[8px] uppercase tracking-[0.2em] hover:bg-primary hover:text-slate-900 transition-all active:scale-95 shadow-lg">
                                                Verify <FiExternalLink size={10} />
                                            </a>
                                        )}
                                        {cert.pdfUrl && (
                                            <a href={cert.pdfUrl.startsWith('http') ? cert.pdfUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${cert.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-foreground/[0.03] border border-foreground/[0.08] hover:border-foreground/20 rounded-[2px] font-black text-[8px] uppercase tracking-[0.2em] transition-all hover:bg-foreground/[0.06]">
                                                PDF <FiDownload size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Highlight Indicator */}
                                <div className="absolute top-0 left-0 w-[1px] h-0 bg-primary group-hover:h-full transition-all duration-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Image Modal Popup */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-10 cursor-zoom-out"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative max-w-5xl w-full aspect-video"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-12 right-0 md:-right-12 text-foreground/60 hover:text-primary transition-colors p-2"
                                >
                                    <FiX size={32} />
                                </button>
                                <div className="relative w-full h-full rounded-[2px] overflow-hidden border border-foreground/10 shadow-2xl">
                                    <Image
                                        src={selectedImage}
                                        alt="Certificate Full View"
                                        fill
                                        unoptimized
                                        className="object-contain bg-foreground/[0.02]"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {certificates.length === 0 && (
                    <div className="text-center py-48 opacity-[0.05]">
                        <FiShield size={120} className="mx-auto mb-10" />
                        <p className="text-5xl font-black italic uppercase tracking-tighter">Repository Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}
