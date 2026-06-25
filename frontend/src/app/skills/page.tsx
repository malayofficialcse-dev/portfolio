'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiMessageCircle, FiLayers, FiCheckCircle, FiActivity } from 'react-icons/fi';
import api from '@/lib/api';
import { SkillSet } from '@/types';

export default function SkillsPage() {
    const [skills, setSkills] = useState<SkillSet | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'technical' | 'communication' | 'theoretical'>('technical');

    useEffect(() => {
        fetchSkills();
    }, []);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'technical', label: 'Technical Arsenal', icon: FiCpu },
        { id: 'communication', label: 'Linguistic Matrix', icon: FiMessageCircle },
        { id: 'theoretical', label: 'Core Foundations', icon: FiLayers },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground py-32 pb-48 selection:bg-primary/30 transition-colors duration-500">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header Container */}
                <div className="text-center md:text-left mb-16 md:mb-24 flex flex-col items-center md:items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="px-4"
                    >
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase leading-[0.9]">
                            Arsenal of <span className="gradient-text">Skills</span>
                        </h1>
                        <p className="text-lg md:text-xl text-foreground/40 max-w-2xl mx-auto md:mx-0 font-medium leading-relaxed">
                            A high-performance technical stack forged through rigorous implementation and strategic research.
                        </p>
                    </motion.div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16 md:mb-24 px-4 py-2 relative">
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-4 bg-foreground/5 p-2 rounded-[2px] backdrop-blur-3xl border border-foreground/10">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`group relative flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 rounded-[2px] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'bg-primary text-slate-900 shadow-xl shadow-primary/20' : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'
                                        }`}
                                >
                                    <Icon size={14} className={isActive ? 'text-slate-900' : 'group-hover:text-primary'} />
                                    {tab.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="tab-indicator"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary rounded-[2px] shadow-[0_0_15px_rgba(0,186,255,1)]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="grid grid-cols-1 gap-12"
                    >
                        {activeTab === 'technical' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {skills?.technicalSkills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className="group relative"
                                    >
                                        {/* Glass Background with Border */}
                                        <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-br from-foreground/[0.05] to-transparent rounded-[2px] border border-foreground/[0.08] group-hover:border-primary/40 transition-all duration-700 -z-10 group-hover:bg-foreground/[0.08]" />

                                        {/* Content Card */}
                                        <div className="p-8 md:p-10 flex flex-col h-full bg-noise-bg bg-fixed">
                                            {/* Icon & Label */}
                                            <div className="flex justify-between items-start mb-10 w-full">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[2px] scale-0 group-hover:scale-150 transition-transform duration-1000" />
                                                    {skill.iconUrl && (
                                                        <img
                                                            src={skill.iconUrl.startsWith('http') ? skill.iconUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${skill.iconUrl}`}
                                                            alt={skill.name}
                                                            className="w-20 h-20 md:w-24 md:h-24 rounded-[2px] object-cover shadow-2xl transition-all duration-700 group-hover:scale-110 bg-background"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black tracking-[.4em] uppercase opacity-20 group-hover:text-primary group-hover:opacity-100 transition-all duration-500">Tech.0{i + 1}</span>
                                                    <div className="text-2xl font-black text-primary/80 mt-1">{skill.level}%</div>
                                                </div>
                                            </div>

                                            {/* Name & Details */}
                                            <div className="mb-10">
                                                <h3 className="text-3xl font-black tracking-tight uppercase leading-none mb-4 group-hover:translate-x-1 transition-transform">{skill.name}</h3>
                                                <p className="text-[11px] text-foreground/40 leading-relaxed uppercase tracking-wider font-medium max-w-[80%]">
                                                    Engineered for high-availability systems and modern architectural implementation.
                                                </p>
                                            </div>

                                            {/* Progress Rail */}
                                            <div className="mt-auto space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-2">
                                                        <FiActivity className="text-primary animate-pulse" size={12} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">System Integration</span>
                                                    </div>
                                                </div>
                                                <div className="relative h-[6px] w-full bg-foreground/5 rounded-[2px] overflow-hidden border border-foreground/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${skill.level}%` }}
                                                        transition={{ duration: 1.5, delay: i * 0.1 + 0.5, ease: [0.23, 1, 0.32, 1] }}
                                                        className="absolute h-full bg-primary rounded-[2px]"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Decorative Bits */}
                                            <div className="absolute bottom-6 right-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1 h-1 rounded-[2px] bg-primary" />
                                                <div className="w-1 h-1 rounded-[2px] bg-primary/40" />
                                                <div className="w-1 h-1 rounded-[2px] bg-primary/10" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'communication' && (
                            <div className="grid md:grid-cols-2 gap-10">
                                {skills?.communicationSkills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="group relative p-10 md:p-14 bg-foreground/[0.02] border border-foreground/5 rounded-[2px] hover:border-primary/40 transition-all duration-700 overflow-hidden"
                                    >
                                        {/* Large Background Glyph */}
                                        <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-45 pointer-events-none">
                                            {skill.iconUrl && (
                                                <img
                                                    src={skill.iconUrl.startsWith('http') ? skill.iconUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${skill.iconUrl}`}
                                                    className="w-96 h-96 object-contain invert dark:invert-0"
                                                    alt=""
                                                />
                                            )}
                                        </div>

                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16 relative z-10">
                                            <div className="flex items-center gap-8">
                                                {skill.iconUrl && (
                                                    <div className="relative">
                                                        <div className="absolute -inset-4 bg-primary/10 blur-xl rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <img
                                                            src={skill.iconUrl.startsWith('http') ? skill.iconUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${skill.iconUrl}`}
                                                            alt={skill.language}
                                                            className="w-24 h-24 md:w-32 md:h-32 rounded-[2px] object-cover shadow-2xl border border-foreground/10 p-4 bg-background/40 relative z-10"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">{skill.language}</h3>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="w-2 h-2 rounded-[2px] bg-primary animate-ping" />
                                                        <p className="text-primary font-black uppercase tracking-[.3em] text-[10px]">Transmission High</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-foreground/5 px-8 pt-6 pb-4 rounded-[2px] border border-foreground/10 group-hover:border-primary/30 transition-colors">
                                                <div className="text-4xl font-black">{skill.level}%</div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mt-1">Overall Link</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 md:gap-8 relative z-10">
                                            {[
                                                { label: 'Read', level: skill.readLevel },
                                                { label: 'Write', level: skill.writeLevel },
                                                { label: 'Speak', level: skill.speakLevel }
                                            ].map((type) => (
                                                <div key={type.label} className="flex flex-col items-center">
                                                    <div className="relative w-full aspect-square mb-6 flex items-center justify-center p-2 rounded-[2px] border border-foreground/5 bg-foreground/[0.02]">
                                                        <svg className="w-full h-full transform -rotate-90 scale-95" viewBox="0 0 100 100">
                                                            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-foreground/[0.03]" />
                                                            <motion.circle
                                                                cx="50" cy="50" r="44"
                                                                stroke="currentColor" strokeWidth="3"
                                                                fill="transparent"
                                                                strokeDasharray={276.46}
                                                                initial={{ strokeDashoffset: 276.46 }}
                                                                animate={{ strokeDashoffset: 276.46 - (276.46 * type.level) / 100 }}
                                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                                className="text-primary drop-shadow-[0_0_8px_rgba(0,186,255,0.5)]"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-black">
                                                            {type.level}%
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 group-hover:text-primary transition-colors">{type.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'theoretical' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {skills?.theoreticalSkills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative p-10 md:p-12 h-full bg-foreground/[0.01] border border-foreground/5 rounded-[2px] hover:border-primary/40 transition-all duration-700 items-center md:items-start text-center md:text-left flex flex-col"
                                    >
                                        {/* Blueprint Pattern */}
                                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

                                        <div className="relative z-10 w-full mb-12 flex flex-col items-center md:items-start">
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2px] overflow-hidden relative mb-8 group-hover:scale-105 transition-transform duration-500 shadow-2xl shadow-primary/5">
                                                {skill.iconUrl ? (
                                                    <img
                                                        src={skill.iconUrl.startsWith('http') ? skill.iconUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}${skill.iconUrl}`}
                                                        className="w-full h-full object-cover grayscale invert dark:invert-0 opacity-80 group-hover:opacity-100 transition-all duration-500 bg-background"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <FiLayers className="text-primary/40 group-hover:text-primary transition-colors" size={32} />
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-[2px] bg-primary" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Architecture v1.0</span>
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight group-hover:translate-x-1 transition-transform">{skill.name}</h3>
                                                <div className="pt-4 border-t border-foreground/5 max-w-[80%] mx-auto md:mx-0">
                                                    <p className="text-[10px] text-foreground/30 leading-relaxed uppercase tracking-widest font-bold italic">
                                                        Systems Analysis & Core Theoretical Framework Implementation.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 w-full mt-auto space-y-6">
                                            <div className="flex justify-between items-center px-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-[.3em] text-foreground/20">Competency</span>
                                                    <div className="h-0.5 w-6 bg-primary/40 mt-1" />
                                                </div>
                                                <span className="text-3xl font-black italic">{skill.level}%</span>
                                            </div>
                                            <div className="h-5 w-full bg-foreground/[0.03] rounded-[2px] overflow-hidden border border-foreground/5 p-1">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.level}%` }}
                                                    transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                                    className="h-full bg-primary rounded-[2px] relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
