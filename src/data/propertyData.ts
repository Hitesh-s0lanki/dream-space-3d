export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  locality: string;
  price: string;
  priceRaw: number;
  builder: string;
  bhk: string;
  bhkRaw: number;
  propertyType: string;
  carpetArea: string;
  rating: number;
  reviewsCount: number;
  entranceImage: string;
  livingRoomImage: string;
  bedroomImage: string;
  kitchenImage: string;
  isPopular?: boolean;
  featured?: boolean;
}

export interface CityData {
  name: string;
  state: string;
  propertiesCount: string;
  avgPrice: string;
  image: string;
}

export const STATES_AND_CITIES: Record<string, { cities: string[]; localities: Record<string, string[]> }> = {
  Maharashtra: {
    cities: ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik"],
    localities: {
      Mumbai: ["Andheri", "Bandra", "Powai", "Borivali", "Dadar", "Worli", "Kandivali", "Goregaon"],
      Pune: ["Baner", "Wakad", "Hinjawadi", "Kothrud", "Viman Nagar", "Kharadi"],
      Thane: ["Majiwada", "Ghodbunder Road", "Kolshet", "Vartak Nagar"],
      Nagpur: ["Civil Lines", "Dharampeth", "Manewada"],
      Nashik: ["College Road", "Indira Nagar", "Gangapur Road"],
    },
  },
  Karnataka: {
    cities: ["Bengaluru", "Mysuru", "Mangaluru"],
    localities: {
      Bengaluru: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Jayanagar", "Electronic City"],
      Mysuru: ["Gokulam", "Vijayanagar", "Jayalakshmipuram"],
      Mangaluru: ["Kadri", "Bejai", "Kodialbail"],
    },
  },
  Gujarat: {
    cities: ["Ahmedabad", "Surat", "Vadodara"],
    localities: {
      Ahmedabad: ["SG Highway", "Bodakdev", "Prahlad Nagar", "Satellite"],
      Surat: ["Vesu", "Adajan", "Piplod"],
      Vadodara: ["Alkapuri", "Gotri", "Vasna Road"],
    },
  },
  "Delhi NCR": {
    cities: ["New Delhi", "Gurgaon", "Noida"],
    localities: {
      "New Delhi": ["Vasant Vihar", "South Extension", "Greater Kailash", "Hauz Khas"],
      Gurgaon: ["DLF Phase 5", "Golf Course Road", "Cyber City", "Sector 57"],
      Noida: ["Sector 150", "Sector 62", "Sector 128"],
    },
  },
  "Tamil Nadu": {
    cities: ["Chennai", "Coimbatore"],
    localities: {
      Chennai: ["OMR", "ECR", "Anna Nagar", "Adyar", "Velachery"],
      Coimbatore: ["RS Puram", "Race Course", "Peelamedu"],
    },
  },
  Telangana: {
    cities: ["Hyderabad", "Warangal"],
    localities: {
      Hyderabad: ["Gachibowli", "HITECH City", "Jubilee Hills", "Banjara Hills", "Kondapur", "Shaikpet"],
      Warangal: ["Kazipet", "Hanamkonda"],
    },
  },
};

export const POPULAR_CITIES: CityData[] = [
  {
    name: "Mumbai",
    state: "Maharashtra",
    propertiesCount: "2,450+ Properties",
    avgPrice: "₹28,500/sq.ft",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Pune",
    state: "Maharashtra",
    propertiesCount: "1,820+ Properties",
    avgPrice: "₹9,200/sq.ft",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Bengaluru",
    state: "Karnataka",
    propertiesCount: "3,100+ Properties",
    avgPrice: "₹11,400/sq.ft",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Delhi NCR",
    state: "Delhi NCR",
    propertiesCount: "2,900+ Properties",
    avgPrice: "₹14,800/sq.ft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    propertiesCount: "1,650+ Properties",
    avgPrice: "₹8,900/sq.ft",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    propertiesCount: "1,200+ Properties",
    avgPrice: "₹8,400/sq.ft",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
  },
];

