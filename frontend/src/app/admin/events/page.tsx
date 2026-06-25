'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Event } from '@/types';
import { FiPlus, FiTrash2, FiEdit2, FiArrowLeft, FiX, FiUpload, FiCalendar, FiMapPin, FiActivity } from 'react-icons/fi';
import Link from 'next/link';

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function AdminEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Event>>({
        name: '',
        type: '',
        description: '',
        location: '',
        date: '',
        skills: []
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [certificateFiles, setCertificateFiles] = useState<File[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchEvents();
    }, [router]);

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

    const handleOpenModal = (event: Event | null = null) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                ...event,
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
            });
        } else {
            setEditingEvent(null);
            setFormData({
                name: '',
                type: '',
                description: '',
                location: '',
                date: '',
                skills: []
            });
        }
        setImageFiles([]);
        setCertificateFiles([]);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                const value = (formData as any)[key];
                if (key === 'skills' && Array.isArray(value)) {
                    data.append('skills', value.join(', '));
                } else if (value !== undefined && key !== '_id' && !['imageUrls', 'certificateUrls'].includes(key)) {
                    data.append(key, value.toString());
                }
            });

            imageFiles.forEach(file => data.append('images', file));
            certificateFiles.forEach(file => data.append('certificates', file));

            if (editingEvent) {
                await api.put(`/events/${editingEvent._id}`, data);
            } else {
                await api.post('/events', data);
            }
            fetchEvents();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving event:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-16">
                    <div>
                        <Link href="/admin/dashboard" className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                            <FiArrowLeft /> Dashboard
                        </Link>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">Event Archives</h1>
                    </div>
                    <button onClick={() => handleOpenModal()} className="px-8 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:scale-105 transition-transform">
                        New Event Log
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event._id} className="p-8 rounded-3xl bg-white/5 border border-white/5 group hover:border-primary/40 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">{event.type}</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-2">{event.name}</h3>
                            <p className="text-white/40 font-bold text-[10px] uppercase mb-6 tracking-widest">{new Date(event.date).toLocaleDateString()}</p>
                            <div className="flex gap-4">
                                <button onClick={() => handleOpenModal(event)} className="p-3 rounded-lg bg-white/10 hover:bg-primary hover:text-black transition-all">
                                    <FiEdit2 />
                                </button>
                                <button onClick={() => handleDelete(event._id!)} className="p-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-card border border-border rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
                                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                    <h2 className="text-2xl font-black uppercase italic">Event Configuration</h2>
                                    <button onClick={() => setIsModalOpen(false)}><FiX size={24} /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-3">Event Identity</label>
                                                <input type="text" placeholder="Event Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-2" required />
                                                <input type="text" placeholder="Type (e.g. Hackathon)" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" required />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-3">Time & Place</label>
                                                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-2" required />
                                                <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" required />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-3">Operational Brief</label>
                                                <textarea placeholder="Event Description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl min-h-[150px] resize-none" required />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-3">Skills Engaged</label>
                                                <input type="text" placeholder="React, Python, AWS..." value={formData.skills?.join(', ')} onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-3">Visual Intel (Images)</label>
                                            <input type="file" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" accept="image/*" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[.3em] text-white/20 block mb-3">Certification (PDF)</label>
                                            <input type="file" multiple onChange={(e) => setCertificateFiles(Array.from(e.target.files || []))} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl" accept=".pdf" />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={saving} className="w-full py-6 bg-primary text-black font-black uppercase rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50">
                                        {saving ? 'Transmitting Data...' : 'Archive Event Log'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
