import mongoose, { Schema, Document } from 'mongoose';

export interface IExperienceProject {
    title: string;
    description: string;
    githubLink?: string;
    deployedLink?: string;
    images: string[];
}

export interface IExperience extends Document {
    company: string;
    role: string;
    joinDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    documentUrls: string[]; // Support multiple PDFs
    stipend?: string;
    skills: Array<{ name: string; iconUrl?: string }>;
    projects: IExperienceProject[];
    imageUrls: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ExperienceProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubLink: { type: String },
    deployedLink: { type: String },
    images: [{ type: String }]
});

const ExperienceSchema = new Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    joinDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    documentUrls: [{ type: String }],
    stipend: { type: String },
    skills: [{
        name: { type: String, required: true },
        iconUrl: { type: String }
    }],
    projects: [ExperienceProjectSchema],
    imageUrls: [{ type: String }]
}, {

    timestamps: true
});

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
