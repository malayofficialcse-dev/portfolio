import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
    title: string;
    authors: string[];
    description: string;
    publisher?: string;
    publicationDate?: Date;
    isbn?: string;
    coverImageUrl?: string;
    imageUrls: string[];
    pdfUrls: string[];
    purchaseLinks: Array<{
        url: string;
        label: string;
        logoUrl?: string;
    }>;
    type: 'full-book' | 'chapter';
    chapterTitle?: string;
    chapterNumber?: number;
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema = new Schema({
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    description: { type: String, required: true },
    publisher: { type: String },
    publicationDate: { type: Date },
    isbn: { type: String },
    coverImageUrl: { type: String },
    imageUrls: [{ type: String }],
    pdfUrls: [{ type: String }],
    purchaseLinks: [{
        url: { type: String, required: true },
        label: { type: String, required: true },
        logoUrl: { type: String }
    }],
    type: {
        type: String,
        required: true,
        enum: ['full-book', 'chapter'],
        default: 'full-book'
    },
    chapterTitle: { type: String },
    chapterNumber: { type: Number }
}, {
    timestamps: true
});

export default mongoose.model<IBook>('Book', BookSchema);
