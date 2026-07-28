/**
 * Studio services — the four engagements listed in the primary nav.
 *
 * Content lives here rather than in the pages so /services and
 * /services/[service] stay purely presentational, and so a future CMS only has
 * to satisfy the `Service` shape. Icons are stored as lucide names and resolved
 * by the pages, keeping this module free of React imports.
 */

export type Service = {
  slug: string;
  /** Full name, e.g. "Residential Interiors". */
  name: string;
  /** Short label for tight spots — cards, cross-links, breadcrumbs. */
  shortName: string;
  /** Lucide icon name, resolved via the pages' icon map. */
  icon: "Home" | "Building2" | "Box" | "MessagesSquare";
  /** One line that sells it. */
  tagline: string;
  /** Card-length paragraph for the services index. */
  summary: string;
  /** Longer positioning, shown on the detail page. Paragraphs split on "\n\n". */
  overview: string;
  cover: string;
  /** At-a-glance facts under the detail hero. */
  facts: { label: string; value: string }[];
  /** Who the engagement suits. */
  bestFor: string[];
  /** What the work covers. */
  includes: { title: string; copy: string }[];
  /** Ordered stages, fed to the shared process rail. */
  process: { title: string; description: string }[];
  /** Concrete artefacts the client ends up holding. */
  deliverables: string[];
  gallery: string[];
  faqs: { q: string; a: string }[];
};

