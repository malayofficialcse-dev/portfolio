"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Book } from "@/types";
import {
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiX,
  FiBook,
  FiCamera,
  FiFileText,
} from "react-icons/fi";
import Link from "next/link";

const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

interface PurchaseLinkFormData {
    label: string;
    url: string;
    logoUrl?: string;
    logoFile?: File;
    logoPreview?: string;
}

interface BookFormData extends Omit<Book, 'purchaseLinks'> {
    purchaseLinks?: PurchaseLinkFormData[];
}

export default function AdminBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<BookFormData>>({
    title: "",
    authors: [],
    description: "",
    publisher: "",
    isbn: "",
    type: "full-book",
    imageUrls: [],
    pdfUrls: [],
    purchaseLinks: []
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchBooks();
  }, [router]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (book: Book | null = null) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
      setCoverPreview(book.coverImageUrl ? resolveImageUrl(book.coverImageUrl) : null);
      setPreviews((book.imageUrls || []).map(resolveImageUrl));
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        authors: [],
        description: "",
        publisher: "",
        isbn: "",
        type: "full-book",
        imageUrls: [],
        pdfUrls: [],
        purchaseLinks: []
      });
      setCoverPreview(null);
      setPreviews([]);
    }
    setImageFiles([]);
    setCoverFile(null);
    setPdfFiles([]);
    setIsModalOpen(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles([...imageFiles, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      
      // Basic fields
      data.append('title', formData.title || '');
      data.append('description', formData.description || '');
      data.append('publisher', formData.publisher || '');
      data.append('isbn', formData.isbn || '');
      data.append('type', formData.type || 'full-book');
      
      // Arrays
      (formData.authors || []).forEach(a => data.append('authors[]', a));
      (formData.imageUrls || []).forEach(url => data.append('imageUrls', url));
      (formData.pdfUrls || []).forEach(url => data.append('pdfUrls', url));
      
      // New Files
      if (coverFile) data.append('coverImage', coverFile);
      imageFiles.forEach(file => data.append('images', file));
      pdfFiles.forEach(file => data.append('pdfs', file));

      // Purchase Links
      if (formData.purchaseLinks) {
        data.append('purchaseLinks', JSON.stringify(formData.purchaseLinks));
        formData.purchaseLinks.forEach((link, i) => {
            if (link.logoFile) {
                data.append(`logo_${i}`, link.logoFile);
            }
        });
      }

      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, data);
      } else {
        await api.post("/books", data);
      }
      fetchBooks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving book:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" style={{ borderRadius: '2px' }}></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground py-32 pb-48">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-all font-bold uppercase tracking-[0.2em] text-[10px] mb-6"
            >
              <FiArrowLeft /> Back to Command Center
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter gradient-text uppercase">
              Knowledge Library
            </h1>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
            style={{ borderRadius: '2px' }}
          >
            <FiPlus className="text-lg" /> New Acquisition
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-0 group overflow-hidden flex flex-col h-full bg-white/5 border border-white/10"
              style={{ borderRadius: '2px' }}
            >
              <div className="relative aspect-[3/4] bg-foreground/5 overflow-hidden">
                {book.coverImageUrl ? (
                  <img
                    src={resolveImageUrl(book.coverImageUrl)}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <FiBook size={80} />
                  </div>
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={() => handleOpenModal(book)}
                    className="px-8 py-3 bg-foreground text-background font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all"
                    style={{ borderRadius: '2px' }}
                  >
                    Modify Record
                  </button>
                  <button
                    onClick={() => handleDelete(book._id!)}
                    className="px-8 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all"
                    style={{ borderRadius: '2px' }}
                  >
                    Remove Entry
                  </button>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="text-2xl font-black mb-2 truncate uppercase tracking-tight">
                  {book.title}
                </h3>
                <p className="text-primary text-xs font-black uppercase tracking-widest mb-6">
                  {book.authors.join(", ")}
                </p>
                <p className="text-foreground/40 text-sm font-medium line-clamp-3">
                  {book.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-background/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-card border border-border shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
                style={{ borderRadius: '2px' }}
              >
                <div className="p-12">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-black tracking-tighter">
                      {editingBook ? "Edit Manifest" : "New Knowledge Node"}
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-4 bg-foreground/5 hover:bg-foreground/10 transition-all"
                      style={{ borderRadius: '2px' }}
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                                Front Cover (Primary)
                            </label>
                            <div className="relative group aspect-[3/4] rounded-sm overflow-hidden bg-foreground/5 border border-border flex items-center justify-center" style={{ borderRadius: '2px' }}>
                                {coverPreview ? (
                                <img
                                    src={coverPreview}
                                    className="w-full h-full object-cover"
                                    alt="Cover Preview"
                                />
                                ) : (
                                <FiCamera size={40} className="opacity-20" />
                                )}
                                <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/60 transition-all cursor-pointer">
                                <FiPlus size={32} />
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleCoverChange}
                                    accept="image/*"
                                />
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                                Gallery & Supporting Visuals
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {previews.map((src, i) => (
                                    <div key={i} className="aspect-square relative group bg-foreground/5 border border-border overflow-hidden" style={{ borderRadius: '2px' }}>
                                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPreviews = [...previews];
                                                const removedUrl = newPreviews[i];
                                                newPreviews.splice(i, 1);
                                                setPreviews(newPreviews);
                                                
                                                if (removedUrl.startsWith('data:') || removedUrl.startsWith('blob:')) {
                                                    const existingCount = (formData.imageUrls || []).length;
                                                    if (i >= existingCount) {
                                                        const fileIndex = i - existingCount;
                                                        const newFiles = [...imageFiles];
                                                        newFiles.splice(fileIndex, 1);
                                                        setImageFiles(newFiles);
                                                    }
                                                } else {
                                                    const newUrls = (formData.imageUrls || []).filter(url => resolveImageUrl(url) !== removedUrl);
                                                    setFormData({ ...formData, imageUrls: newUrls });
                                                }
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all"
                                            style={{ borderRadius: '2px' }}
                                        >
                                            <FiTrash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/5 transition-all text-foreground/20" style={{ borderRadius: '2px' }}>
                                    <FiPlus />
                                    <span className="text-[10px] font-black uppercase mt-2">Add</span>
                                    <input type="file" multiple className="hidden" onChange={handleImagesChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                        Book/Chapter Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                        style={{ borderRadius: '2px' }}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                        Book Description (Stunning Narrative)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold min-h-[120px]"
                        style={{ borderRadius: '2px' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                        Intellectual Authors
                      </label>
                      <input
                        type="text"
                        value={formData.authors?.join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            authors: e.target.value
                              .split(",")
                              .map((a) => a.trim()),
                          })
                        }
                        className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                        style={{ borderRadius: '2px' }}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                        Publication Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as 'full-book' | 'chapter',
                          })
                        }
                        className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold appearance-none bg-card"
                        style={{ borderRadius: '2px' }}
                      >
                        <option value="full-book">Full Physical Book</option>
                        <option value="chapter">Single Special Chapter</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                        Publisher / Venue
                      </label>
                      <input
                        type="text"
                        value={formData.publisher}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publisher: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                        style={{ borderRadius: '2px' }}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                        ISBN / Serial Code
                      </label>
                      <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isbn: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 bg-foreground/5 border border-border focus:outline-none focus:border-primary font-bold"
                        style={{ borderRadius: '2px' }}
                      />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                            Purchase Links (Amazon, Flipkart, Kindle)
                        </label>
                        <div className="space-y-4">
                            {(formData.purchaseLinks || []).map((link, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-4 p-6 bg-foreground/5 border border-border" style={{ borderRadius: '2px' }}>
                                    <div className="flex-1 space-y-4">
                                        <input
                                            placeholder="Label (e.g. Amazon)"
                                            value={link.label}
                                            onChange={(e) => {
                                                const newLinks = [...(formData.purchaseLinks || [])];
                                                newLinks[idx].label = e.target.value;
                                                setFormData({ ...formData, purchaseLinks: newLinks });
                                            }}
                                            className="w-full px-4 py-2 bg-background border border-border text-xs font-bold"
                                            style={{ borderRadius: '2px' }}
                                        />
                                        <input
                                            placeholder="URL"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...(formData.purchaseLinks || [])];
                                                newLinks[idx].url = e.target.value;
                                                setFormData({ ...formData, purchaseLinks: newLinks });
                                            }}
                                            className="w-full px-4 py-2 bg-background border border-border text-xs font-bold"
                                            style={{ borderRadius: '2px' }}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="w-12 h-12 bg-background border border-border flex items-center justify-center cursor-pointer overflow-hidden" style={{ borderRadius: '2px' }}>
                                            {link.logoUrl || link.logoPreview ? (
                                            <img src={link.logoPreview || resolveImageUrl(link.logoUrl || '')} alt="Logo" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <FiCamera size={16} className="opacity-20" />
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const newLinks = [...(formData.purchaseLinks || [])];
                                                            newLinks[idx].logoFile = file;
                                                            newLinks[idx].logoPreview = reader.result as string;
                                                            setFormData({ ...formData, purchaseLinks: newLinks });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newLinks = (formData.purchaseLinks || []).filter((_, i) => i !== idx);
                                                setFormData({ ...formData, purchaseLinks: newLinks });
                                            }}
                                            className="text-red-500 hover:text-red-600 transition-all"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        purchaseLinks: [...(formData.purchaseLinks || []), { label: '', url: '' }]
                                    });
                                }}
                                className="w-full py-4 border-2 border-dashed border-border text-foreground/20 hover:bg-foreground/5 hover:text-primary transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest"
                                style={{ borderRadius: '2px' }}
                            >
                                <FiPlus /> Add Marketplace Link
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/30 block mb-3">
                            Research Data & Modules (PDF Artifacts)
                        </label>
                        <div className="space-y-4">
                            {(formData.pdfUrls || []).map((url, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-primary/5 border border-primary/20" style={{ borderRadius: '2px' }}>
                                    <div className="flex items-center gap-4">
                                        <FiFileText className="text-primary" />
                                        <span className="text-xs font-bold truncate max-w-[300px] uppercase tracking-tighter">Existing: {url.split('/').pop()}</span>
                                    </div>
                                    <button type="button" onClick={() => setFormData({ ...formData, pdfUrls: formData.pdfUrls?.filter((_, idx) => idx !== i) })} className="text-red-500 hover:text-red-600">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                            {pdfFiles.map((file, i) => (
                                <div key={`new-${i}`} className="flex items-center justify-between p-5 bg-foreground/5 border border-border" style={{ borderRadius: '2px' }}>
                                    <div className="flex items-center gap-4">
                                        <FiFileText className="text-foreground/40" />
                                        <span className="text-xs font-bold truncate max-w-[300px] uppercase tracking-tighter">New: {file.name}</span>
                                    </div>
                                    <button type="button" onClick={() => setPdfFiles(pdfFiles.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-600">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                            <label className="w-full flex items-center justify-center gap-4 p-6 border-2 border-dashed border-border hover:bg-foreground/5 cursor-pointer transition-all" style={{ borderRadius: '2px' }}>
                                <FiPlus className="text-foreground/20" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Annex Data Module (PDF)</span>
                                <input type="file" multiple accept="application/pdf" className="hidden" onChange={(e) => setPdfFiles([...pdfFiles, ...Array.from(e.target.files || [])])} />
                            </label>
                        </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="md:col-span-2 w-full py-6 bg-foreground text-background font-black text-xl hover:bg-primary hover:text-white transition-all shadow-3xl mt-10 disabled:opacity-50"
                      style={{ borderRadius: '2px' }}
                    >
                      {saving ? "Transmitting Knowledge..." : "Finalize Digital Entry"}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
