"use client";

import Link from "next/link";
import { Building2, Car, Store, User, LogOut, Settings } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">
              <span className="font-extrabold text-slate-900">Od</span>
              <span className="font-light text-slate-900">Majitele</span>
              <span className="text-amber-500 font-bold">.com</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/?category=nemovitosti"
              className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Building2 className="h-5 w-5" />
              <span className="font-medium">Nemovitosti</span>
            </Link>
            <Link
              href="/?category=auta"
              className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Car className="h-5 w-5" />
              <span className="font-medium">Auta</span>
            </Link>
            <Link
              href="/?category=firmy"
              className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Store className="h-5 w-5" />
              <span className="font-medium">Firmy</span>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-10 w-10 bg-slate-200 animate-pulse rounded-full"></div>
            ) : user ? (
              <div className="relative">
                {/* User Avatar */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg px-3 py-2"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profil"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Správa inzerátů
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Odhlásit se
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  Přihlásit se
                </Link>
                <Link
                  href="/admin"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Přidat inzerát
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}