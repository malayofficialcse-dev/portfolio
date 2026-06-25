'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { SkillSet, TechnicalSkill, CommunicationSkill, TheoreticalSkill } from '@/types';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiCpu, FiMessageCircle, FiLayers, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminSkillsPage() {
    const router = useRouter();
    const [skills, setSkills] = useState<SkillSet>({
        technicalSkills: [],
        communicationSkills: [],
        theoreticalSkills: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'technical' | 'communication' | 'theoretical'>('technical');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchSkills();
    }, [router]);

    const fetchSkills = async () => {
        try {
            const response = await api.get('/skills/set');
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/skills/set', skills);
            setMessage({ type: 'success', text: 'Arsenal Updated Successfully' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Update Failed' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleIconUpload = async (type: 'technical' | 'communication' | 'theoretical', index: number, file: File) => {
        const formData = new FormData();
        formData.append('icon', file);
        try {
            const response = await api.post('/skills/upload-icon', formData);
            const updatedSkills = { ...skills };
            if (type === 'technical') {
                updatedSkills.technicalSkills[index].iconUrl = response.data.url;
            } else if (type === 'communication') {
                updatedSkills.communicationSkills[index].iconUrl = response.data.url;
            } else {
                updatedSkills.theoreticalSkills[index].iconUrl = response.data.url;
            }
            setSkills(updatedSkills);
        } catch (error) {
            console.error('Error uploading icon:', error);
            setMessage({ type: 'error', text: 'Icon Upload Failed' });
        }
    };

    const addTechnicalSkill = () => {
        const newSkill: TechnicalSkill = { name: '', level: 80, category: 'frontend' };
        setSkills({ ...skills, technicalSkills: [...skills.technicalSkills, newSkill] });
    };

    const addCommunicationSkill = () => {
        const newSkill: CommunicationSkill = { language: '', level: 90, readLevel: 80, writeLevel: 80, speakLevel: 80 };
        setSkills({ ...skills, communicationSkills: [...skills.communicationSkills, newSkill] });
    };

    const addTheoreticalSkill = () => {
        const newSkill: TheoreticalSkill = { name: '', level: 85, category: 'dsa' };
        setSkills({ ...skills, theoreticalSkills: [...skills.theoreticalSkills, newSkill] });
    };

    const removeSkill = (type: 'technical' | 'communication' | 'theoretical', index: number) => {
        const updatedSkills = { ...skills };
        if (type === 'technical') updatedSkills.technicalSkills.splice(index, 1);
        if (type === 'communication') updatedSkills.communicationSkills.splice(index, 1);
        if (type === 'theoretical') updatedSkills.theoreticalSkills.splice(index, 1);
        setSkills(updatedSkills);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header Container */}
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-10 mb-16 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-all font-bold uppercase tracking-[0.2em] text-[10px] mb-6"
                        >
                            <FiArrowLeft /> Back to Command Center
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black gradient-text tracking-tighter uppercase whitespace-nowrap">Skill Matrix</h1>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <><FiSave className="text-lg" /> Sync Arsenal</>
                        )}
                    </button>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-12 p-6 rounded-2xl border flex items-center gap-4 font-bold ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}
                    >
                        <FiCheckCircle size={24} />
                        {message.text}
                    </motion.div>
                )}

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-4 mb-12">
                    {[
                        { id: 'technical', label: 'Technical', icon: FiCpu },
                        { id: 'communication', label: 'Communication', icon: FiMessageCircle },
                        { id: 'theoretical', label: 'Theoretical', icon: FiLayers },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'
                                }`}
                        >
                            <tab.icon />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {activeTab === 'technical' && (
                                <>
                                    <div className="grid grid-cols-1 gap-6">
                                        {skills.technicalSkills.map((skill, index) => (
                                            <div key={index} className="premium-card p-8 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/50">
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <div className="w-full h-full rounded-xl bg-foreground/5 border border-border overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-all">
                                                        {skill.iconUrl ? (
                                                            <img
                                                                src={skill.iconUrl.startsWith('http') ? skill.iconUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${skill.iconUrl}`}
                                                                alt={skill.name}
                                                                className="w-full h-full object-contain p-2"
                                                            />
                                                        ) : (
                                                            <FiCpu className="text-2xl text-white/20" />
                                                        )}
                                                    </div>
                                                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-all shadow-lg scale-0 group-hover:scale-100 duration-300">
                                                        <FiPlus size={16} />
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleIconUpload('technical', index, file);
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Skill Name</label>
                                                        <input
                                                            type="text"
                                                            value={skill.name}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.technicalSkills];
                                                                newSkills[index].name = e.target.value;
                                                                setSkills({ ...skills, technicalSkills: newSkills });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary"
                                                            placeholder="e.g. React.js"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Category</label>
                                                        <select
                                                            value={skill.category}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.technicalSkills];
                                                                newSkills[index].category = e.target.value as any;
                                                                setSkills({ ...skills, technicalSkills: newSkills });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary appearance-none bg-card"
                                                        >
                                                            <option value="frontend">Frontend</option>
                                                            <option value="backend">Backend</option>
                                                            <option value="database">Database</option>
                                                            <option value="devops">DevOps</option>
                                                            <option value="deployment">Deployment</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Proficiency ({skill.level}%)</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={skill.level}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.technicalSkills];
                                                                newSkills[index].level = parseInt(e.target.value);
                                                                setSkills({ ...skills, technicalSkills: newSkills });
                                                            }}
                                                            className="w-full accent-primary h-2 bg-foreground/10 rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeSkill('technical', index)}
                                                    className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={addTechnicalSkill}
                                        className="w-full py-8 border-2 border-dashed border-foreground/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-foreground/30 hover:border-primary/50 hover:text-primary transition-all font-black uppercase tracking-widest text-xs"
                                    >
                                        <FiPlus size={24} />
                                        Initialize New Technical Module
                                    </button>
                                </>
                            )}

                            {activeTab === 'communication' && (
                                <>
                                    <div className="grid grid-cols-1 gap-6">
                                        {skills.communicationSkills.map((skill, index) => (
                                            <div key={index} className="premium-card p-8 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/50">
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <div className="w-full h-full rounded-xl bg-foreground/5 border border-border overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-all">
                                                        {skill.iconUrl ? (
                                                            <img
                                                                src={skill.iconUrl.startsWith('http') ? skill.iconUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${skill.iconUrl}`}
                                                                alt={skill.language}
                                                                className="w-full h-full object-contain p-2"
                                                            />
                                                        ) : (
                                                            <FiMessageCircle className="text-2xl text-white/20" />
                                                        )}
                                                    </div>
                                                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-all shadow-lg scale-0 group-hover:scale-100 duration-300">
                                                        <FiPlus size={16} />
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleIconUpload('communication', index, file);
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-5 gap-6">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Language</label>
                                                        <input
                                                            type="text"
                                                            value={skill.language}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.communicationSkills];
                                                                newSkills[index].language = e.target.value;
                                                                setSkills({ ...skills, communicationSkills: newSkills });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary"
                                                            placeholder="e.g. English"
                                                        />
                                                    </div>
                                                    {['readLevel', 'writeLevel', 'speakLevel'].map((field) => (
                                                        <div key={field}>
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">
                                                                {field.replace('Level', '')} ({(skill as any)[field]}%)
                                                            </label>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={(skill as any)[field]}
                                                                onChange={(e) => {
                                                                    const newSkills = [...skills.communicationSkills];
                                                                    (newSkills[index] as any)[field] = parseInt(e.target.value);
                                                                    setSkills({ ...skills, communicationSkills: newSkills });
                                                                }}
                                                                className="w-full accent-primary h-2 bg-foreground/10 rounded-lg"
                                                            />
                                                        </div>
                                                    ))}
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Overall ({skill.level}%)</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={skill.level}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.communicationSkills];
                                                                newSkills[index].level = parseInt(e.target.value);
                                                                setSkills({ ...skills, communicationSkills: newSkills });
                                                            }}
                                                            className="w-full accent-primary h-2 bg-foreground/10 rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeSkill('communication', index)}
                                                    className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={addCommunicationSkill}
                                        className="w-full py-8 border-2 border-dashed border-foreground/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-foreground/30 hover:border-primary/50 hover:text-primary transition-all font-black uppercase tracking-widest text-xs"
                                    >
                                        <FiPlus size={24} />
                                        Index New Linguistic Core
                                    </button>
                                </>
                            )}

                            {activeTab === 'theoretical' && (
                                <>
                                    <div className="grid grid-cols-1 gap-6">
                                        {skills.theoreticalSkills.map((skill, index) => (
                                            <div key={index} className="premium-card p-8 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/50">
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <div className="w-full h-full rounded-xl bg-foreground/5 border border-border overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-all">
                                                        {skill.iconUrl ? (
                                                            <img
                                                                src={skill.iconUrl.startsWith('http') ? skill.iconUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${skill.iconUrl}`}
                                                                alt={skill.name}
                                                                className="w-full h-full object-contain p-2"
                                                            />
                                                        ) : (
                                                            <FiLayers className="text-2xl text-white/20" />
                                                        )}
                                                    </div>
                                                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-all shadow-lg scale-0 group-hover:scale-100 duration-300">
                                                        <FiPlus size={16} />
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleIconUpload('theoretical', index, file);
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Foundation Name</label>
                                                        <input
                                                            type="text"
                                                            value={skill.name}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.theoreticalSkills];
                                                                newSkills[index].name = e.target.value;
                                                                setSkills({ ...skills, theoreticalSkills: newSkills });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary"
                                                            placeholder="e.g. Data Structures"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Domain</label>
                                                        <select
                                                            value={skill.category}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.theoreticalSkills];
                                                                newSkills[index].category = e.target.value as any;
                                                                setSkills({ ...skills, theoreticalSkills: newSkills });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary appearance-none bg-card"
                                                        >
                                                            <option value="dsa">DSA</option>
                                                            <option value="oops">OOPS</option>
                                                            <option value="dbms">DBMS</option>
                                                            <option value="os">OS</option>
                                                            <option value="cn">CN</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Comprehension ({skill.level}%)</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={skill.level}
                                                            onChange={(e) => {
                                                                const newSkills = [...skills.theoreticalSkills];
                                                                newSkills[index].level = parseInt(e.target.value);
                                                                setSkills({ ...skills, theoreticalSkills: newSkills });
                                                            }}
                                                            className="w-full accent-primary h-2 bg-foreground/10 rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeSkill('theoretical', index)}
                                                    className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={addTheoreticalSkill}
                                        className="w-full py-8 border-2 border-dashed border-foreground/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-foreground/30 hover:border-primary/50 hover:text-primary transition-all font-black uppercase tracking-widest text-xs"
                                    >
                                        <FiPlus size={24} />
                                        Initialize Theoretical Foundation
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
