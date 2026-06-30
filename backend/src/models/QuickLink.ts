import mongoose, { Schema, Document } from 'mongoose';

export interface IQuickLink extends Document {
    name: string;
    icon: string;
    text: string;
    link: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const QuickLinkSchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    text: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<IQuickLink>('QuickLink', QuickLinkSchema);
