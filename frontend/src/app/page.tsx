"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiCode,
  FiBook,
  FiAward,
  FiFileText,
  FiArrowRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiUser,
  FiZap,
  FiDribbble,
} from "react-icons/fi";
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
  SiTailwindcss, SiFramer, SiPython, SiDjango,
  SiPostgresql, SiMongodb, SiDocker,
  SiJavascript, SiGraphql, SiRedis, SiThreedotjs
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import api from "@/lib/api";
import { Profile } from "@/types";

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-[2px]"></div>
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-[2px] animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-primary/30 selection:text-foreground">
      {/* Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 mesh-gradient opacity-30 dark:opacity-20"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center pt-24 md:pt-32 pb-12 md:pb-20 z-10">
        <div className="container mx-auto px-4 md:px-6 overflow-hidden">
          <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr,0.8fr] gap-8 md:gap-12 items-center">
            {/* Left Content Area - Focused on Text and Identity */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="z-20 order-1 w-full"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-[2px] glass-effect border border-foreground/5 mb-6 md:mb-10">
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-[2px] bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <FiZap className="text-[8px] md:text-[10px] text-primary" />
                  </div>
                </div>
                <span className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">Status: Available for Collaboration</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[7rem] font-bold mb-6 md:mb-8 leading-[0.85] tracking-tight group">
                <span className="block text-foreground transition-transform duration-500 group-hover:translate-x-2 italic">DIGITAL</span>
                <span className="gradient-text block transition-transform duration-700 group-hover:translate-x-4">ARCHITECT</span>
              </h1>

              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10 md:mb-12">
                <p className="text-sm md:text-lg lg:text-xl text-foreground/50 max-w-lg leading-relaxed text-balance">
                  {profile?.bio || "Transforming complex challenges into elegant digital experiences through strategic engineering and obsessive design."}
                </p>
                <div className="hidden md:block h-12 w-px bg-foreground/10"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Identity</span>
                  <span className="text-base md:text-xl font-bold uppercase">{profile?.name || "MALAY"}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-8 items-center">
                <Link
                  href="/projects"
                  className="group relative px-6 md:px-10 py-4 md:py-5 bg-foreground text-background rounded-[2px] font-bold overflow-hidden transition-all hover:pr-14 w-full md:w-auto text-center"
                >
                  <span className="relative z-10 uppercase text-[10px] md:text-xs tracking-[0.2em]">Explore Registry</span>
                  <FiArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </Link>

                <div className="flex gap-4 md:gap-6 items-center justify-center w-full md:w-auto">
                  <a href={profile?.github || "#"} className="p-2.5 md:p-3 rounded-[2px] border border-foreground/5 hover:bg-foreground/5 transition-colors text-lg md:text-xl opacity-60 hover:opacity-100">
                    <FiGithub />
                  </a>
                  <a href={profile?.linkedin || "#"} className="p-2.5 md:p-3 rounded-[2px] border border-foreground/5 hover:bg-foreground/5 transition-colors text-lg md:text-xl opacity-60 hover:opacity-100">
                    <FiLinkedin />
                  </a>
                  <a href="#" className="p-2.5 md:p-3 rounded-[2px] border border-foreground/5 hover:bg-foreground/5 transition-colors text-lg md:text-xl opacity-60 hover:opacity-100">
                    <FiDribbble />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Area - Image and Horizontal Carousel side-by-side on Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              style={{ y: typeof window !== 'undefined' && window.innerWidth > 1024 ? y1 : 0 }}
              className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-8 justify-center lg:justify-end order-2 mb-12 lg:mb-0 w-full lg:max-w-none"
            >
              {/* Horizontal Multi-Tier Carousel Area */}
              <div className="w-full lg:w-auto lg:min-w-[400px] flex flex-col gap-6 lg:gap-8 text-center lg:text-right px-2 lg:pr-6 overflow-hidden">
                {/* Engineering Ethos Text */}
                <div className="mb-2 opacity-50 lg:opacity-40 px-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2 text-primary">Architectural Principles</p>
                  <p className="text-[8px] md:text-[9px] uppercase leading-relaxed tracking-widest max-w-xs mx-auto lg:ml-auto">
                    Engineered for scalability, technical performance, and aesthetic precision.
                  </p>
                </div>

                {/* Category 1: Frontend Infrastructure */}
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-center lg:justify-end gap-3 opacity-30">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Phase 01 / Frontend</span>
                    <div className="h-px w-8 md:w-12 bg-foreground/20"></div>
                  </div>
                  <div className="overflow-hidden relative h-14 md:h-16 flex items-center">
                    <motion.div
                      animate={{ x: [0, -400] }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      className="flex gap-6 md:gap-10 items-center whitespace-nowrap"
                    >
                      {[
                        { icon: SiReact, color: 'text-primary', name: 'React' },
                        { icon: SiNextdotjs, color: 'text-foreground', name: 'Next.js' },
                        { icon: SiTypescript, color: 'text-secondary', name: 'TypeScript' },
                        { icon: SiTailwindcss, color: 'text-primary', name: 'Tailwind' },
                        { icon: SiJavascript, color: 'text-secondary', name: 'JavaScript' },
                        { icon: SiFramer, color: 'text-foreground', name: 'Framer' }
                      ].concat([
                        { icon: SiReact, color: 'text-primary', name: 'React' },
                        { icon: SiNextdotjs, color: 'text-foreground', name: 'Next.js' },
                        { icon: SiTypescript, color: 'text-secondary', name: 'TypeScript' },
                        { icon: SiTailwindcss, color: 'text-primary', name: 'Tailwind' },
                        { icon: SiJavascript, color: 'text-secondary', name: 'JavaScript' },
                        { icon: SiFramer, color: 'text-foreground', name: 'Framer' }
                      ]).map((tech, i) => (
                        <div key={i} className="group/item relative flex flex-col items-center shrink-0">
                          <tech.icon className={`text-4xl md:text-5xl opacity-40 lg:opacity-20 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-500 cursor-pointer ${tech.color}`} />
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap text-primary">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Category 2: Backend Architecture */}
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-center lg:justify-end gap-3 opacity-30">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Phase 02 / Core Systems</span>
                    <div className="h-px w-8 md:w-12 bg-foreground/20"></div>
                  </div>
                  <div className="overflow-hidden relative h-14 md:h-16 flex items-center">
                    <motion.div
                      animate={{ x: [-400, 0] }}
                      transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                      className="flex gap-6 md:gap-10 items-center whitespace-nowrap"
                    >
                      {[
                        { icon: SiNodedotjs, color: 'text-success', name: 'Node.js' },
                        { icon: SiPython, color: 'text-primary', name: 'Python' },
                        { icon: SiDjango, color: 'text-foreground', name: 'Django' },
                        { icon: SiPostgresql, color: 'text-secondary', name: 'Postgres' },
                        { icon: SiMongodb, color: 'text-success', name: 'MongoDB' },
                        { icon: SiRedis, color: 'text-error', name: 'Redis' }
                      ].concat([
                        { icon: SiNodedotjs, color: 'text-success', name: 'Node.js' },
                        { icon: SiPython, color: 'text-primary', name: 'Python' },
                        { icon: SiDjango, color: 'text-foreground', name: 'Django' },
                        { icon: SiPostgresql, color: 'text-secondary', name: 'Postgres' },
                        { icon: SiMongodb, color: 'text-success', name: 'MongoDB' },
                        { icon: SiRedis, color: 'text-error', name: 'Redis' }
                      ]).map((tech, i) => (
                        <div key={i} className="group/item relative flex flex-col items-center shrink-0">
                          <tech.icon className={`text-4xl md:text-5xl opacity-40 lg:opacity-20 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-500 cursor-pointer ${tech.color}`} />
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap text-primary">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Category 3: DevOps & Intelligence */}
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-center lg:justify-end gap-3 opacity-30">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Phase 03 / Cloud Ops</span>
                    <div className="h-px w-8 md:w-12 bg-foreground/20"></div>
                  </div>
                  <div className="overflow-hidden relative h-14 md:h-16 flex items-center">
                    <motion.div
                      animate={{ x: [0, -400] }}
                      transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                      className="flex gap-6 md:gap-10 items-center whitespace-nowrap"
                    >
                      {[
                        { icon: SiDocker, color: 'text-primary', name: 'Docker' },
                        { icon: FaAws, color: 'text-warning', name: 'AWS' },
                        { icon: SiGraphql, color: 'text-error', name: 'GraphQL' },
                        { icon: SiThreedotjs, color: 'text-foreground', name: 'Three.js' },
                        { icon: FiGithub, color: 'text-foreground', name: 'GitHub' },
                        { icon: FiZap, color: 'text-primary', name: 'Vite/Zap' }
                      ].concat([
                        { icon: SiDocker, color: 'text-primary', name: 'Docker' },
                        { icon: FaAws, color: 'text-warning', name: 'AWS' },
                        { icon: SiGraphql, color: 'text-error', name: 'GraphQL' },
                        { icon: SiThreedotjs, color: 'text-foreground', name: 'Three.js' },
                        { icon: FiGithub, color: 'text-foreground', name: 'GitHub' },
                        { icon: FiZap, color: 'text-primary', name: 'Vite/Zap' }
                      ]).map((tech, i) => (
                        <div key={i} className="group/item relative flex flex-col items-center shrink-0">
                          <tech.icon className={`text-4xl md:text-5xl opacity-40 lg:opacity-20 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-500 cursor-pointer ${tech.color}`} />
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap text-primary">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Main Profile Image */}
              <div className="relative aspect-[4/5] w-full max-w-[450px]">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 rounded-[2px] blur-2xl"></div>
                <div className="relative h-full w-full rounded-[2px] overflow-hidden border border-foreground/10 shadow-3xl bg-foreground/[0.03] backdrop-blur-xl group">
                  {profile?.profileImage ? (
                    <Image
                      src={
                        profile.profileImage.startsWith("http")
                          ? profile.profileImage
                          : `${process.env.NEXT_PUBLIC_BASE_URL ||
                          "http://localhost:5001"
                          }${profile.profileImage}`
                      }
                      alt={profile.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <FiUser size={120} />
                    </div>
                  )}
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="p-6 glass-effect border border-white/10 rounded-[2px]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 italic">
                        Current Vector
                      </p>
                      <p className="text-sm font-medium opacity-80 leading-relaxed">
                        "Pushing the boundaries of modern web architecture
                        through minimalist principles."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 w-24 h-24 glass-effect rounded-[2px] flex items-center justify-center border border-foreground/10 shadow-2xl"
                >
                  <FiCode className="text-3xl text-primary" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-8 -left-8 px-6 py-4 glass-effect rounded-[2px] flex items-center gap-3 border border-foreground/10 shadow-2xl"
                >
                  <div className="w-2 h-2 rounded-[2px] bg-success animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-foreground">
                    Verified Operator
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Navigation */}
      <section className="py-40 relative z-10 border-t border-foreground/5 bg-foreground/[0.01]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FiCode,
                title: "Systems",
                desc: "Core Technologies",
                link: "/skills",
                accent: "primary",
              },
              {
                icon: FiFileText,
                title: "Projects",
                desc: "Strategic Assets",
                link: "/projects",
                accent: "secondary",
              },
              {
                icon: FiBook,
                title: "Journal",
                desc: "Research & Notes",
                link: "/research",
                accent: "primary",
              },
              {
                icon: FiAward,
                title: "Proofs",
                desc: "Certifications",
                link: "/certificates",
                accent: "secondary",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item.link}
                  className="group premium-card block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 transform group-hover:scale-150 group-hover:rotate-12 transition-transform duration-700 opacity-[0.03] pointer-events-none">
                    <item.icon size={120} />
                  </div>

                  <div className="mb-12">
                    <div className="w-12 h-12 rounded-[2px] bg-foreground/5 flex items-center justify-center border border-foreground/5 group-hover:bg-primary transition-colors text-foreground group-hover:text-background shadow-inner">
                      <item.icon className="text-xl" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2 block">
                      {item.desc}
                    </span>
                    <h3 className="text-3xl font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities / Tech Stack */}
      <section className="py-20 relative z-10 overflow-hidden border-y border-foreground/5 bg-foreground/[0.02]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xs">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4 italic">Capabilities</h2>
              <p className="text-sm font-medium opacity-40 leading-relaxed uppercase tracking-widest">
                Specialized in high-performance digital core systems.
              </p>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-12 items-center animate-scroll opacity-20 hover:opacity-100 transition-opacity duration-700 select-none">
                {['React', 'Next.js', 'Typescript', 'Node.js', 'PostgreSQL', 'Python', 'AWS', 'Docker', 'Redis', 'GraphQL'].map((tech) => (
                  <span key={tech} className="text-2xl md:text-5xl font-black uppercase tracking-tighter whitespace-nowrap">
                    {tech}
                  </span>
                ))}
                {/* Duplicate for infinite effect */}
                {['React', 'Next.js', 'Typescript', 'Node.js', 'PostgreSQL', 'Python', 'AWS', 'Docker', 'Redis', 'GraphQL'].map((tech) => (
                  <span key={`${tech}-dup`} className="text-2xl md:text-5xl font-black uppercase tracking-tighter whitespace-nowrap">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Ethos */}
      <section className="py-40 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto border border-foreground/5 rounded-[2px] p-12 md:p-24 relative bg-foreground/[0.02] backdrop-blur-3xl overflow-hidden group hover:border-primary/20 transition-colors duration-700">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] translate-x-12 -translate-y-12 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <FiZap size={400} />
            </div>

            <div className="relative z-10 grid lg:grid-cols-[1.2fr,0.8fr] gap-20 items-end">
              <div className="space-y-12">
                <div className="h-px w-24 bg-primary"></div>
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary mb-8 italic">Core Philosophy</h2>
                  <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1] italic text-balance">
                    "Code is the <span className="text-primary">Architecture</span> of modern thought."
                  </p>
                </div>
                <p className="text-xl text-foreground/40 leading-relaxed font-medium transition-colors hover:text-foreground/60 max-w-2xl">
                  {profile?.description || "Specialized in crafting pixel-perfect interfaces and robust backend architectures. My approach blends technical excellence with emotional resonance and strategic design."}
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { label: 'System Precision', value: 98, color: 'primary' },
                  { label: 'Architecture Integrity', value: 95, color: 'secondary' },
                  { label: 'Digital Resilience', value: 92, color: 'primary' }
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-[2px] border border-foreground/5 bg-foreground/5 hover:bg-foreground/10 transition-all group/stat">
                    <div className="flex justify-between items-end mb-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover/stat:opacity-100 transition-opacity">{stat.label}</h4>
                      <span className="text-xs font-black text-primary italic">0.{stat.value}</span>
                    </div>
                    <div className="h-1 w-full bg-foreground/5 rounded-[2px] overflow-hidden">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: stat.value / 100 }}
                        className={`h-full bg-${stat.color} origin-left transition-transform duration-1000`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 relative z-10 bg-foreground text-background overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] mesh-gradient animate-slow-spin"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-7xl md:text-[12rem] font-bold uppercase tracking-tighter leading-none mb-20 group">
              LET'S{" "}
              <span className="text-primary italic transition-all group-hover:tracking-widest">
                BUILD
              </span>
            </h2>

            <div className="flex flex-col md:flex-row justify-center items-center gap-12 group">
              <a
                href={`mailto:${profile?.email || "malay@example.com"}`}
                className="text-2xl md:text-5xl font-bold uppercase tracking-tighter hover:text-primary transition-all duration-300 flex items-center gap-6"
              >
                {profile?.email || "INITIATE.PROTOCOL"}{" "}
                <FiMail className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="hidden md:block w-px h-20 bg-background/20 group-hover:h-32 transition-all duration-500"></div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-4 italic">
                  Location Baseline
                </span>
                <span className="text-xl font-bold flex items-center gap-3 uppercase">
                  <FiMapPin className="text-primary" />{" "}
                  {profile?.location || "Bengaluru, IN"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-12 relative z-10 border-t border-foreground/5 flex justify-between container mx-auto px-6 bg-background/50 backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
          © 2025 Architectural Unit 01
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
          System Latency: 4ms
        </p>
      </footer>
    </div>
  );
}
