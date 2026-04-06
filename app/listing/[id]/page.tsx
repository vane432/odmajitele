"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft, Mail, Phone, User } from "lucide-react";
import { formatPrice } from "@/lib/mockData";
import { CATEGORY_LABELS, CATEGORY_COLORS, Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${id}`);
        if (response.ok) {
          const data = await response.json();
          setListing(data);
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Načítání...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Inzerát nenalezen
          </h1>
          <Link
            href="/"
            className="text-amber-500 hover:text-amber-600 font-semibold"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Zpět na přehled
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={listing.image_urls} title={listing.title} />

            {/* Title and Price */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="mb-4">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold shadow-sm",
                    CATEGORY_COLORS[listing.category]
                  )}
                >
                  {CATEGORY_LABELS[listing.category]}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {listing.title}
              </h1>
              <div className="flex items-center text-slate-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{listing.location}</span>
              </div>
              <div className="text-4xl font-extrabold text-amber-500 bg-amber-50 inline-block px-4 py-2 rounded-lg">
                {formatPrice(listing.price)}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-3 border-b-2 border-amber-500">
                Parametry
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(listing.features).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg"
                  >
                    <span className="text-slate-600 font-medium">{key}</span>
                    <span className="text-slate-900 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-3 border-b-2 border-amber-500">Popis</h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-slate-200">
              <ContactForm listingTitle={listing.title} listing={listing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] bg-slate-200">
        <Image
          src={images[selectedImage]}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="p-4 flex gap-4 overflow-x-auto bg-slate-50">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                selectedImage === index
                  ? "border-amber-500 ring-2 ring-amber-200 shadow-md"
                  : "border-slate-300 hover:border-amber-300 hover:shadow-sm"
              )}
            >
              <Image
                src={image}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactForm({ listingTitle, listing }: { listingTitle: string; listing?: any }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Dobrý den,\n\nmám zájem o inzerát: ${listingTitle}\n\nProsím o kontakt.\n\nDěkuji`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          listingTitle: listingTitle,
          ownerEmail: listing?.owner_email,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `Dobrý den,\n\nmám zájem o inzerát: ${listingTitle}\n\nProsím o kontakt.\n\nDěkuji`,
        });
        alert('✅ Zpráva byla úspěšně odeslána!');
      } else {
        const error = await response.json();
        setSubmitStatus('error');
        alert(`❌ Chyba při odesílání: ${error.error || 'Neznámá chyba'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      alert('❌ Chyba sítě. Zkuste to znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Kontaktovat majitele
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Jméno
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Vaše jméno"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="vas@email.cz"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
            Telefon
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="+420 123 456 789"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
            Zpráva
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
            placeholder="Vaše zpráva..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl ${
            isSubmitting 
              ? 'bg-slate-400 cursor-not-allowed text-slate-200' 
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {isSubmitting ? 'Odesílá se...' : 'Odeslat zprávu'}
        </button>
      </form>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Odesláním souhlasíte se zpracováním osobních údajů
      </p>
    </div>
  );
}
