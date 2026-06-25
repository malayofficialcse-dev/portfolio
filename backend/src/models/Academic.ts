import mongoose, { Schema, Document } from 'mongoose';

export interface ISemesterResult {
    semester: string;
    gpa: number;
    marksheetUrl?: string; // PDF
    certificateUrl?: string; // PDF
}

export interface IAcademic extends Document {
    institution: string;
    degree: string;
    major: string;
    startDate: Date;
    endDate?: Date;
    location: string;
    description: string;
    logoUrl?: string; // Image
    degreeCertificateUrl?: string; // PDF
    registrationCertificateUrl?: string; // PDF
    semesterResults: ISemesterResult[];
    imageUrls: string[]; // Carousel images
    createdAt: Date;
    updatedAt: Date;
}

const SemesterResultSchema = new Schema({
    semester: { type: String, required: true },
    gpa: { type: Number },
    marksheetUrl: { type: String },
    certificateUrl: { type: String }
});

const AcademicSchema = new Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    major: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    description: { type: String, required: true },
    logoUrl: { type: String },
    degreeCertificateUrl: { type: String },
    registrationCertificateUrl: { type: String },
    semesterResults: [SemesterResultSchema],
    imageUrls: [{ type: String }]
}, {
    timestamps: true
});

export default mongoose.model<IAcademic>('Academic', AcademicSchema);
