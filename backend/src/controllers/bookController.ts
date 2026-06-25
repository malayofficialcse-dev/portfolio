import { Request, Response } from 'express';
import Book from '../models/Book';
import cloudinary from 'cloudinary';
import fs from 'fs';

// Get all books
export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await Book.find().sort({ publicationDate: -1 });
        res.json(books);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single book
export const getBook = async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create book
export const createBook = async (req: Request, res: Response) => {
    try {
        const { purchaseLinks, authors, ...otherData } = req.body;
        
        const book = new Book({
            ...otherData,
            authors: Array.isArray(authors) ? authors : (typeof authors === 'string' ? authors.split(',').map(a => a.trim()) : authors)
        });

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];
            
            const coverFile = files.find(f => f.fieldname === 'coverImage');
            const imageFiles = files.filter(f => f.fieldname === 'images');
            const pdfFiles = files.filter(f => f.fieldname === 'pdfs');
            
            // Upload Cover Image
            if (coverFile) {
                const result = await cloudinary.v2.uploader.upload(coverFile.path);
                book.coverImageUrl = result.secure_url;
                fs.unlinkSync(coverFile.path);
            }

            // Upload Multiple Images
            if (imageFiles.length > 0) {
                const urls = [];
                for (const file of imageFiles) {
                    const result = await cloudinary.v2.uploader.upload(file.path);
                    urls.push(result.secure_url);
                    fs.unlinkSync(file.path);
                }
                book.imageUrls = urls;
            }

            // Store Local PDFs
            if (pdfFiles.length > 0) {
                book.pdfUrls = pdfFiles.map(f => `/uploads/${f.filename}`);
            }

            // Handle Purchase Links Logos
            if (purchaseLinks) {
                const links = typeof purchaseLinks === 'string' ? JSON.parse(purchaseLinks) : purchaseLinks;
                const processedLinks = [];
                
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    const logoFile = files.find(f => f.fieldname === `logo_${i}`);
                    let logoUrl = link.logoUrl;

                    if (logoFile) {
                        const result = await cloudinary.v2.uploader.upload(logoFile.path);
                        logoUrl = result.secure_url;
                        fs.unlinkSync(logoFile.path);
                    }
                    processedLinks.push({ ...link, logoUrl });
                }
                book.purchaseLinks = processedLinks;
            }
        }

        await book.save();
        res.status(201).json({ message: 'Book created successfully', book });
    } catch (error: any) {
        console.error('[BOOK CREATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update book
export const updateBook = async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const { purchaseLinks, authors, imageUrls, pdfUrls, ...otherData } = req.body;
        Object.assign(book, otherData);
        
        if (authors) {
            book.authors = Array.isArray(authors) ? authors : (typeof authors === 'string' ? authors.split(',').map(a => a.trim()) : authors);
        }

        // Handle existing URLs sent via body (if any removals happened)
        if (imageUrls) book.imageUrls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
        if (pdfUrls) book.pdfUrls = Array.isArray(pdfUrls) ? pdfUrls : [pdfUrls];

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];
            
            const coverFile = files.find(f => f.fieldname === 'coverImage');
            const imageFiles = files.filter(f => f.fieldname === 'images');
            const pdfFiles = files.filter(f => f.fieldname === 'pdfs');

            if (coverFile) {
                const result = await cloudinary.v2.uploader.upload(coverFile.path);
                book.coverImageUrl = result.secure_url;
                fs.unlinkSync(coverFile.path);
            }

            if (imageFiles.length > 0) {
                const newUrls = [];
                for (const file of imageFiles) {
                    const result = await cloudinary.v2.uploader.upload(file.path);
                    newUrls.push(result.secure_url);
                    fs.unlinkSync(file.path);
                }
                book.imageUrls = [...(book.imageUrls || []), ...newUrls];
            }

            if (pdfFiles.length > 0) {
                const newPdfs = pdfFiles.map(f => `/uploads/${f.filename}`);
                book.pdfUrls = [...(book.pdfUrls || []), ...newPdfs];
            }

            if (purchaseLinks) {
                const links = typeof purchaseLinks === 'string' ? JSON.parse(purchaseLinks) : purchaseLinks;
                const processedLinks = [];
                
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    const logoFile = files.find(f => f.fieldname === `logo_${i}`);
                    let logoUrl = link.logoUrl;

                    if (logoFile) {
                        const result = await cloudinary.v2.uploader.upload(logoFile.path);
                        logoUrl = result.secure_url;
                        fs.unlinkSync(logoFile.path);
                    }
                    processedLinks.push({ ...link, logoUrl });
                }
                book.purchaseLinks = processedLinks;
            }
        }

        await book.save();
        res.json({ message: 'Book updated successfully', book });
    } catch (error: any) {
        console.error('[BOOK UPDATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete book
export const deleteBook = async (req: Request, res: Response) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
