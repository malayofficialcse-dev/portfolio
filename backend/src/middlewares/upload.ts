import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists at project root
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req: any, file: any, cb: any) => {
    // Better regex for image and pdf types
    const allowedExtensions = /\.(jpeg|jpg|png|gif|pdf|webp)$/i;
    const allowedMimeTypes = /image\/(jpeg|jpg|png|gif|webp)|application\/pdf/;

    const isExtAllowed = allowedExtensions.test(file.originalname);
    const isMimeAllowed = allowedMimeTypes.test(file.mimetype);

    console.log(`[UPLOAD] Processing: "${file.originalname}" | Mime: "${file.mimetype}" | Ext Match: ${isExtAllowed} | Mime Match: ${isMimeAllowed}`);

    if (isExtAllowed && isMimeAllowed) {
        return cb(null, true);
    } else {
        let reason = 'File type not supported.';
        if (!isExtAllowed) reason = `Invalid file extension: ${path.extname(file.originalname)}`;
        if (!isMimeAllowed) reason = `Invalid MIME type: ${file.mimetype}`;

        console.warn(`[UPLOAD REJECTED] ${reason}`);
        cb(new Error(`Validation Failed: ${reason}. Only images and PDF files are allowed.`));
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});