export const FEATURED_HOMES: Property[] = [
  {
    id: "prop-1",
    name: "Lodha World Towers",
    location: "Worli, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    locality: "Worli",
    price: "₹6.8 Cr",
    priceRaw: 68000000,
    builder: "Lodha Group",
    bhk: "3.5 BHK",
    bhkRaw: 3.5,
    propertyType: "3 BHK",
    carpetArea: "1,850 sq.ft",
    rating: 4.9,
    reviewsCount: 124,
    entranceImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    livingRoomImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
    bedroomImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop",
    kitchenImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "prop-2",
    name: "Prestige Kingfisher Towers",
    location: "UB City, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    locality: "Koramangala",
    price: "₹8.2 Cr",
    priceRaw: 82000000,
    builder: "Prestige Estates",
    bhk: "4 BHK",
    bhkRaw: 4,
    propertyType: "Duplex",
    carpetArea: "2,400 sq.ft",
    rating: 4.95,
    reviewsCount: 98,
    entranceImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
    livingRoomImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    bedroomImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop",
    kitchenImage: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "prop-3",
    name: "Godrej Emerald Waters",
    location: "Pimple Nilakh, Pune",
    city: "Pune",
    state: "Maharashtra",
    locality: "Baner",
    price: "₹1.85 Cr",
    priceRaw: 18500000,
    builder: "Godrej Properties",
    bhk: "3 BHK",
    bhkRaw: 3,
    propertyType: "3 BHK",
    carpetArea: "1,350 sq.ft",
    rating: 4.8,
    reviewsCount: 86,
    entranceImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    livingRoomImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
    bedroomImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
    kitchenImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "prop-4",
    name: "DLF Camellias Luxury Villa",
    location: "Golf Course Road, Gurgaon",
    city: "Gurgaon",
    state: "Delhi NCR",
    locality: "Golf Course Road",
    price: "₹14.5 Cr",
    priceRaw: 145000000,
    builder: "DLF Limited",
    bhk: "4 BHK Villa",
    bhkRaw: 4,
    propertyType: "Villa",
    carpetArea: "3,800 sq.ft",
    rating: 5.0,
    reviewsCount: 64,
    entranceImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop",
    livingRoomImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
    bedroomImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop",
    kitchenImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "prop-5",
    name: "Hiranandani Gardens",
    location: "Powai, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    locality: "Powai",
    price: "₹3.4 Cr",
    priceRaw: 34000000,
    builder: "Hiranandani Developers",
    bhk: "2.5 BHK",
    bhkRaw: 2.5,
    propertyType: "2 BHK",
    carpetArea: "1,180 sq.ft",
    rating: 4.85,
    reviewsCount: 142,
    entranceImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    livingRoomImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
    bedroomImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop",
    kitchenImage: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "prop-6",
    name: "Aparna Sky Tower",
    location: "Shaikpet, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    locality: "Shaikpet",
    price: "₹2.95 Cr",
    priceRaw: 29500000,
    builder: "Aparna Constructions",
    bhk: "3 BHK",
    bhkRaw: 3,
    propertyType: "Penthouse",
    carpetArea: "1,620 sq.ft",
    rating: 4.78,
    reviewsCount: 76,
    entranceImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop",
    livingRoomImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    bedroomImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
    kitchenImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
];

export const PROPERTY_TYPES = [
  {
    type: "1 RK",
    label: "1 RK",
    subtitle: "Compact Smart Studios",
    count: "450+ Listed",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop",
  },
  {
    type: "1 BHK",
    label: "1 BHK",
    subtitle: "Modern Urban Spaces",
    count: "1,200+ Listed",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop",
  },
  {
    type: "2 BHK",
    label: "2 BHK",
    subtitle: "Family Apartments",
    count: "3,800+ Listed",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop",
  },
  {
    type: "3 BHK",
    label: "3 BHK",
    subtitle: "Premium Residences",
    count: "2,900+ Listed",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
  },
  {
    type: "Villa",
    label: "Villa",
    subtitle: "Private Gated Estates",
    count: "850+ Listed",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  },
  {
    type: "Duplex",
    label: "Duplex",
    subtitle: "Double-Story Luxury",
    count: "420+ Listed",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
  },
  {
    type: "Penthouse",
    label: "Penthouse",
    subtitle: "Sky High Views",
    count: "230+ Listed",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop",
  },
];

export const AI_SHOWCASE_ITEMS = [
  {
    id: "showcase-1",
    title: "Modern Living Room",
    subtitle: "Scandinavian Oak & Integrated Ambient Cove Lighting",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "showcase-2",
    title: "Luxury Bedroom",
    subtitle: "Plush Velvet Headboard & Italian Statuario Marble Wall",
    beforeImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "showcase-3",
    title: "Minimalist Kitchen",
    subtitle: "Calacatta Quartz Island & Concealed Handleless Cabinetry",
    beforeImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "showcase-4",
    title: "Traditional Indian Interior",
    subtitle: "Sheesham Wood, Brass Inlay Motifs & Handcrafted Jali Accent",
    beforeImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    quote: "I could finally imagine how my furniture would fit before buying the apartment in Worli. The 3D spatial walkthrough saved us from a costly mistake!",
    author: "Rajesh Malhotra",
    location: "Mumbai Buyer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    rating: 5,
    quote: "The AI interior customizer let us visualize Italian marble flooring and custom teak wood wall panels in real-time. Unbelievably accurate experience.",
    author: "Ananya Sundaram",
    location: "Bengaluru Homeowner",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    rating: 5,
    quote: "Being an NRI buying in Gurgaon, the 3D walkthrough was a game changer. I inspected every corner of the DLF villa without flying down to India.",
    author: "Vikram Rawat",
    location: "Gurgaon Investor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
];
