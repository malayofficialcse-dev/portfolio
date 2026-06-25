import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    technologies: string[];
    imageUrls: string[]; // Support multiple images
    pdfUrls: string[];   // Support multiple PDFs
    projectUrl?: string;
    githubUrl?: string;
    startDate?: Date;
    endDate?: Date;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    imageUrls: [{ type: String }],
    pdfUrls: [{ type: String }],
    projectUrl: { type: String },
    githubUrl: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    featured: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema);
