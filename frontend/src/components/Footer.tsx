'use client';

import Link from 'next/link';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail, FiMapPin, FiArrowUp, FiTerminal } from 'react-icons/fi';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-background text-foreground pt-32 pb-16 overflow-hidden mt-32 border-t border-foreground/5 shadow-2xl">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Meta */}
                    <div className="lg:col-span-5 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                            <div className="w-14 h-14 bg-foreground rounded-[2px] flex items-center justify-center text-background shadow-xl">
                                <FiTerminal size={32} />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">MALAY MAITY</h2>
                        </div>
                        <p className="text-xl text-foreground/40 max-w-md leading-relaxed mb-10 font-medium italic mx-auto md:mx-0">
                            "Specializing in the intersection of architectural elegance and technical performance. Building the future of the digital landscape through strategic engineering."
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            {[
                                { icon: FiGithub, href: 'https://github.com' },
                                { icon: FiLinkedin, href: 'https://linkedin.com' },
                                { icon: FiTwitter, href: 'https://twitter.com' }
                            ].map((social, i) => (
                                <a
                                    key={SocialID(i)}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-[2px] bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all duration-500 shadow-sm"
                                >
                                    <social.icon size={24} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 border-b border-primary/10 pb-4 inline-block">Navigation</h3>
                            <ul className="space-y-4">
                                {['Skills', 'Projects', 'Research', 'Books', 'Certificates'].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase()}`} className="text-lg text-foreground/50 hover:text-primary transition-colors font-black uppercase tracking-tighter">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 border-b border-primary/10 pb-4 inline-block">Registry</h3>
                            <ul className="space-y-4">
                                {['Privacy Protocol', 'Terms of Use', 'Security Hub'].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-lg text-foreground/50 hover:text-primary transition-colors font-black uppercase tracking-tighter">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:col-span-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 border-b border-primary/10 pb-4 inline-block">Liaison</h3>
                            <ul className="space-y-6">
                                <li className="flex items-center justify-center md:justify-start gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-[2px] bg-foreground/5 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all shadow-sm">
                                        <FiMail />
                                    </div>
                                    <span className="text-foreground/40 group-hover:text-foreground font-black uppercase tracking-tighter transition-all truncate">maitymalay27747@gmail.com</span>
                                </li>
                                <li className="flex items-center justify-center md:justify-start gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-[2px] bg-foreground/5 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all shadow-sm">
                                        <FiMapPin />
                                    </div>
                                    <span className="text-foreground/40 group-hover:text-foreground font-black uppercase tracking-tighter transition-all">Kolkata, WB, IN</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-16 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-12">
                    <p className="text-foreground/20 font-black text-[10px] uppercase tracking-[0.4em] order-2 md:order-1">
                        &copy; {new Date().getFullYear()} MALAY MAITY / PROTOCOL ESTABLISHED
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-4 px-10 py-5 bg-foreground text-background rounded-[2px] hover:bg-primary hover:text-slate-900 transition-all duration-700 active:scale-95 shadow-2xl order-1 md:order-2"
                    >
                        <span className="font-black text-[10px] uppercase tracking-[0.3em]">Elevate to Top</span>
                        <FiArrowUp className="group-hover:-translate-y-2 transition-transform duration-500" />
                    </button>

                    <p className="text-foreground/20 font-black text-[10px] uppercase tracking-[0.4em] order-3">
                        Designed for the elite / v4.2
                    </p>
                </div>
            </div>
        </footer>
    );
}

const SocialID = (i: number) => `social-${i}`;
