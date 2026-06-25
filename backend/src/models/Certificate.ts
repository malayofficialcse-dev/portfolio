import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
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
    createdAt: Date;
    updatedAt: Date;
}

const CertificateSchema = new Schema({
    title: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    credentialId: { type: String },
    credentialUrl: { type: String },
    imageUrl: { type: String },
    pdfUrl: { type: String },
    description: { type: String },
    skills: [{ type: String }]
}, {
    timestamps: true
});

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