const services: Service[] = [
  {
    slug: "residential",
    name: "Residential Interiors",
    shortName: "Residential",
    icon: "Home",
    tagline: "Homes planned around the way you already live.",
    summary:
      "Apartments, villas and full-home renovations, taken from first measurement to handover by one studio — with the whole thing walkable in 3D before a wall moves.",
    overview:
      "A home is the one space you can't design from a catalogue. We start with your routines — who cooks, where the bags land, which corner gets the good light at four in the afternoon — and let the plan follow from that.\n\nEvery decision is settled on screen first. You walk the rooms, swap the stone, move the island, and live with it for a week before anything is ordered. What gets built is the version you already approved.",
    cover: "/gallery/bedroom-02-1.jpg",
    facts: [
      { label: "Typical timeline", value: "45–90 days" },
      { label: "Scope", value: "1BHK to villa" },
      { label: "Handover", value: "Turnkey" },
      { label: "Workmanship", value: "10-yr warranty" },
    ],
    bestFor: [
      "First homes",
      "Family upgrades",
      "Full renovations",
      "Second homes",
    ],
    includes: [
      {
        title: "Space planning",
        copy: "Circulation, storage and proportion resolved on the plan before a single finish is picked.",
      },
      {
        title: "Custom joinery",
        copy: "Wardrobes, kitchens and units drawn to your walls and your things — not to standard modules.",
      },
      {
        title: "Materials & finishes",
        copy: "Stone, veneer, laminate and fabric sourced, sampled and tested against each other in daylight.",
      },
      {
        title: "Lighting design",
        copy: "Ambient, task and accent layers planned alongside a daylight study, not added at the end.",
      },
      {
        title: "Furniture & styling",
        copy: "Loose furniture, soft furnishings and the final styling pass that makes a room feel finished.",
      },
      {
        title: "Execution & handover",
        copy: "In-house site coordination, vendor management, and a snag list closed before we hand over keys.",
      },
    ],
    process: [
      {
        title: "Listen",
        description:
          "A conversation about how you live, what you'd never give up, and what the budget actually is.",
      },
      {
        title: "Plan",
        description:
          "Measured drawings, circulation and daylight settled — the boring part that decides everything.",
      },
      {
        title: "Visualise",
        description:
          "Your home modelled, lit and dressed at true scale. Walk it in the browser before you commit.",
      },
      {
        title: "Refine",
        description:
          "Change the stone, the joinery, the light temperature. On screen it costs an evening, not a month.",
      },
      {
        title: "Build",
        description:
          "Execution, installation and styling, coordinated on site against the model you signed off.",
      },
    ],
    deliverables: [
      "Measured floor plans & furniture layout",
      "Photoreal renders of every room",
      "Real-time 3D walkthrough link",
      "Material and finish board",
      "Joinery and detail drawings",
      "Lighting and electrical plan",
      "Itemised, line-by-line estimate",
      "Site supervision through handover",
    ],
    gallery: [
      "/gallery/kitchen-1.jpg",
      "/gallery/bedroom-01-1.jpg",
      "/gallery/kitchen-6.jpg",
    ],
    faqs: [
      {
        q: "Do you take on single rooms, or only full homes?",
        a: "Both. A single kitchen or bedroom is a perfectly normal project for us — the process is the same, just shorter. Full homes simply get more stages running in parallel.",
      },
      {
        q: "How long does a full home take?",
        a: "Most residential projects complete in 45 to 90 days from design sign-off, depending on scope and site condition. You get a firm, dated timeline before any work starts.",
      },
      {
        q: "Can I keep some of my existing furniture?",
        a: "Yes, and we'd encourage it. Anything you're keeping gets measured and placed in the 3D model early, so the new design is planned around it rather than fighting it.",
      },
      {
        q: "What happens if I want to change something mid-build?",
        a: "Changes on screen are free; changes on site are not. That's exactly why we resolve everything in 3D first. If something does have to move later, we re-price it in writing before we touch it.",
      },
    ],
  },
  {
    slug: "commercial",
    name: "Commercial Spaces",
    shortName: "Commercial",
    icon: "Building2",
    tagline: "Workplaces that hold up on a Monday, not just in photographs.",
    summary:
      "Offices, meeting rooms and breakout floors — planned around headcount, teams and the way people actually move between them, then fitted out in phases that keep you working.",
    overview:
      "A workplace has to earn its rent. Before we style anything, we work out the flows: how many desks the floor really holds, which teams need to sit within earshot, where a client is met, and where someone goes to take a call without disturbing a row of people.\n\nThe programme comes first — open workstations, cabins, meeting and board rooms, phone pods, pantry and washrooms, sized against your headcount and your growth. Brand comes next, in the materials, light and signage. Then we phase the fit-out around your working hours so the floor keeps running while it changes.",
    cover: "/services/commercial/breakout.png",
    facts: [
      { label: "Typical timeline", value: "60–120 days" },
      { label: "Scope", value: "500–20,000 sq ft" },
      { label: "Coordination", value: "MEP & fire" },
      { label: "Fit-out", value: "Phased" },
    ],
    bestFor: [
      "Offices & workplaces",
      "Meeting & board rooms",
      "Retail & showrooms",
      "Cafés & clinics",
    ],
    includes: [
      {
        title: "Brand-led concept",
        copy: "A material and colour direction that reads as your brand the moment someone walks in.",
      },
      {
        title: "Zoning & headcount",
        copy: "Desks, cabins and circulation planned against how many people sit here today and next year.",
      },
      {
        title: "Rooms & pods",
        copy: "Meeting and board rooms, MD cabins, phone pods and quiet corners, sized and acoustically placed.",
      },
      {
        title: "Pantry & washrooms",
        copy: "The parts everyone uses and nobody budgets for, detailed to the same standard as the front desk.",
      },
      {
        title: "Services coordination",
        copy: "HVAC, electrical, plumbing and fire routes resolved with your consultants before build.",
      },
      {
        title: "Phased fit-out",
        copy: "Sequenced so you keep trading — night works and zone-by-zone handovers where needed.",
      },
    ],
    process: [
      {
        title: "Brief",
        description:
          "Headcount, teams, growth plan, and what the floor has to say about the company to a visitor.",
      },
      {
        title: "Zone",
        description:
          "Desks, cabins, meeting rooms and pantry mapped to the plan before a single material is chosen.",
      },
      {
        title: "Visualise",
        description:
          "The fit-out modelled and lit so leadership walks the floor months before it's handed over.",
      },
      {
        title: "Coordinate",
        description:
          "Services, compliance and vendor drawings aligned so nothing gets cut open twice.",
      },
      {
        title: "Deliver",
        description:
          "Phased build around your working hours, snagged zone by zone, handed over ready to occupy.",
      },
    ],
    deliverables: [
      "Zoning and circulation study",
      "Desk and occupancy layout",
      "Photoreal renders & walkthrough",
      "Material and finish schedule",
      "Signage and wayfinding design",
      "Services coordination drawings",
      "Phased build programme",
      "Vendor management and snagging",
    ],
    gallery: [
      "/services/commercial/open-workspace.png",
      "/services/commercial/meeting-room.png",
      "/services/commercial/pods.png",
    ],
    faqs: [
      {
        q: "Can you fit out while we keep working?",
        a: "Usually, yes. We phase the build zone by zone and schedule noisy work outside office hours. We'll tell you honestly up front if moving the team out for a fortnight is genuinely cheaper.",
      },
      {
        q: "Do you handle approvals and compliance?",
        a: "We coordinate with your MEP, fire and structural consultants and produce the drawings they need. Statutory submissions are made by the licensed consultant of record.",
      },
      {
        q: "Do you work with our existing contractor?",
        a: "Often. If you have a contractor you trust, we design to their capability and supervise against it. If not, we bring our own vendor panel.",
      },
      {
        q: "Can we see the space before signing off the budget?",
        a: "That's the point of the walkthrough. Investors and franchise partners get a browser link to the finished space before the first invoice is raised.",
      },
    ],
  },
  {
    slug: "visualization",
    name: "3D Visualization",
    shortName: "3D Visualization",
    icon: "Box",
    tagline: "Your space, photoreal and walkable, before it exists.",
    summary:
      "Photoreal stills and real-time walkthroughs built from your drawings — for designers, architects and developers who need a room sold before it's built.",
    overview:
      "This is the engine the rest of the studio runs on, offered on its own. Send us drawings, references and a material intent, and you get the space back as an honest, true-scale model — lit properly, dressed in real finishes, ready to show.\n\nWe render stills where stills are enough, and a real-time walkthrough where a client needs to move through the room themselves. Everything is built in-house, so a revision is a message, not a re-brief.",
    cover: "/showcase/01-living-gilded.jpg",
    facts: [
      { label: "Turnaround", value: "5–10 days" },
      { label: "Stills", value: "4K, unlimited crops" },
      { label: "Walkthrough", value: "Runs in browser" },
      { label: "Revisions", value: "2 rounds included" },
    ],
    bestFor: [
      "Interior designers",
      "Architects",
      "Developers & builders",
      "Furniture brands",
    ],
    includes: [
      {
        title: "True-scale modelling",
        copy: "Geometry built from your plans at real dimensions, so proportion and sightlines stay honest.",
      },
      {
        title: "Daylight studies",
        copy: "Sun path run for the actual site and orientation — you see the room at the hours that matter.",
      },
      {
        title: "Material mapping",
        copy: "Stone, veneer, metal and fabric mapped at true scale and tested against each other.",
      },
      {
        title: "Camera & composition",
        copy: "Framing chosen the way a photographer would, then graded for a consistent set.",
      },
      {
        title: "Real-time walkthrough",
        copy: "An explorable model that opens in a browser on any device — no install, no plugin.",
      },
      {
        title: "Revision rounds",
        copy: "Two full rounds included, with marked-up feedback handled directly on the model.",
      },
    ],
    process: [
      {
        title: "Read the brief",
        description:
          "Drawings, references and intent — we start by understanding what the space is meant to feel like.",
      },
      {
        title: "Build the space",
        description:
          "Accurate geometry from the plan, so proportion and sightlines are honest before anything is styled.",
      },
      {
        title: "Light it",
        description:
          "Daylight studies and layered artificial light — the part that decides whether a render reads as real.",
      },
      {
        title: "Dress the materials",
        description:
          "Stone, veneer, metal and fabric mapped at true scale, tested against each other before they're specified.",
      },
      {
        title: "Tell the story",
        description:
          "Camera, composition and final grade — delivered as stills or a walkthrough you can move through.",
      },
    ],
    deliverables: [
      "4K photoreal stills, print-ready",
      "360° panoramas for every room",
      "Real-time browser walkthrough",
      "Daylight study at chosen hours",
      "Material and finish call-outs",
      "Before / after comparison frames",
      "Optional animated flythrough",
      "Source-quality crops on request",
    ],
    gallery: [
      "/showcase/03-bedroom-panelled.jpg",
      "/showcase/06-bedroom-daylight.jpg",
      "/showcase/04-dining-marble.jpg",
    ],
    faqs: [
      {
        q: "What do you need from us to start?",
        a: "A dimensioned plan or CAD file, elevations if you have them, a material intent or mood reference, and any product links you've already locked. That's enough to begin.",
      },
      {
        q: "How fast can you turn a set around?",
        a: "Five to ten working days for a typical room set, depending on how much modelling is involved. Rush turnarounds are possible — tell us the date and we'll say yes or no honestly.",
      },
      {
        q: "Can we white-label the output for our clients?",
        a: "Yes. Plenty of our visualization work goes out under another studio's name. No Rumiva branding appears on deliverables unless you ask for it.",
      },
      {
        q: "What counts as a revision?",
        a: "Material swaps, lighting changes, camera adjustments and styling tweaks all sit inside a round. Re-modelling a room after a layout change is new scope, and we'll quote it before starting.",
      },
    ],
  },
  {
    slug: "consultation",
    name: "Design Consultation",
    shortName: "Consultation",
    icon: "MessagesSquare",
    tagline: "One focused session. Honest answers, nothing to sign.",
    summary:
      "Ninety minutes on your layout, materials and budget — on site or over video — ending with a written summary you can act on with or without us.",
    overview:
      "Not every project needs a studio. Sometimes you need someone to tell you whether the wall can come down, whether the budget is real, and which three decisions actually matter.\n\nA consultation is exactly that: a focused session with the designer, no pitch attached. You leave with marked-up plans, a material direction and a realistic number. If you go on to work with us, the fee comes off your first invoice.",
    cover: "/cards/img3_.jpg",
    facts: [
      { label: "Format", value: "90 minutes" },
      { label: "Mode", value: "On-site or video" },
      { label: "Summary", value: "Within 48 hours" },
      { label: "Fee", value: "Credited to project" },
    ],
    bestFor: [
      "Pre-purchase reviews",
      "Second opinions",
      "Self-managed renovations",
      "Stalled projects",
    ],
    includes: [
      {
        title: "Layout review",
        copy: "We walk your plan and flag what's working, what's wasted, and what can safely change.",
      },
      {
        title: "Material direction",
        copy: "A shortlist of finishes that suit the light, the use and the budget you actually have.",
      },
      {
        title: "Budget reality check",
        copy: "An honest indicative range for the scope you're describing, before you commit to anyone.",
      },
      {
        title: "Vendor guidance",
        copy: "Where to buy, what to pay, and which trades to line up in what order.",
      },
      {
        title: "Written summary",
        copy: "Everything we discussed, sent within two working days so nothing lives only in your notes.",
      },
    ],
    process: [
      {
        title: "Share",
        description:
          "Send plans, photos or just a floor sketch, plus what's bothering you about the space.",
      },
      {
        title: "Meet",
        description:
          "Ninety minutes on site or over video, walking the space and the options in real time.",
      },
      {
        title: "Summarise",
        description:
          "Marked-up plans, a material shortlist and an indicative budget, in writing within 48 hours.",
      },
      {
        title: "Decide",
        description:
          "Take it to your own contractor, or bring us in — the fee comes off your first invoice either way.",
      },
    ],
    deliverables: [
      "Annotated plan mark-ups",
      "Prioritised list of changes",
      "Material and finish shortlist",
      "Indicative budget range",
      "Vendor and trade pointers",
      "Written session summary",
    ],
    gallery: [
      "/cards/img1_.jpg",
      "/cards/img5_.jpg",
      "/gallery/kitchen-4.jpg",
    ],
    faqs: [
      {
        q: "Is the consultation free?",
        a: "No — it's a paid, focused session, which is why it stays honest rather than turning into a sales pitch. If you go ahead with a project, the fee is credited against your first invoice.",
      },
      {
        q: "Do you consult outside Mumbai and Bengaluru?",
        a: "Over video, anywhere. On-site visits outside those two cities are possible with travel costs added — ask when you book.",
      },
      {
        q: "What if I just want a second opinion on someone else's design?",
        a: "That's one of the most common reasons people book. Send the drawings and quote you've been given, and we'll tell you plainly what we'd question.",
      },
      {
        q: "Can a consultation turn into a full project?",
        a: "Often it does, but nothing obliges you. You own the summary and are free to build from it with any contractor you like.",
      },
    ],
  },
];

export function getServices(): Service[] {
  return services;
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** The other three, for cross-links at the foot of a detail page. */
export function getOtherServices(slug: string): Service[] {
  return services.filter((s) => s.slug !== slug);
}
