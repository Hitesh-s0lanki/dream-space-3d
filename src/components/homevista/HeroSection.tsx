"use client";

import { Sparkles, ArrowRight, Play, ShieldCheck, Star } from "lucide-react";

interface HeroSectionProps {
  onExploreClick: () => void;
  onTryAiClick: () => void;
}

export function HeroSection({ onExploreClick, onTryAiClick }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-8">
      {/* BACKGROUND REALISTIC MODERN HOME IMAGE */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop"
          alt="Modern Luxury Indian Home Interior"
          className="h-full w-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        {/* DARK OVERLAY FOR PERFECT TYPOGRAPHY CONTRAST */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
      </div>

      {/* HERO CONTENT CONTAINER */}
      <div className="z-10 mx-auto flex max-w-4xl flex-col items-center text-center space-y-8">
        
        {/* BADGE */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-950/60 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md shadow-lg shadow-black/40">
          <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
          <span>India’s #1 AI & 3D Real Estate Platform</span>
        </div>

        {/* MAIN HEADING */}
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
          Experience Your Future Home <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Before You Buy It</span>
        </h1>

        {/* SUBHEADING */}
        <p className="max-w-2xl text-pretty text-base font-normal leading-relaxed text-slate-200 sm:text-lg md:text-xl">
          Walk through homes in immersive 3D, customize interiors using AI, compare layouts, and confidently choose the perfect home for your lifestyle before making one of the biggest financial decisions.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/25 transition hover:scale-105 hover:from-amber-400 hover:to-amber-500"
          >
            <span>Explore Homes</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onTryAiClick}
            className="flex items-center gap-2.5 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md shadow-xl transition hover:bg-white/20 hover:scale-105"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Try AI Interior Designer</span>
          </button>
        </div>

        {/* PREMIUM STATISTICS */}
        <div className="pt-10 grid grid-cols-3 gap-6 sm:gap-12 border-t border-white/15 max-w-3xl w-full">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-white sm:text-4xl">10,000+</span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">Homes Listed</span>
          </div>

          <div className="flex flex-col items-center border-x border-white/15 px-4 sm:px-8">
            <span className="text-2xl font-extrabold text-amber-400 sm:text-4xl">25+</span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">Metro Cities</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-white sm:text-4xl">50,000+</span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">Happy Users</span>
          </div>
        </div>

      </div>
    </section>
  );
}
