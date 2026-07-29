"use client";

import { useState, useEffect } from "react";
import { STATES_AND_CITIES } from "@/data/propertyData";
import { Search, MapPin, Building, DollarSign, Home, SlidersHorizontal } from "lucide-react";

interface SearchCardProps {
  onSearch: (filters: {
    state: string;
    city: string;
    locality: string;
    budget: string;
    propertyType: string;
    bhk: string;
  }) => void;
}

export function SearchCard({ onSearch }: SearchCardProps) {
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [selectedLocality, setSelectedLocality] = useState("Worli");
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedBhk, setSelectedBhk] = useState("All BHK");

  // Available cities based on selected state
  const availableCities = STATES_AND_CITIES[selectedState]?.cities || [];

  // Available localities based on selected city
  const availableLocalities =
    STATES_AND_CITIES[selectedState]?.localities[selectedCity] || [
      "All Localities",
    ];

  // Auto-update city when state changes
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const cities = STATES_AND_CITIES[newState]?.cities || [];
    const firstCity = cities[0] || "";
    setSelectedCity(firstCity);

    const localities = STATES_AND_CITIES[newState]?.localities[firstCity] || [];
    setSelectedLocality(localities[0] || "All Localities");
  };

  // Auto-update locality when city changes
  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
    const localities =
      STATES_AND_CITIES[selectedState]?.localities[newCity] || [];
    setSelectedLocality(localities[0] || "All Localities");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      state: selectedState,
      city: selectedCity,
      locality: selectedLocality,
      budget: selectedBudget,
      propertyType: selectedType,
      bhk: selectedBhk,
    });

    const target = document.getElementById("featured-homes");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="search-card" className="relative z-30 mx-auto max-w-6xl px-4 -mt-14 sm:-mt-20">
      <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:p-8">
        
        {/* CARD TITLE */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              Smart Property Search
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            3D Spatial & AI Filter Ready
          </span>
        </div>

        {/* FORM DROPDOWNS GRID */}
        <form onSubmit={handleSearchSubmit} className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            
            {/* 1. STATE DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {Object.keys(STATES_AND_CITIES).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. CITY DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {availableCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. LOCALITY DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Locality
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="All Localities">All Localities</option>
                {availableLocalities.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. BUDGET DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Budget
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="All Budgets">All Budgets</option>
                <option value="Under ₹1 Cr">Under ₹1 Cr</option>
                <option value="₹1 Cr - ₹3 Cr">₹1 Cr - ₹3 Cr</option>
                <option value="₹3 Cr - ₹7 Cr">₹3 Cr - ₹7 Cr</option>
                <option value="Above ₹7 Cr">Above ₹7 Cr</option>
              </select>
            </div>

            {/* 5. PROPERTY TYPE DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="All Types">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            {/* 6. BHK DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                BHK
              </label>
              <select
                value={selectedBhk}
                onChange={(e) => setSelectedBhk(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="All BHK">All BHK</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4+ BHK">4+ BHK</option>
              </select>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500"
            >
              <Search className="h-4 w-4" />
              <span>Search Properties</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
