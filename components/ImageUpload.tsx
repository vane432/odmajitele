"use client";

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  className?: string;
}

export function ImageUpload({ 
  onUpload, 
  currentImages = [], 
  maxImages = 5,
  className = '' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const uploadPromises: Promise<string>[] = [];

    for (const file of files.slice(0, maxImages - images.length)) {
      const formData = new FormData();
      formData.append('file', file);

      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          return data.url;
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      });

      uploadPromises.push(uploadPromise);
    }

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onUpload(newImages);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Chyba při nahrávání obrázků. Zkuste to znovu.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
    // Reset input
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={className}>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        Obrázky ({images.length}/{maxImages})
      </label>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
              <img
                src={url}
                alt={`Náhled ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed border-slate-300 rounded-lg p-6 text-center transition-colors ${
            dragOver ? 'border-amber-500 bg-amber-50' : 'hover:border-slate-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={uploading || !canAddMore}
          />
          
          <label
            htmlFor="image-upload"
            className={`cursor-pointer ${uploading ? 'pointer-events-none' : ''}`}
          >
            <div className="flex flex-col items-center space-y-2">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              ) : (
                <ImageIcon className="h-8 w-8 text-slate-400" />
              )}
              
              <div className="text-sm">
                {uploading ? (
                  <span className="text-slate-600">Nahrávání...</span>
                ) : (
                  <>
                    <span className="font-medium text-slate-900">
                      Klikněte pro nahrání
                    </span>
                    <span className="text-slate-500"> nebo přetáhněte soubory</span>
                  </>
                )}
              </div>
              
              {!uploading && (
                <p className="text-xs text-slate-400">
                  PNG, JPG, WebP do 5MB
                </p>
              )}
            </div>
          </label>
        </div>
      )}

      {!canAddMore && (
        <p className="text-sm text-slate-500 text-center py-4">
          Dosáhli jste maximálního počtu obrázků ({maxImages})
        </p>
      )}
    </div>
  );
}