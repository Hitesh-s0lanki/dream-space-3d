"use client";

import { POPULAR_CITIES, CityData } from "@/data/propertyData";
import { MapPin, Building2, TrendingUp, ArrowUpRight } from "lucide-react";

interface PopularCitiesProps {
  onSelectCity: (cityName: string) => void;
}

export function PopularCities({ onSelectCity }: PopularCitiesProps) {
  return (
    <section id="popular-cities" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">
            <Building2 className="h-4 w-4" />
            <span>High-Demand Real Estate Hubs</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Popular Cities
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Explore premium 3D spatial properties across India’s top metropolitan real estate markets.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing 6 Top Cities
        </span>
      </div>

      {/* CITY CARDS GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_CITIES.map((city: CityData) => (
          <div
            key={city.name}
            onClick={() => onSelectCity(city.name)}
            className="group relative h-80 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/20 cursor-pointer"
          >
            {/* CITY BACKGROUND IMAGE */}
            <img
              src={city.image}
              alt={`${city.name} real estate`}
              className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
            />

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 transition group-hover:opacity-95" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
              
              {/* TOP TAG */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/40 px-3 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-md">
                  <MapPin className="h-3 w-3 text-amber-400" />
                  {city.state}
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 transition group-hover:opacity-100 group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* BOTTOM DETAILS */}
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold tracking-tight text-white group-hover:text-amber-300 transition">
                  {city.name}
                </h3>
                
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 pt-1 border-t border-white/15">
                  <span>{city.propertiesCount}</span>
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {city.avgPrice}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
