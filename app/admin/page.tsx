"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "nemovitosti" as Category,
    price: "",
    location: "Brno",
    description: "",
    owner_email: "",
    features: [{ key: "", value: "" }],
    imageUrls: [""],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Transform features array to object
      const featuresObject = formData.features.reduce((acc, feature) => {
        if (feature.key && feature.value) {
          acc[feature.key] = feature.value;
        }
        return acc;
      }, {} as Record<string, string>);

      // Filter out empty image URLs
      const imageUrls = formData.imageUrls.filter(url => url.trim() !== '');

      const listingData = {
        title: formData.title,
        category: formData.category,
        price: parseInt(formData.price),
        location: formData.location,
        description: formData.description,
        owner_email: formData.owner_email,
        features: featuresObject,
        image_urls: imageUrls,
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        const newListing = await response.json();
        setSubmitStatus('success');
        
        // Reset form
        setFormData({
          title: "",
          category: "nemovitosti" as Category,
          price: "",
          location: "Brno",
          description: "",
          owner_email: "",
          features: [{ key: "", value: "" }],
          imageUrls: [""],
        });

        alert(`✅ Inzerát "${newListing.title}" byl úspěšně vytvořen!\n\nID: ${newListing.id}`);
      } else {
        const error = await response.json();
        console.error('Error creating listing:', error);
        setSubmitStatus('error');
        alert(`❌ Chyba při vytváření inzerátu: ${error.error || 'Neznámá chyba'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      alert('❌ Chyba sítě. Zkuste to znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { key: "", value: "" }],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, field: "key" | "value", value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addImageUrl = () => {
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ""],
    });
  };

  const removeImageUrl = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const updateImageUrl = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 font-medium bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Zpět na hlavní stránku
          </Link>
          <div className="bg-gradient-to-r from-navy-900 to-slate-800 text-white rounded-xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold mb-2">
              Přidat nový inzerát
            </h1>
            <p className="text-slate-200 text-lg">
              Vyplňte podrobnosti o vašem inzerátu
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">
                Název inzerátu *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Např. Luxusní byt 3+kk v centru Brna"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">
                Kategorie *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as Category })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="nemovitosti">Nemovitosti</option>
                <option value="auta">Auta</option>
                <option value="firmy">Firmy</option>
              </select>
            </div>

            {/* Price and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-bold text-slate-700 mb-2">
                  Cena (Kč) *
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="2500000"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-bold text-slate-700 mb-2">
                  Lokalita *
                </label>
                <input
                  type="text"
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Brno - Centrum"
                />
              </div>
            </div>

            {/* Owner Email */}
            <div>
              <label htmlFor="owner_email" className="block text-sm font-bold text-slate-700 mb-2">
                Kontaktní e-mail *
              </label>
              <input
                type="email"
                id="owner_email"
                required
                value={formData.owner_email}
                onChange={(e) =>
                  setFormData({ ...formData, owner_email: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="vas@email.cz"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">
                Popis *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                placeholder="Detailní popis inzerátu..."
              />
            </div>

            {/* Features/Specifications */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Parametry
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature.key}
                      onChange={(e) =>
                        updateFeature(index, "key", e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Název (např. Plocha)"
                    />
                    <input
                      type="text"
                      value={feature.value}
                      onChange={(e) =>
                        updateFeature(index, "value", e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Hodnota (např. 85 m²)"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="mt-3 inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Přidat parametr
              </button>
            </div>

            {/* Image URLs */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                URL obrázků
              </label>
              <p className="text-sm text-slate-500 mb-3">
                Zadejte URL adresy obrázků (v produkční verzi nahrajete obrázky přímo)
              </p>
              <div className="space-y-3">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addImageUrl}
                className="mt-3 inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Přidat obrázek
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl ${
                  isSubmitting 
                    ? 'bg-slate-400 cursor-not-allowed text-slate-200' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {isSubmitting ? 'Vytváří se...' : 'Vytvořit inzerát'}
              </button>
              <p className="text-sm text-slate-500 mt-4 text-center">
                {submitStatus === 'success' && '✅ Inzerát byl úspěšně vytvořen!'}
                {submitStatus === 'error' && '❌ Chyba při vytváření inzerátu'}
                {submitStatus === 'idle' && 'Inzerát bude uložen do databáze Supabase.'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
