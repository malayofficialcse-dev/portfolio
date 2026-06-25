import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    name: string;
    type: string;
    description: string;
    location: string;
    date: Date;
    skills: string[];
    certificateUrls: string[]; // Support multiple PDFs
    imageUrls: string[]; // Carousel images
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Hackathon, Workshop, Seminar
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    skills: [{ type: String }],
    certificateUrls: [{ type: String }],
    imageUrls: [{ type: String }]
}, {
    timestamps: true
});

export default mongoose.model<IEvent>('Event', EventSchema);
