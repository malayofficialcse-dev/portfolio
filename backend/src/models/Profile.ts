import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  description: { type: String, required: true },
  profileImage: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  website: { type: String },
  github: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  resume: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);
