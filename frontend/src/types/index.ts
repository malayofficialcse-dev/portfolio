export interface Profile {
    _id?: string;
    name: string;
    title: string;
    bio: string;
    description: string;
    profileImage?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    resume?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CommunicationSkill {
    language: string;
    level: number;
    readLevel: number;
    writeLevel: number;
    speakLevel: number;
    iconUrl?: string;
}

export interface TechnicalSkill {
    name: string;
    level: number;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'deployment';
    iconUrl?: string;
}

export interface TheoreticalSkill {
    name: string;
    level: number;
    category: 'cn' | 'os' | 'dbms' | 'oops' | 'dsa' | 'other';
    iconUrl?: string;
}

export interface SkillSet {
    _id?: string;
    communicationSkills: CommunicationSkill[];
    technicalSkills: TechnicalSkill[];
    theoreticalSkills: TheoreticalSkill[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Project {
    _id?: string;
    title: string;
    description: string;
    technologies: string[];
    imageUrls: string[];
    pdfUrls: string[];
    projectUrl?: string;
    githubUrl?: string;
    startDate?: Date;
    endDate?: Date;
    featured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ResearchPaper {
    _id?: string;
    title: string;
    authors: string[];
    abstract: string;
    journal?: string;
    conference?: string;
    publicationDate?: Date;
    doi?: string;
    pdfUrls?: string[];
    imageUrls?: string[];
    externalLinks?: {
        label: string;
        url: string;
        logoUrl?: string;
    }[];
    keywords: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Book {
    _id?: string;
    title: string;
    authors: string[];
    description: string;
    publisher?: string;
    publicationDate?: Date;
    isbn?: string;
    coverImageUrl?: string;
    imageUrls?: string[];
    pdfUrls?: string[];
    purchaseLinks?: {
        label: string;
        url: string;
        logoUrl?: string;
    }[];
    type: 'full-book' | 'chapter';
    chapterTitle?: string;
    chapterNumber?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Certificate {
    _id?: string;
    title: string;
    issuingOrganization: string;
    issueDate?: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
    imageUrl?: string;
    pdfUrl?: string;
    description?: string;
    skills: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Academic {
    _id?: string;
    institution: string;
    degree: string;
    major: string;
    startDate: string;
    endDate?: string;
    location: string;
    description: string;
    logoUrl?: string;
    degreeCertificateUrl?: string;
    registrationCertificateUrl?: string;
    semesterResults: {
        semester: string;
        gpa: number;
        marksheetUrl?: string;
        certificateUrl?: string;
    }[];
    imageUrls: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ExperienceProject {
    title: string;
    description: string;
    githubLink?: string;
    deployedLink?: string;
    images: string[];
}

export interface Experience {
    _id: string;
    company: string;
    role: string;
    joinDate: string;
    endDate?: string;
    isCurrent: boolean;
    documentUrls: string[];
    stipend?: string;
    skills: Array<{ name: string; iconUrl?: string }>;
    projects: ExperienceProject[];
    imageUrls?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Event {
    _id?: string;
    name: string;
    type: string;
    description: string;
    location: string;
    date: string;
    skills: string[];
    certificateUrls: string[];
    imageUrls: string[];
    createdAt?: string;
    updatedAt?: string;
}
