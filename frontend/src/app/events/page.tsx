'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCalendar, FiActivity, FiSearch, FiDownload, FiChevronLeft, FiChevronRight, FiTerminal } from 'react-icons/fi';
import api from '@/lib/api';
import { Event } from '@/types';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const EventCard = ({ event }: { event: Event }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const images = event.imageUrls && event.imageUrls.length > 0 ? event.imageUrls : [];

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
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2px] overflow-hidden hover:border-primary/40 transition-all duration-700 mx-auto max-w-6xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Visual Header - Carousel */}
            <div className="relative aspect-video lg:aspect-[21/9] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={resolveImageUrl(images[currentImageIndex])}
                        alt={event.name}
                        className="w-full h-full object-cover transition-all duration-1000"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        whileHover={{ scale: 1.05, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 1 }}
                    />
                </AnimatePresence>
                
                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent p-10 lg:p-20 flex flex-col justify-end">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-6 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest" style={{ borderRadius: '2px' }}>
                                {event.type}
                            </span>
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                <FiCalendar className="text-primary" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{event.name}</h2>
                    </div>
                </div>

                {/* Carousel Indicators */}
                {images.length > 1 && (
                    <div className="absolute top-10 right-10 flex gap-2">
                        {images.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                                className={`h-1 transition-all duration-500 ${i === currentImageIndex ? 'w-12 bg-primary' : 'w-4 bg-white/20'}`} 
                                style={{ borderRadius: '1px' }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="p-10 lg:p-20 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-2 mb-6">
                            <FiActivity className="text-primary/40" />
                            <span className="text-[10px] font-black uppercase tracking-[.4em] text-white/20">Operational Briefing</span>
                        </div>
                        <p className="text-xl lg:text-2xl text-white/60 leading-relaxed font-medium">
                            {event.description}
                        </p>

                        {/* Skills/Tags */}
                        <div className="flex flex-wrap gap-3 mt-12">
                            {event.skills.map((skill, i) => (
                                <span key={i} className="px-5 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary/80" style={{ borderRadius: '2px' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                        <div className="p-8 bg-white/[0.02] border border-white/5" style={{ borderRadius: '2px' }}>
                            <h4 className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 mb-8 flex items-center gap-2">
                                <FiMapPin className="text-primary" /> Deployment Zone
                            </h4>
                            <p className="text-2xl font-black uppercase italic tracking-tight">{event.location}</p>
                        </div>

                        {event.certificateUrls.length > 0 && (
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 flex items-center gap-2">
                                    <FiTerminal className="text-primary" /> Validated Certificates
                                </h4>
                                <div className="space-y-3">
                                    {event.certificateUrls.map((url, i) => (
                                        <a 
                                            key={i} 
                                            href={resolveImageUrl(url)} 
                                            target="_blank"
                                            className="group/link flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all"
                                            style={{ borderRadius: '2px' }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-black transition-colors" style={{ borderRadius: '1px' }}>
                                                    <FiDownload />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest">Certificate_{i + 1}.pdf</span>
                                            </div>
                                            <FiChevronRight className="text-white/20 group-hover/link:text-primary transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-[2px] animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48 selection:bg-primary/30">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 uppercase leading-[0.8]">
                            Events <span className="gradient-text">&</span> <br />Experience
                        </h1>
                        <p className="text-xl text-foreground/40 max-w-2xl mx-auto font-medium leading-relaxed mt-10">
                            A field log of participations, hackathons, and professional workshops attended.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-32">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
}
