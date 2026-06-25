import mongoose, { Schema, Document } from 'mongoose';

// Communication Skills Interface
export interface ICommunicationSkill {
    language: string;
    level: number; // overall percentage 0-100
    readLevel: number; // percentage 0-100
    writeLevel: number; // percentage 0-100
    speakLevel: number; // percentage 0-100
    iconUrl?: string;
}

// Technical Skills Interface
export interface ITechnicalSkill {
    name: string;
    level: number; // percentage 0-100
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'deployment';
    iconUrl?: string;
}

// Theoretical Skills Interface
export interface ITheoreticalSkill {
    name: string;
    level: number; // percentage 0-100
    category: 'cn' | 'os' | 'dbms' | 'oops' | 'dsa' | 'other';
    iconUrl?: string;
}

export interface ISkill extends Document {
    communicationSkills: ICommunicationSkill[];
    technicalSkills: ITechnicalSkill[];
    theoreticalSkills: ITheoreticalSkill[];
    createdAt: Date;
    updatedAt: Date;
}

const CommunicationSkillSchema = new Schema({
    language: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    readLevel: { type: Number, default: 0, min: 0, max: 100 },
    writeLevel: { type: Number, default: 0, min: 0, max: 100 },
    speakLevel: { type: Number, default: 0, min: 0, max: 100 },
    iconUrl: { type: String }
});

const TechnicalSkillSchema = new Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    category: {
        type: String,
        required: true,
        enum: ['frontend', 'backend', 'database', 'devops', 'deployment']
    },
    iconUrl: { type: String }
});

const TheoreticalSkillSchema = new Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    category: {
        type: String,
        required: true,
        enum: ['cn', 'os', 'dbms', 'oops', 'dsa', 'other']
    },
    iconUrl: { type: String }
});

const SkillSchema = new Schema({
    communicationSkills: [CommunicationSkillSchema],
    technicalSkills: [TechnicalSkillSchema],
    theoreticalSkills: [TheoreticalSkillSchema]
}, {
    timestamps: true
});

export default mongoose.model<ISkill>('Skill', SkillSchema);
