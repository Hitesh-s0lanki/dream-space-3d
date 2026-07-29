"use client";

import { useState } from "react";
import { Property } from "@/data/propertyData";
import { Scene, MaterialPreset, CameraViewPreset, LightTheme } from "@/components/three/scene";
import {
  X,
  Sparkles,
  RotateCw,
  Eye,
  Palette,
  Sun,
  Layers,
  Check,
  Send,
  SlidersHorizontal,
  Box,
  MapPin,
  Building,
  Heart,
  Share2,
} from "lucide-react";

interface WalkthroughModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isLiked?: boolean;
  onToggleLike?: (propertyId: string) => void;
}

export function WalkthroughModal({
  property,
  isOpen,
  onClose,
  isLiked = false,
  onToggleLike,
}: WalkthroughModalProps) {
  const [activeTab, setActiveTab] = useState<"3d" | "ai">("3d");
  const [materialPreset, setMaterialPreset] = useState<MaterialPreset>("gold");
  const [cameraView, setCameraView] = useState<CameraViewPreset>("hero");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [lightTheme, setLightTheme] = useState<LightTheme>("light");
  const [showArch, setShowArch] = useState<boolean>(true);

  // AI Customizer state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedAiStyle, setAppliedAiStyle] = useState("Original Interior");

  if (!isOpen || !property) return null;

  const handleAiGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAppliedAiStyle(`AI Custom: ${aiPrompt}`);
      setMaterialPreset("emerald");
    }, 1200);
  };

  const applyPresetAiStyle = (styleName: string, preset: MaterialPreset) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAppliedAiStyle(styleName);
      setMaterialPreset(preset);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col lg:flex-row w-full max-w-7xl h-[92vh] max-h-[900px] overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 shadow-2xl shadow-slate-950/40">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md backdrop-blur-md transition hover:bg-white hover:text-slate-950"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT / TOP 3D CANVAS VIEWPORT */}
        <div className="relative flex-1 h-[55%] lg:h-full bg-slate-900 overflow-hidden">
          <Scene
            materialPreset={materialPreset}
            cameraView={cameraView}
            autoRotate={autoRotate}
            lightTheme={lightTheme}
            showArchitecturalElements={showArch}
          />

          {/* OVERLAY HEADER ON CANVAS */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200/40 bg-slate-950/60 px-4 py-1.5 backdrop-blur-md text-xs text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">3D Walkthrough Live</span>
            </div>

            {appliedAiStyle !== "Original Interior" && (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="truncate max-w-[180px]">{appliedAiStyle}</span>
              </div>
            )}
          </div>

          {/* FLOATING CAMERA CONTROLS ON CANVAS */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/20 bg-slate-950/60 p-3 backdrop-blur-md text-xs text-white">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">View Angle:</span>
              {(["hero", "front", "iso", "wide"] as CameraViewPreset[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setCameraView(v)}
                  className={`rounded-lg px-2.5 py-1 capitalize transition ${
                    cameraView === v
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-white/10 hover:bg-white/20 text-slate-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition ${
                  autoRotate ? "bg-amber-500 text-slate-950 font-bold" : "bg-white/10 hover:bg-white/20 text-slate-200"
                }`}
              >
                <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? "animate-spin" : ""}`} />
                {autoRotate ? "Orbiting" : "Orbit"}
              </button>

              <button
                onClick={() => setShowArch(!showArch)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition ${
                  showArch ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                {showArch ? "Arch On" : "Arch Off"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR / CUSTOMIZER PANEL */}
        <div className="w-full lg:w-[450px] flex flex-col h-[45%] lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-slate-200/80 overflow-y-auto">
          
          {/* PROPERTY DETAILS HEADER */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-widest">
                  <Building className="h-3.5 w-3.5" />
                  <span>{property.builder}</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                  {property.name}
                </h2>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{property.location}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-amber-700">{property.price}</span>
                <p className="text-xs text-slate-500 font-medium">{property.bhk} • {property.carpetArea}</p>
              </div>
            </div>

            {/* ACTION TABS */}
            <div className="flex items-center gap-2 mt-4 p-1 rounded-xl bg-slate-200/60">
              <button
                onClick={() => setActiveTab("3d")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === "3d" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Box className="h-3.5 w-3.5 text-amber-600" />
                <span>3D Walkthrough</span>
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === "ai" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>AI Interior Customizer</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENT: 3D CONTROLS */}
          {activeTab === "3d" ? (
            <div className="p-6 space-y-6 flex-1">
              {/* Material Presets */}
              <div className="space-y-3">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Palette className="h-4 w-4 text-amber-600" /> Interior Finish Material
                  </span>
                  <span className="text-slate-400 capitalize">{materialPreset}</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "gold", label: "Brushed Gold", color: "bg-amber-500" },
                    { id: "chrome", label: "Chrome Mirror", color: "bg-slate-400" },
                    { id: "emerald", label: "Emerald Glass", color: "bg-emerald-500" },
                    { id: "neon", label: "Cyber Neon", color: "bg-cyan-400" },
                  ].map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setMaterialPreset(mat.id as MaterialPreset)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition ${
                        materialPreset === mat.id
                          ? "border-amber-500 bg-amber-50/50 text-slate-900 ring-1 ring-amber-500/30"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full ${mat.color} shadow-sm`} />
                      <span className="flex-1">{mat.label}</span>
                      {materialPreset === mat.id && <Check className="h-3.5 w-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Preset */}
              <div className="space-y-3">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-amber-600" /> Room Lighting Mood
                  </span>
                  <span className="text-slate-400 capitalize">{lightTheme}</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "light", label: "Daylight Bright" },
                    { id: "warm", label: "Warm Evening" },
                    { id: "cyber", label: "Cyber Ambient" },
                    { id: "dark", label: "Midnight Studio" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setLightTheme(theme.id as LightTheme)}
                      className={`p-3 rounded-xl border text-xs font-medium text-center transition ${
                        lightTheme === theme.id
                          ? "border-amber-500 bg-amber-50/50 text-slate-900 font-semibold ring-1 ring-amber-500/30"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Specifications */}
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-2 text-xs">
                <span className="font-bold text-slate-800">Property Key Info:</span>
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>• BHK: {property.bhk}</div>
                  <div>• Area: {property.carpetArea}</div>
                  <div>• City: {property.city}</div>
                  <div>• Rating: ⭐ {property.rating}</div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB CONTENT: AI INTERIOR CUSTOMIZER */
            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" /> AI Style Prompt
                </h3>
                <p className="text-xs text-slate-500">
                  Type any custom interior design requirement and HomeVista AI will re-render the 3D room instantly.
                </p>

                <form onSubmit={handleAiGenerate} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Italian statuario marble wall with teak accent..."
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <RotateCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Apply</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Quick AI Presets */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quick AI Style Presets:
                </label>

                <div className="space-y-2">
                  {[
                    { name: "Scandinavian Minimalist Teak", preset: "gold" as MaterialPreset },
                    { name: "Italian Statuario Marble & Gold", preset: "chrome" as MaterialPreset },
                    { name: "Emerald & Velvet Luxury Suite", preset: "emerald" as MaterialPreset },
                    { name: "Cyber Neon Futuristic Living", preset: "neon" as MaterialPreset },
                  ].map((style) => (
                    <button
                      key={style.name}
                      onClick={() => applyPresetAiStyle(style.name, style.preset)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 transition hover:border-amber-500 hover:bg-amber-50/30"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        {style.name}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-700">Apply Style ➔</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <button
              onClick={() => onToggleLike?.(property.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                isLiked
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{isLiked ? "Saved" : "Save Home"}</span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800">
              <span>Contact Builder / Schedule Visit</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
