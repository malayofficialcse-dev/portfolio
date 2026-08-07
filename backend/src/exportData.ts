import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

import Academic from './models/Academic';
import Book from './models/Book';
import Certificate from './models/Certificate';
import Event from './models/Event';
import Experience from './models/Experience';
import Profile from './models/Profile';
import Project from './models/Project';
import QuickLink from './models/QuickLink';
import ResearchPaper from './models/ResearchPaper';
import Skill from './models/Skill';

async function exportData() {
  const uri = process.env.MONGODB_URI as string;
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected!');

  const dataDir = path.join(__dirname, '..', '..', 'static_port', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const collections = [
    { name: 'academics', model: Academic as any, file: 'academicsData.ts' },
    { name: 'books', model: Book as any, file: 'booksData.ts' },
    { name: 'certificates', model: Certificate as any, file: 'certificatesData.ts' },
    { name: 'events', model: Event as any, file: 'eventsData.ts' },
    { name: 'experiences', model: Experience as any, file: 'experiencesData.ts' },
    { name: 'projects', model: Project as any, file: 'projectsData.ts' },
    { name: 'quickLinks', model: QuickLink as any, file: 'quickLinksData.ts' },
    { name: 'researchPapers', model: ResearchPaper as any, file: 'researchPapersData.ts' },
    { name: 'skills', model: Skill as any, file: 'skillsData.ts' }
  ];

  for (const item of collections) {
    const docs = await item.model.find().lean();
    console.log(`Exported ${docs.length} documents for ${item.name}`);
    const content = `export const ${item.name}Data = ${JSON.stringify(docs, null, 2)};\n`;
    fs.writeFileSync(path.join(dataDir, item.file), content, 'utf-8');
  }

  const profileDoc = await (Profile as any).findOne().lean();
  console.log(`Exported profile: ${profileDoc ? 'found' : 'not found'}`);
  const profileContent = `export const profileData = ${JSON.stringify(profileDoc || null, null, 2)};\n`;
  fs.writeFileSync(path.join(dataDir, 'profileData.ts'), profileContent, 'utf-8');

  await mongoose.disconnect();
  console.log('All data exported successfully!');
}

exportData().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
