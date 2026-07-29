"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  RotateCw,
  Eye,
  Palette,
  Sun,
  Layers,
  Box,
  Compass,
  ArrowRight,
  Sparkle,
} from "lucide-react";
import type {
  MaterialPreset,
  CameraViewPreset,
  LightTheme,
} from "@/components/three/scene";

// WebGL scene client-side only
const Scene = dynamic(
  () => import("@/components/three/scene").then((m) => m.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-sm text-zinc-400">
        <div className="flex items-center gap-3">
          <Sparkle className="h-5 w-5 animate-spin text-amber-400" />
          <span>Rendering 3D Spatial Environment…</span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [materialPreset, setMaterialPreset] = useState<MaterialPreset>("gold");
  const [cameraView, setCameraView] = useState<CameraViewPreset>("hero");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [lightTheme, setLightTheme] = useState<LightTheme>("light");
  const [showArch, setShowArch] = useState<boolean>(true);

  return (
    <main className="flex flex-1 flex-col bg-slate-50 text-slate-900 selection:bg-amber-500/30 selection:text-amber-900">
      {/* HERO SECTION WITH 3D VIEW CANVAS BACKGROUND */}
      <section className="relative flex min-h-svh flex-col items-center justify-between px-4 py-8 sm:px-8">
        {/* Fullscreen Interactive 3D Canvas */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Scene
            materialPreset={materialPreset}
            cameraView={cameraView}
            autoRotate={autoRotate}
            lightTheme={lightTheme}
            showArchitecturalElements={showArch}
          />
        </div>

        {/* Top Header Navigation Overlay */}
        <header className="z-10 flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border border-slate-200/80 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20">
              <Box className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              STUDIO 3D
            </span>
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#view3d" className="transition hover:text-amber-600">
              3D View
            </a>
            <a href="#features" className="transition hover:text-amber-600">
              Capabilities
            </a>
            <a href="#controls" className="transition hover:text-amber-600">
              Controls
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`border-slate-200 bg-white/80 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 ${
                autoRotate
                  ? "border-amber-500/50 text-amber-600 ring-1 ring-amber-500/30"
                  : "hover:text-slate-900"
              }`}
            >
              <RotateCw
                className={`mr-1.5 h-3.5 w-3.5 ${
                  autoRotate ? "animate-spin" : ""
                }`}
              />
              {autoRotate ? "Orbiting" : "Orbit View"}
            </Button>

            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-xs font-semibold text-slate-950 shadow-sm shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500"
            >
              Book Studio
            </Button>
          </div>
        </header>

        {/* Center Hero Information Card */}
        <div className="z-10 my-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-800 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Interactive 3D View Experience</span>
          </div>

          {/* Fallback Accessible Title */}
          <div className="space-y-2">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
              3D view
            </h1>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base font-normal">
            Interact directly with the 3D typography and spatial environment.
            Rotate, zoom, toggle materials, and experience your vision in real-time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="h-12 bg-amber-500 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/25 hover:bg-amber-400"
              onClick={() => {
                const element = document.getElementById("controls");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Customize 3D View <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-slate-300 bg-white/80 px-8 text-sm font-semibold text-slate-800 backdrop-blur-md hover:bg-slate-100"
              onClick={() =>
                setMaterialPreset((prev) =>
                  prev === "gold"
                    ? "chrome"
                    : prev === "chrome"
                    ? "emerald"
                    : prev === "emerald"
                    ? "neon"
                    : "gold"
                )
              }
            >
              Cycle Material ({materialPreset.toUpperCase()})
            </Button>
          </div>
        </div>

        {/* Bottom Floating 3D Control Bar */}
        <div
          id="controls"
          className="z-10 flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white/85 p-4 backdrop-blur-xl shadow-xl shadow-slate-200/60"
        >
          {/* Material Presets */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Palette className="h-3.5 w-3.5 text-amber-600" /> Material:
            </span>
            <div className="flex items-center gap-1">
              {(["gold", "chrome", "emerald", "neon"] as MaterialPreset[]).map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() => setMaterialPreset(preset)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                      materialPreset === preset
                        ? "bg-amber-500/15 text-amber-800 ring-1 ring-amber-500/40 font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {preset}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Camera View Angle */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Eye className="h-3.5 w-3.5 text-amber-600" /> Angle:
            </span>
            <div className="flex items-center gap-1">
              {(["hero", "front", "iso", "wide"] as CameraViewPreset[]).map(
                (view) => (
                  <button
                    key={view}
                    onClick={() => setCameraView(view)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                      cameraView === view
                        ? "bg-amber-500/15 text-amber-800 ring-1 ring-amber-500/40 font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {view}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Lighting Mode */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sun className="h-3.5 w-3.5 text-amber-600" /> Light:
            </span>
            <div className="flex items-center gap-1">
              {(["light", "warm", "cyber", "dark"] as LightTheme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setLightTheme(theme)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                    lightTheme === theme
                      ? "bg-amber-500/15 text-amber-800 ring-1 ring-amber-500/40 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Architectural Elements Toggle */}
          <button
            onClick={() => setShowArch(!showArch)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
              showArch
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {showArch ? "Arch On" : "Arch Off"}
          </button>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS & SPATIAL POSSIBILITIES SECTION */}
      <section
        id="features"
        className="relative border-t border-slate-200/80 bg-slate-100/60 px-6 py-24 sm:px-12"
      >
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Spatial Visualization Studio
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Experience 3D view like never before.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              Our WebGL 3D engine brings high-fidelity lighting, real-time depth,
              materials, and interactive spatial views directly to your browser.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group space-y-4 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:border-amber-500/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                <Box className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                3D Spatial Depth
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Every line of text and interior element exists within true 3D coordinate space with real physical shadows and reflection physics.
              </p>
            </div>

            <div className="group space-y-4 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:border-amber-500/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Custom Materials
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Switch instantly between Brushed Gold, Chrome Mirror, Emerald Glass, and Cyber Neon materials in real time.
              </p>
            </div>

            <div className="group space-y-4 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:border-amber-500/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Interactive Camera
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Drag to orbit, scroll to zoom, and toggle between preset architectural camera perspectives effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white px-6 py-12 text-center text-xs text-slate-500">
        <p>
          © 2026 Studio 3D — 3D view. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

