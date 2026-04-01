"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft, Mail, Phone, User } from "lucide-react";
import { mockListings, formatPrice } from "@/lib/mockData";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = mockListings.find((l) => l.id === params.id);

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
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium"
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-4">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold",
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
              <div className="text-4xl font-extrabold text-amber-500">
                {formatPrice(listing.price)}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Parametry
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(listing.features).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0"
                  >
                    <span className="text-slate-600 font-medium">{key}</span>
                    <span className="text-slate-900 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Popis</h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <ContactForm listingTitle={listing.title} />
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
        <div className="p-4 flex gap-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                selectedImage === index
                  ? "border-amber-500 ring-2 ring-amber-200"
                  : "border-transparent hover:border-slate-300"
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

function ContactForm({ listingTitle }: { listingTitle: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Dobrý den,\n\nmám zájem o inzerát: ${listingTitle}\n\nProsím o kontakt.\n\nDěkuji`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    alert("Zpráva byla odeslána! (MVP: Data jsou zobrazena v konzoli)");
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
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Odeslat zprávu
        </button>
      </form>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Odesláním souhlasíte se zpracováním osobních údajů
      </p>
    </div>
  );
}
