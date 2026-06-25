import mongoose, { Schema, Document } from 'mongoose';

export interface IResearchPaper extends Document {
    title: string;
    authors: string[];
    abstract: string;
    journal?: string;
    conference?: string;
    publicationDate?: Date;
    doi?: string;
    pdfUrls: string[];
    imageUrls: string[];
    externalLinks: Array<{
        url: string;
        label: string;
        logoUrl?: string;
    }>;
    keywords: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ResearchPaperSchema = new Schema({
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    abstract: { type: String, required: true },
    journal: { type: String },
    conference: { type: String },
    publicationDate: { type: Date },
    doi: { type: String },
    pdfUrls: [{ type: String }],
    imageUrls: [{ type: String }],
    externalLinks: [{
        url: { type: String, required: true },
        label: { type: String, required: true },
        logoUrl: { type: String }
    }],
    keywords: [{ type: String }]
}, {
    timestamps: true
});

export default mongoose.model<IResearchPaper>('ResearchPaper', ResearchPaperSchema);
