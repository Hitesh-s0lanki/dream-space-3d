"use client";

import { useState } from "react";
import {
  Home,
  Search,
  Bell,
  Heart,
  User,
  Sparkles,
  Menu,
  X,
  Building2,
} from "lucide-react";

interface NavbarProps {
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onOpenAiCustomizer: () => void;
  onOpenAuthModal: (type: "login" | "signup") => void;
}

export function Navbar({
  savedCount,
  onOpenSavedDrawer,
  onOpenAiCustomizer,
  onOpenAuthModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/75 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        
        {/* LEFT BRANDING */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition transform">
            <span className="text-xl">🏠</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              HomeVista <span className="text-amber-600">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
              Smart 3D Real Estate
            </span>
          </div>
        </a>

        {/* CENTER NAVIGATION LINKS */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a
            href="#"
            className="transition hover:text-amber-600 text-slate-900"
          >
            Home
          </a>
          <a
            href="#featured-homes"
            className="transition hover:text-amber-600"
          >
            Explore Homes
          </a>
          <button
            onClick={onOpenAiCustomizer}
            className="flex items-center gap-1.5 transition hover:text-amber-600 font-semibold text-amber-700"
          >
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>AI Interior</span>
          </button>
          <button
            onClick={onOpenSavedDrawer}
            className="flex items-center gap-1.5 transition hover:text-amber-600 relative"
          >
            <span>Saved Homes</span>
            {savedCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
                {savedCount}
              </span>
            )}
          </button>
          <a href="#why-choose-us" className="transition hover:text-amber-600">
            About
          </a>
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Search trigger */}
          <a
            href="#search-card"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="Search Properties"
          >
            <Search className="h-4 w-4" />
          </a>

          {/* Saved Homes icon */}
          <button
            onClick={onOpenSavedDrawer}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="Saved Homes"
          >
            <Heart className="h-4 w-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Notification bell */}
          <button
            onClick={() => setNotificationCount(0)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Auth buttons */}
          <button
            onClick={() => onOpenAuthModal("login")}
            className="text-xs font-bold text-slate-700 hover:text-amber-600 px-3 py-2 transition"
          >
            Login
          </button>
          <button
            onClick={() => onOpenAuthModal("signup")}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Sign Up
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-6 py-4 md:hidden space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#featured-homes" onClick={() => setMobileMenuOpen(false)}>Explore Homes</a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiCustomizer();
              }}
              className="flex items-center gap-2 text-amber-700 text-left font-bold"
            >
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>AI Interior Designer</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSavedDrawer();
              }}
              className="flex items-center justify-between text-left"
            >
              <span>Saved Homes</span>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-slate-950">
                {savedCount}
              </span>
            </button>
            <a href="#why-choose-us" onClick={() => setMobileMenuOpen(false)}>About HomeVista</a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal("login");
              }}
              className="flex-1 py-2 text-xs font-bold border border-slate-200 rounded-xl text-center text-slate-800"
            >
              Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal("signup");
              }}
              className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white text-center shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
