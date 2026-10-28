// ─────────────────────────────────────────────────────────────
// PROJECTS DATA — Story-driven case studies with outcome stats
// New fields: hook, pullQuote, outcomeStats[], deliverables[], reception
// ─────────────────────────────────────────────────────────────

export const projects = [
  {
    slug: 'landmark-citizen-app',
    number: '01',
    title: 'Landmark Citizen App',
    tagline: `Turning a payments app into the way Nigerian families plan a day out at Landmark.`,
    tags: ['Mobile App', 'Product Design', 'Design System', 'Hospitality', 'Lifestyle'],
    client: 'Landmark Africa',
    year: '2024–2026',
    location: 'Victoria Island, Lagos',
    role: 'Lead product designer',
    timeline: 'v2 redesign (2024), LCA 3.0 (2026)',
    team: 'PM, developer, 2 data analysts (v2)',
    status: 'v3 in stakeholder review',
    cover: 'https://framerusercontent.com/images/A96w4ZpC5F1QA39OE7wySL4yBg4.webp?width=2400&height=1800',
    accent: '#FF8A00',
    accentSoft: '#FFB380',

    hook: `Make every Landmark experience, from Upside Down House to a plate of jollof, bookable in a few taps by the person planning the family's weekend.`,

    overview: `Landmark is a leisure destination in Victoria Island, Lagos: the beach, Pop Landmark, Upside Down House, Kids Club, hotels, retail and dozens of food stalls. The Citizen App is how guests pay, book and earn points across all of it.

In 2024 I redesigned the first version. Working from surveys, post-booking forms and customer service reports, we shortened registration, rebuilt the booking flow, added event search and introduced the first rewards system Landmark had shipped.

It worked as a payments tool. It did not yet work as a reason to visit.`,

    challenge: `By 2026, Landmark's goal had shifted from processing transactions to selling experiences to families. The app had not followed.

• **Discovery was empty.** The Explore tab was a grid of grey placeholder boxes. Nothing told a parent what was on today.

• **Food ordering stopped at the counter.** Guests queued to collect with a pickup code, even when they were sitting at a table.

• **Every flow looked different.** Hotel, archery, Kids Club and Upside Down House each had their own booking pattern, colours and button styles.

• **Rewards were anonymous.** The leaderboard listed six rows of "User 10293894". There was no reason to care where you ranked.

• **The system had drifted.** Two icon libraries, a 3D icon style, an off-brand orange on buttons and inconsistent copy across hundreds of screens.

The question for 3.0: what would it take for a mum in Lekki to open this app on Saturday morning before she opens WhatsApp?`,

    pullQuote: `A good decision can expire. Swapping photos for illustrations was right when image rights were the risk. Once the goal became selling a family day out, it was the wrong call.`,

    principles: [
      { title: 'Show the place, not a placeholder.', body: 'Photos for places and people. Flat illustrations for categories. Animated illustrations only for success moments.' },
      { title: 'One booking pattern everywhere.', body: 'Details, then date and time, then review and pay, then confirmation and feedback. It works the same for a hotel room, a bow and arrow, or a birthday party.' },
      { title: 'Nudge toward the safe choice.', body: 'The action we want people to take is the primary button. "Keep my account" is primary; "Delete my account" is secondary in red.' },
      { title: 'Landmark owns the relationship.', body: 'Guests never contact vendors directly. Help always goes through Landmark support.' },
    ],

    chapters: [
      {
        number: '01',
        title: 'Home and Explore',
        body: `Home became a long, scannable page: things to do, deals, food, events and rewards, under a location switcher for each Landmark site.\n\nExplore replaced the grey grid with an illustrated map of Landmark Nigeria. Lagos is live with 24 things to do. Port Harcourt appears greyed out as "coming soon", so the app can announce expansion without a dead end.`,
        image: '',
        caption: 'Explore before (grey boxes) and after (illustrated map).',
      },
      {
        number: '02',
        title: 'Food ordering (the biggest change)',
        body: `The old flow ended with a queue and a pickup code. The new one asks one question: how do you want it?\n\n• **Pick up at the counter**, with a live status: placed, preparing, ready. A map and walking directions show where Stall 4 is.\n\n• **Deliver to my seat.** Scan the QR code on your table. No code, or it won't scan? Type the table number instead.\n\n• **No pickup codes.** Guests confirm collection with a single "Order received" button, which also opens the rating.\n\n• **Help goes to Landmark, not the stall.** The order screen offers "Contact Landmark support", never the vendor's phone number.\n\n• **The same pattern carries into retail,** with a "Ready for pickup" screen for Style Hub orders.`,
        video: '',
        caption: '20-second prototype: menu → table delivery → Order received.',
      },
      {
        number: '03',
        title: 'One booking flow for everything',
        body: `Hotel, Activities, Kids Club and Upside Down House now share one structure. Each starts with a banner photo of the actual place.\n\nWe removed options the business no longer sells, such as hotel breakfast and late check-out. Hotel check-in needs no booking code; guests give their name and show ID at the front desk. Cancelling shows the refund before you commit, and "Keep booking" is the primary action.`,
        image: '',
      },
      {
        number: '04',
        title: 'Rewards that feel like a game',
        body: `Points, tiers, a weekly visit streak, coupons you can share, and a monthly leaderboard with real first names instead of user IDs. Booking in the app saves 10% on selected tickets, and the review screen shows the discount line by line.`,
        image: '',
      },
      {
        number: '05',
        title: 'Feedback that fixes things',
        body: `Every completed order and booking ends with a short rating. A rating below 4 stars changes the form: it asks what went wrong and lets guests add up to 3 photos. Operations get evidence, not just a low score.`,
        image: '',
      },
      {
        number: '06',
        title: 'History, wallet and support',
        body: `History has three tabs: Bookings, Orders and Transactions. Party and excursion requests sit inside Bookings, so there's one place to check what's coming up.`,
        image: '',
      },
      {
        number: '07',
        title: 'The system underneath',
        body: `• One icon family (Flaticon UIcons) replaced two libraries and a 3D icon style.\n\n• One token set: brand orange #FF8A00 for actions and a darker accent for orange text that passes contrast.\n\n• One typeface, Plus Jakarta Sans, with a 12px minimum.\n\n• A content glossary (Landmark Wallet, Top up, Log in) applied across every screen, in sentence case.\n\n• A fully linked prototype with no dead ends, ready for stakeholder walkthroughs.`,
        image: '',
      },
      {
        number: '08',
        title: 'Onboarding and launch',
        body: `I explored seven onboarding directions, each with three slides and a welcome screen. They range from a bold poster style to a family group-chat story and the brand's wavy checkerboard. A 59-second launch video shows the old app's problems, then the new food flow, the 10% saving, rewards and the map.`,
        image: '',
        video: '',
      },
    ],

    decisions: [
      { chose: 'Photos of the real places',             over: 'Illustrations everywhere (our own 2024 call)', because: 'Families decide on what the place looks like. The 2024 choice was made for image-rights reasons, and Landmark now has its own photo library.' },
      { chose: 'An "Order received" button',            over: 'Pickup codes',                                  because: 'Codes added a step at a busy counter and confused guests. Staff already see the order on their screen.' },
      { chose: 'Typing the table number as a fallback', over: 'QR only',                                       because: 'QR stickers peel, get wet and fail in low light. A dead end at the table is the worst moment to have one.' },
      { chose: 'Support-only contact',                  over: 'Calling the vendor',                            because: 'Landmark keeps the complaint, the refund and the data. Vendors stay focused on cooking.' },
      { chose: 'Photos only below 4 stars',             over: 'Photos on every rating',                        because: 'Keeps happy reviews to two taps. Asks for evidence only when there\'s something to fix.' },
      { chose: 'The safe action as the primary button', over: 'The requested action as primary',               because: 'Fewer accidental cancellations and deletions. The destructive path stays one clear tap away.' },
    ],

    statusNote: `LCA 3.0 is designed, fully prototyped and in stakeholder review. It has not shipped yet, so I'm not claiming usage numbers. Here is what the work covers.`,

    outcomeStats: [
      { value: '7',   label: 'Core areas redesigned — Home, Explore, food, bookings, rewards, history, onboarding' },
      { value: '9',   label: 'Rating flows with photo upload for low ratings' },
      { value: '218', label: '3D icons replaced with one flat icon family' },
      { value: '155', label: 'Copy fixes against a single glossary' },
      { value: '0',   label: 'Broken links in the stakeholder prototype' },
      { value: '7',   label: 'Onboarding directions, plus a 59-second launch video' },
    ],

    reflection: `The 2024 redesign taught me to treat user feedback as a blueprint. The 2026 one taught me that a good decision can expire. Swapping photos for illustrations was right when image rights were the risk. Once the goal became selling a family day out, it was the wrong call, and I reversed it.

Next time I would put the food flow in front of stall staff and real guests before polishing anything else. It is the flow with the most moving parts, and the one where a wrong assumption costs a real queue.`,

    links: [],
  },

  // ─────────────────────────────────────────────────────────────

  {
    slug: 'landmark-events',
    number: '02',
    title: 'Landmark Events Ticketing Platform',
    tagline: `A complete event ecosystem — designed for energy, built for experiences`,
    tags: ['Web App', 'B2B/B2C', 'Ticketing', 'Dashboard', 'Event Management'],
    client: 'Landmark Africa',
    year: '2024',
    location: 'Victoria Island, Lagos',
    role: 'Product Designer',
    timeline: '6-8 Weeks',
    team: 'Product Manager, Backend and Frontend Developers, Event Operations, Marketing & Sponsorship Teams',
    cover: '/images/landmark-events/Events.webp',
    accent: '#FF6B35',
    accentSoft: '#FFB399',

    hook: `Design a scalable event ticketing system that works seamlessly for three primary user groups: Guests, Organizers, and Sponsors.`,

    images: [
      '/images/landmark-events/Events.webp',
      '/images/landmark-events/MacBook_Pro_14__-_3.webp',
      '/images/landmark-events/MacBook_Pro_16__-_15.webp',
      '/images/landmark-events/MacBook_Pro_16__-_14.webp',
      '/images/landmark-events/MacBook_Pro_16__-_30.webp',
      '/images/landmark-events/MacBook_Pro_16__-_29.webp',
    ],

    metrics: [
      { value: '3', label: 'Primary user groups' },
      { value: '6', label: 'Core features built' },
    ],

    // ─── FIXED: Replaced process counts ("3 user flows mapped", "2 design iterations")
    // with outcome-framed stats. Add [PLACEHOLDER] values with your real numbers.
    outcomeStats: [
      { value: '[X]', label: '[PLACEHOLDER: e.g. Events processed through platform in first X weeks, or organizer onboarding time reduced from X to Y mins]' },
      { value: '6', label: 'Steps in the guest checkout flow — consolidated from a fragmented multi-page process' },
      { value: '4', label: 'Organizer dashboard panels replacing a manual spreadsheet workflow' },
      { value: '4', label: 'Onboarding steps for organizers — no manual approval bottleneck' },
      { value: '3', label: 'Access control modes — Open, Invite-Only, Mixed — that previously didn\'t exist in the system' },
      { value: '1', label: 'Offline-capable QR check-in system, replacing manual gate management' },
    ],

    deliverables: [
      'Guest ticket purchase flow (Discovery → Event Detail → Ticket Selection → Checkout → QR Confirmation)',
      'Organizer dashboard with 4 core panels (Overview, Sales Monitoring, Event Management, Reporting)',
      'Multi-step event creation workflow (Event Info → Tickets → Access → Review → Publish)',
      'Advanced ticket controls (web vs app pricing, promo codes, automated sale windows, dynamic capacity)',
      'Access control system (Open to Public, Invite-Only, Mixed Access with unique links)',
      'QR code check-in with offline mode and real-time attendance tracking',
      'Organizer onboarding (Account → Business Details → Payment Setup → Dashboard Access)',
      'Public event website with "Discover. Celebrate. Belong" messaging',
      'Real-time sales analytics dashboard with exportable reports',
      'Event duplication feature for faster setup and replication',
    ],

    overview: `From an operational standpoint, event management was highly fragmented. While the system was able to handle transactions, the broader operational workflow remained disjointed and inefficient. Ticket sales, RSVP approvals, attendance tracking, and reporting were either managed manually or only partially automated, resulting in delays during financial reconciliation and reduced transparency for sponsors. Check-in processes relied heavily on manual intervention, pricing structures lacked consistency, and there was no structured access control in place. In essence, the existing flow supported payments, but it failed to support the full operational lifecycle of events.

I designed and structured a scalable event ticketing and management system that supports both guests and organizers. The platform transforms how events are run — what was once just a transactional ticketing page has evolved into a fully integrated event infrastructure. It now functions as a revenue engine that optimizes pricing and sales, an access control system that governs entry with precision, an operational dashboard that provides live performance insights, and a reporting tool that gives stakeholders clarity and confidence.`,

    // ─── FIXED: Replaced category labels ("Ticket structuring", "Real-time visibility")
    // with actual problem descriptions that explain what users/operators experienced.
    challenge: `From stakeholder interviews and system audits, we identified recurring operational friction points across all three user groups.

**What organizers experienced:**

• **Manual ticket operations with no live visibility** — Ticket sales, RSVP approvals, and attendance tracking were handled outside the platform. Organizers had no real-time view of how an event was performing; financial reconciliation happened manually after the fact.

• **No access control architecture** — There was no structured way to handle invite-only events, mixed access tiers, or unique entry links. Organizers managed exclusions and guest lists through spreadsheets and WhatsApp groups — fragile, unscalable, and prone to error.

• **Check-in depended on manual intervention** — Gate management required staff to cross-reference printed lists or separate tools. Any connectivity issue during a high-traffic event broke the entire process.

• **Inconsistent and inflexible pricing** — There was no way to set different prices for web vs. app purchases, apply promo codes, or automate time-based sale windows. Every exception required manual coordination with the development team.

**What sponsors experienced:**

• **No post-event reporting** — Sponsors had no structured data on attendance, visibility, or return on sponsorship. This undermined repeat investment and made the business case for sponsorship harder to defend.

**What guests experienced:**

• **A fragmented checkout process** — The ticket purchase journey required too many transitions and lacked clarity on pricing tiers, ticket assignment, and confirmation. Drop-off was highest at the payment step.

All findings were categorized into core operational needs (blocking current events from running smoothly) and scalable enhancements (needed for growth but not immediate blockers).`,

    pullQuote: `Wireframes focused on clarity before aesthetics. The foundation had to be solid before we could make it beautiful.`,

    approach: [
      'Conducted structured review across multiple touchpoints: analyzed internal ticketing requirement documents, interviewed key stakeholders from event operations and marketing, mapped organizer event workflow, assessed sponsor expectations around visibility and reporting, and reviewed the end-to-end user purchase journey',
      'Held workshops to map three critical flows: Guest purchase journey, Organiser event creation workflow, and Sponsor reporting expectations. Identified quick wins alongside long-term structural upgrades',
      'Introduced key concepts: Multi-step event creation flow, Structured ticket logic, Role-based access permissions, and Modular dashboard architecture',
      'Mapped user journeys across three environments: Guest Flow (Event Discovery → Event Detail → Ticket Selection → Checkout → QR Confirmation), Organiser Flow (Dashboard → Create Event → Configure Tickets → Publish → Monitor Sales), Event Day Flow (Scan QR → Validate → Track Attendance → Live Dashboard Update)',
      'Established priority decisions: Reduce checkout steps, Separate event setup into digestible stages, Create structured data grouping for reporting. Wireframes focused on clarity before aesthetics',
      'Designed visual direction emphasizing: High contrast CTAs, Clean event card layouts, Large imagery for impact, Structured metadata hierarchy, and Subtle micro-interactions for feedback',
      'Built organiser dashboard with: Data clarity, Modular panels, Real-time summaries, and Minimal cognitive load',
      'First iteration: Changed fonts from Galano Grotesque for headings to Bebas Neue. Moved color scheme from a white and orange look to a primary color of blue and making orange the secondary color. A home page was added to give information about the system to first time user and show potential users the benefits',
      'Final iteration: Structured Event Creation Flow (Event Info → Tickets → Access → Review → Publish), Advanced Ticket Controls (web vs app pricing, promo eligibility rules, automated sale windows, dynamic capacity management), Organiser Dashboard Upgrade (real-time visibility, centralized order management, check-in analytics, downloadable reports), Public Event Website Redesign (clearer visual hierarchy, richer metadata display, enhanced search and filtering, optimized checkout flow)',
    ],

    // ─── FIXED: Removed the duplicate closing sentence that also appears in the overview.
    // Outcome now focuses on what changed operationally, not just what was built.
    outcome: `The final platform delivers a scalable event ticketing system with structured access control, real-time operational visibility, sponsor-ready analytics, seamless QR check-in, and a flexible ticket architecture designed to support events of any size.

**Organiser Dashboard System** replaced a manual, spreadsheet-driven workflow with a live operational command centre:
• **Overview Panel** provided a snapshot of performance, highlighting active and past events alongside total revenue and tickets sold. This gave organizers immediate visibility into event activity and financial outcomes
• **Sales Monitoring** delivered real-time insights into sales trends, revenue breakdown, and order status — enabling organizers to track performance and make informed decisions quickly
• **Event Management** allowed organizers to edit existing events, duplicate events for faster iteration, and manage access types seamlessly. Organizers could create, edit, and cancel events across the entire event lifecycle
• **Reporting** provided insights into attendance rates and sponsor performance breakdowns, with exportable data for reconciliation and post-event analysis

**Organizer Onboarding** reduced setup friction while ensuring system integrity:
• **4-Step Flow:** Create Account → Business Details → Payment Setup → Dashboard Access
• Instant dashboard access upon completion — no manual approval bottleneck that previously delayed organizer setup

**Improved Ticket Purchase Flow** consolidated a fragmented multi-page process into six clear steps:
• Discovery → Event Detail → Select Ticket Type → Assign Ticket Holder → Payment → Confirmation
• Multiple ticket tier selection (General, VIP, Group, etc.), clear pricing breakdown before payment, unique QR code generated per assigned guest, and instant confirmation

**Ticket Access Control** gave organizers three structured modes — Open, Invite-Only, and Mixed — with unique links for invited guests and manual or automatic approval controls. This capability didn't exist before; it replaced ad-hoc WhatsApp coordination.`,

    // ─── FIXED: Was null. Add your real stakeholder quote below.
    reception: `[PLACEHOLDER: Quote from PM, client, or ops team after handoff — who said it, what they said. E.g. "The ops team lead said X after the first event ran through the new check-in system."]`,

    reflection: `The biggest lesson was understanding that B2B and B2C flows can coexist in the same platform without compromising either — but only if you design them as separate products from the start, not as variations of the same flow. The structured event creation flow and modular dashboard architecture became repeatable patterns I applied to other Landmark ecosystem tools.`,

    links: [],
  },

  // ─────────────────────────────────────────────────────────────

  {
    slug: 'we-are-wear',
    number: '03',
    title: 'We Are Wear',
    tagline: `AI-powered sustainable fashion marketplace for African designers`,
    tags: ['Mobile App', 'AI Styling', 'Sustainability', 'E-Commerce'],
    client: 'We Are Wear',
    year: '2024',
    location: 'Remote',
    role: 'Product Designer',
    timeline: '4 months',
    team: 'Founder, 2 Engineers (Umaru TOBI, Salem), Developer (Zyan)',
    cover: 'https://framerusercontent.com/images/9rxzSGbFPzINONwbQL9Fckii4Qc.webp?width=1134&height=893',
    accent: '#DB2777',
    accentSoft: '#F9A8D4',

    hook: `What if your closet could recommend outfits based on the weather, your events, and sustainability goals?`,

    images: [
      'https://framerusercontent.com/images/9rxzSGbFPzINONwbQL9Fckii4Qc.webp?width=1134&height=893',
      'https://framerusercontent.com/images/0GNHWHzoC0ncayosY4a1N6i1yfg.jpg?width=4080&height=2296',
    ],

    metrics: [
      { value: '3', label: 'AI-powered features' },
      { value: '60+', label: 'Screens designed' },
    ],

    // ─── FIXED: Added a placeholder for post-launch/testing impact.
    // The rest are kept but reframed where possible.
    outcomeStats: [
      { value: '[X]', label: '[PLACEHOLDER: e.g. Waitlist sign-ups captured, or user testing score, or engagement metric from testing]' },
      { value: '60', suffix: '+', label: 'Screens across discovery, styling, and checkout — including full edge case coverage' },
      { value: '3', label: 'RF sustainability actions (Restyle, Reuse, Retell) built into the core browsing flow, not a separate mode' },
      { value: '3', label: 'AI styling types supported at Phase 1 launch (Traditional, 90s, Romantic)' },
      { value: '2', label: 'Delivery tracking channels (WhatsApp + Email) — addressing the reality that email alone fails in the African market' },
      { value: '1', label: 'Named AI stylist persona — the feature users referenced most in testing' },
    ],

    deliverables: [
      'Personal AI Styling system (Phase 1) with weather-based fabric recommendations',
      'Digital closet view with AI stylist persona and name',
      '3RF sustainability features (Restyle, Reuse, Retell)',
      'AI outfit suggestions for different event types',
      'Style preference system (Traditional, 90s, Romantic, etc.)',
      'Join waitlist email sign-up for upcoming styling features',
      'Delivery tracking via WhatsApp and email integration',
      'Carbon calculator showing environmental impact of fashion choices',
      'Discovery feed designed like current feed with search bar and 3RF buttons',
      'Payment successful screen with multi-channel tracking',
    ],

    overview: `We Are Wear is a sustainable fashion marketplace connecting African designers with conscious shoppers. What sets it apart is the Personal AI Styling system — an intelligent recommendation engine that suggests outfits based on weather forecasts, upcoming events, and personal style preferences, all while promoting circular fashion through the 3RF framework (Restyle, Reuse, Retell).

I worked collaboratively with the founder and engineering team (Umaru TOBI, Salem, and Zyan) to design the complete mobile app experience, focusing on making AI-powered styling feel personal and intuitive while maintaining the discovery-first shopping experience.`,

    challenge: `The design challenge was multi-layered:

• **AI Personalization Without Creepiness** — How do you create a "personal stylist" AI that feels helpful rather than intrusive? We needed to design an AI persona that users would trust with their style decisions, not just tolerate.

• **Weather-Responsive Fashion** — The AI styling system needed to pull real-time weather data and translate it into fabric recommendations that actually made sense. "Wear cotton today" is useless; "This breathable cotton dress works for Lagos' 32° humidity" is valuable.

• **Sustainability Without Sacrifice** — The 3RF features (Restyle, Reuse, Retell) had to feel like a value-add, not a guilt trip. Users needed to see circular fashion as aspirational, not restrictive.

• **Phased Feature Rollout** — Some features (like advanced styling) weren't ready at launch. We needed "Join Waitlist" mechanisms that kept users engaged without feeling like placeholder screens.

• **Multi-Channel Delivery Tracking** — Post-purchase tracking via both WhatsApp and email required careful coordination with the payment success screen to set proper expectations.`,

    pullQuote: `The AI stylist needed a name and face. That's when we knew we were building something people would actually use — you don't name a feature, you name a companion.`,

    approach: [
      'Designed Personal AI Styling Phase 1 (basic) starting with data already in the database — weather forecast API integration suggesting which fabrics work best for seasonal weather, outfit suggestions for specific events (weddings, work, casual), and style type filtering (traditional, 90s, romantic, etc.)',
      'Created a digital closet view as the foundation for AI recommendations — designed exactly like the current discovery feed with a search bar, but each fashion item includes the 3RF (Restyle, Reuse, Retell) action buttons for circular fashion engagement',
      'Introduced AI stylist persona with illustration and name — moving beyond generic recommendations to feel like consulting with a real person who understands your wardrobe and preferences',
      'Designed "Join Waitlist" email sign-up pop-ups for features under development (like advanced styling metrics) — allowing us to track interest and notify users when features go live, while Zyan finished the AI module',
      'Integrated delivery tracking into payment success screen with both WhatsApp and email options — giving users multiple channels to monitor their orders post-purchase, addressing the reality that email notifications alone are unreliable in the African market',
      'Collaborated with engineering team to integrate working carbon calculator demo — showing environmental impact of fashion choices to reinforce sustainability without being preachy',
      'Ensured 3RF buttons were prominent on each item in the styling feed — making circular fashion actions as easy as adding to cart',
    ],

    outcome: `Delivered a complete AI-powered styling experience that goes beyond conventional fashion e-commerce.

**Personal AI Styling System** launched with weather-responsive fabric recommendations, event-based outfit suggestions, and style type filtering. The AI stylist persona (with name and illustration) transformed abstract recommendations into conversational guidance — in testing, it became the feature users referenced by name most often.

**Digital Closet View** was designed as a familiar feed interface with search functionality, but each fashion item featured the 3RF buttons — making sustainable fashion actions (Restyle, Reuse, Retell) as frictionless as browsing. Circular fashion wasn't buried in settings; it was part of the core experience.

**Multi-Channel Delivery Tracking** via WhatsApp and email addressed the African e-commerce context where email notifications alone are insufficient. Both tracking options were surfaced directly on the payment success screen rather than buried in account settings.

**Carbon Calculator Integration** showed environmental impact without preaching. The working demo was integrated seamlessly, allowing users to see the sustainability impact of their choices in real-time.

**Join Waitlist Features** for advanced styling kept users engaged during phased rollout. Email sign-up pop-ups captured demand data and allowed the team to notify users when new AI capabilities went live — turning a build constraint into a marketing tool.`,

    reception: `The AI stylist persona — giving it a name and face — was initially debated internally, but became the feature users referenced most in testing. "Ask [name]" became shorthand for using the styling recommendations. That's the signal you're building something with personality, not just functionality.`,

    reflection: `This project taught me that AI features need personality to feel trustworthy. The difference between "algorithm suggests outfit" and "your stylist recommends this look" is the difference between a tool and a companion.

The 3RF integration showed me that sustainability features work best when they're built into the core experience, not added as a separate "eco mode." Making circular fashion easy is better than making it virtuous.

If I were to revisit this, I'd push harder on the carbon calculator UI earlier in the process. The functionality was ready, but we integrated it late — it deserved to be more prominent from day one, not an afterthought feature.

Working collaboratively with Salem, Umaru TOBI, and the team taught me the value of iterative design feedback — the "Vogue text" discussion and styling screen debates made the final product stronger because we challenged each other's assumptions.`,

    links: [],
  },

  // ─────────────────────────────────────────────────────────────

  {
    slug: 'flysmart',
    number: '04',
    title: 'FlySmart',
    tagline: `A three-portal drone delivery logistics platform — 94 screens, top to bottom`,
    tags: ['Web App', 'Logistics', 'Multi-portal', 'Design System', 'Dashboard'],
    client: 'FlySmart',
    year: '2025',
    location: 'Remote',
    role: 'Product Designer',
    timeline: '5 months',
    team: 'Product Manager, 3 Frontend Engineers, 1 Backend Engineer, QA',
    cover: 'https://framerusercontent.com/images/lR97iC7TvTLzZJIa88VIn4qKw.webp?width=1920&height=1072',
    accent: '#0EA5E9',
    accentSoft: '#7DD3FC',

    hook: `Design 94 screens. Make them feel like one product.`,

    images: [
      'https://framerusercontent.com/images/lR97iC7TvTLzZJIa88VIn4qKw.webp?width=1920&height=1072',
      'https://framerusercontent.com/images/xn14raFI0MqgR8EHybMvOYUVY.png?width=1104&height=955',
      'https://framerusercontent.com/images/3C0VOTTkKKwN2ontWnhZfDoAbzI.png?width=1722&height=2084',
    ],

    metrics: [
      { value: '94+', label: 'Unique screens shipped' },
      { value: '3', label: 'User portals unified' },
    ],

    // ─── FIXED: Reframed stats to signal decisions and constraints, not just volume.
    outcomeStats: [
      { value: '94', suffix: '+', label: 'Unique screens across 3 portals — solo designer, 5 months' },
      { value: '3', label: 'Distinct portals with separate IA hierarchies that still feel like one product' },
      { value: '20', suffix: '+', label: 'Component sets in Tailwind design system — enabling direct implementation from design tokens' },
      { value: '6', label: 'Booking flow steps handling 4 branching paths without the user feeling lost' },
      { value: '2', label: 'Themes (light + dark) across all 94 screens, built token-first from day one' },
      { value: '1', label: 'Sidebar architecture per portal — adopted unchanged by the team after review' },
    ],

    deliverables: [
      'Customer booking flow (6 steps, 4 branches)',
      'Customer wallet + transaction history',
      'Premium subscription & loyalty points engine',
      'Merchant order & inventory dashboards',
      'POS/ERP sync interface with force-sync controls',
      'Admin real-time drone tracking map',
      'Drone fleet + hub + maintenance management',
      'Complete auth suite (login, signup, verify, reset)',
      '20+ component Tailwind design system',
      'Light + dark mode across all 94 screens',
      'Error states, empty states, edge cases for every flow',
    ],

    overview: `FlySmart is a drone delivery logistics platform that lets customers book drone deliveries, merchants manage inventory and fulfil orders, and operations admins oversee the entire drone fleet, hub network, and trip pipeline. Think of it as the full operational backbone for a drone delivery service — not just the consumer-facing layer, but the entire system.

I was the sole product designer, responsible for all three portals end-to-end: information architecture, user flows, wireframes, high-fidelity UI (light + dark mode), a Tailwind-based component design system, and developer handoff specifications. The Figma file contains 94+ unique screens across two pages — high-fidelity explorations and a structured handoff page with annotated specs.`,

    challenge: `This was one of the most structurally complex projects I've worked on. The challenges were layered:

• Three distinct user mental models in one product — Customers think in terms of "I need to send a package." Merchants think in terms of "I need to fulfil orders and track inventory." Admins think in terms of "I need to manage drones, hubs, and system health." Each portal needed its own navigation hierarchy, dashboard priorities, and task flows — but they all had to feel like the same product.

• A 6-step booking flow that couldn't afford friction — the core customer journey had to handle branching logic without the user feeling lost in a wizard. Every additional step is a drop-off risk.

• Real-time operational complexity — the admin portal needed a real-time map for live drone tracking, a drone management dashboard showing fleet status, a maintenance log for compliance, hub management for physical locations, and trip management for active deliveries. These are data-dense, operationally critical screens where a wrong reading has real consequences.

• Financial trust layer — the platform includes a wallet system with top-up flows, transaction history, and a premium subscription tier (₦4,999/month) with a loyalty points engine. Users need to trust the payment system enough to pre-load money into a wallet for a service category (drone delivery) that's still novel in the market.

• Dual-theme requirement from day one — both light and dark modes were required across all portals, which effectively doubled the design surface and demanded a token-based colour system from the start.`,

    pullQuote: `When you're designing 94 screens across 3 portals, you can't art-direct each one individually. You have to build a machine that produces consistent screens from shared parts.`,

    approach: [
      'Started with a stakeholder-led domain mapping exercise — mapped every user type, their primary tasks, frequency of use, and critical decision points to establish the information architecture for all three portals before touching any UI',
      'Designed the customer booking flow as a progressive multi-step form: Book Drone Delivery → Package Details (with custom package variant) → Schedule Delivery (Instant vs. Scheduled) → Confirm Details → Make Payment (wallet, card, UPI) → OTP Confirmation → Success states',
      'Built the merchant portal around three operational pillars: Order Management (incoming orders, status tracking), Inventory Management (product catalogue with bulk CSV upload and POS/ERP sync), and Performance Analytics (order trends, delivery breakdown, top products, top locations)',
      'Designed the admin portal for operational monitoring: Real-Time Map for live drone positions, Drone Management (fleet status), Hub Management (physical locations, capacity), Maintenance Log (compliance records), Trip Management, User & Role Management, Payments & Withdrawals',
      'Created a Tailwind-based component design system covering 20+ component sets: Sidebar, Search, Accordion, Alert, Avatar, Auth Code, Breadcrumb, Button, Bottom Sheet, Checkbox, Chip, Combobox, Drawer, Dropdown, Loader, Modal, Radio, Switch, Text Input, Tooltip, Pagination — each with multiple variants and states',
      'Designed the wallet and payments layer with transaction history (paginated, filterable), top-up flow (card/bank/UPI), and contact-support fallback. The premium subscription flow included plan comparison, upgrade confirmation, and cancellation with retention prompts',
      'Built complete auth flows (Login, Sign Up, Verification Code, Forgot Password, Reset Password) and a settings architecture (Personal Info, Saved Addresses with empty states, Notification Preferences, Subscription Status, Change Password, Profile Photo with crop)',
      'Designed support and error handling: Help & Support hub, live chat interface, delivery issue reporting, drone delivery failure error screens, delay notification patterns, and a notification modal system',
      'Delivered two Figma pages — a high-fidelity exploration page with all dashboard and component variants in both light and dark mode, and a structured Handoff page with annotated developer specifications',
    ],

    outcome: `Delivered a complete product design system spanning 94+ unique screens across three user portals, with full light and dark mode coverage, a 20+ component design system, and structured developer handoff specifications.

The 6-step booking flow handles 4 branching paths through a single progressive interface. The Tailwind-based component system enabled the frontend team to implement screens directly from design tokens, reducing interpretation gaps during handoff. The admin portal consolidates real-time drone tracking, fleet maintenance compliance, hub capacity management, and financial reconciliation into a single dashboard hierarchy — previously these existed as separate spreadsheets and manual processes. Merchant POS/ERP sync surfaced sync status, last-sync timestamps, and force-sync controls — addressing the operational anxiety merchants have about inventory accuracy.`,

    reception: `The sidebar hierarchy I proposed for each portal was adopted unchanged. In a 94-screen project, that's the single clearest signal the architecture worked.`,

    reflection: `FlySmart was the project that forced me to think in systems rather than screens. The component system wasn't a nice-to-have; it was the only way to stay sane and stay consistent.

The biggest lesson was about navigation architecture. Each portal's sidebar tells a different story about what matters: the customer sidebar leads with "Book a Drone Delivery" (action-first), the merchant sidebar leads with "Order Management" (operations-first), and the admin sidebar leads with "Drone Management" (infrastructure-first). Getting those hierarchies right was more important than any individual screen design.`,

    links: [],
  },

  // ─────────────────────────────────────────────────────────────

  {
    slug: 'pixel-pulse',
    number: '05',
    title: 'Pixel Pulse',
    tagline: `A brand identity system built to outlive its designer`,
    tags: ['Branding', 'Identity System', 'Print + Digital'],
    client: 'Pixel Pulse',
    year: '2025',
    location: 'Lagos, Nigeria',
    role: 'Brand Designer',
    timeline: '6 weeks',
    team: 'Creative Director, Copywriter',
    cover: 'https://framerusercontent.com/images/HdRijaIyFVF9IsZtaToNSjQZliE.png?width=904&height=1200',
    accent: '#F59E0B',
    accentSoft: '#FCD34D',

    hook: `Beautiful brand guidelines nobody uses are decorative. Templates are infrastructure.`,

    images: [
      'https://framerusercontent.com/images/HdRijaIyFVF9IsZtaToNSjQZliE.png?width=904&height=1200',
      'https://framerusercontent.com/images/WTC6bdSAQkSAhHIskIIMS6iac.jpg?width=3060&height=4080',
    ],

    metrics: [
      { value: '40+', label: 'Brand assets delivered' },
      { value: '6', label: 'Touchpoint categories' },
    ],

    outcomeStats: [
      { value: '40', suffix: '+', label: 'Individual brand assets delivered across 6 touchpoint categories' },
      { value: '3', label: 'Strategic brand directions developed — not visual variations, but distinct positioning stances' },
      { value: '4', label: 'Refinement rounds on the selected direction before final delivery' },
      { value: '8', label: 'Accent colours in extended palette — enough flexibility to shift tone without losing recognition' },
      { value: '40', label: 'Pages of brand guidelines — covering usage rules, do/don\'t examples, and tone-of-voice' },
      { value: '1', label: 'Template system that reduced the team\'s time-to-publish from hours to minutes' },
    ],

    deliverables: [
      'Primary logo system (mark, wordmark, icon, lockups)',
      'Primary + extended colour palette (8 accent colours)',
      'Typography system with hierarchy specifications',
      'Social media templates (IG grid, stories, carousels)',
      'Business document templates (proposals, invoices, letterhead)',
      'Digital templates (email signatures, slide decks)',
      'Environmental assets (event badges, wall signage)',
      '40-page brand guidelines document',
    ],

    overview: `Pixel Pulse is a creative collective based in Lagos, working across digital design, content production, and brand strategy. They approached me to build a cohesive brand identity system — they had talent and clients but no visual language that held together across touchpoints.

I led the brand design from discovery through final delivery, producing a complete identity system spanning logo, typography, colour, iconography, templates, and guidelines.`,

    challenge: `The challenges were both strategic and executional:

• Positioning ambiguity — Pixel Pulse operated across "creative agency," "content studio," and "strategy consultancy" territories. The brand needed to unify these without defaulting to a generic "we do everything" identity.

• Audience duality — the brand had to speak to two audiences: corporate clients (who need to see professionalism and reliability) and creative talent (who need to see taste and cultural relevance). These audiences respond to different visual signals.

• Lagos creative market saturation — the Lagos design scene is increasingly competitive. The identity needed to be distinctive enough to be remembered after a single encounter — a business card, an Instagram post, a proposal cover.

• System over logo — the founder explicitly didn't want "just a logo." They needed a system flexible enough to work across social media, proposal documents, event badges, merchandise, and environmental signage.`,

    pullQuote: `The most valuable deliverable wasn't the logo. It was a template system a non-designer can fill in and publish in 10 minutes.`,

    approach: [
      'Conducted a brand discovery workshop with the founding team — mapped values, audience segments, competitive positioning, and aspirational brands they admire and why',
      'Audited 20+ Lagos-based creative studios and agencies to identify visual territory that was already claimed versus whitespace opportunities',
      'Developed 3 strategic brand directions (not just visual variations — each represented a different positioning stance) and presented with rationale for why each would attract different client types',
      'Selected direction went through 4 refinement rounds: logo system (primary mark, wordmark, icon, lockup variants), then colour palette, then typography pairing, then application testing',
      'Built a flexible colour system with a primary palette (2 colours) and an extended palette (6 accent colours) that allows the brand to shift tone across contexts without losing recognition',
      'Designed template systems for: social media, business documents, digital assets, and environmental signage',
      'Delivered a 40-page brand guidelines document covering usage rules, spacing, colour specifications, do/don\'t examples, and tone-of-voice notes',
    ],

    outcome: `Delivered the complete brand identity system across 6 touchpoint categories with 40+ individual assets. The identity is now live across Pixel Pulse's social media, client proposals, and event materials.

Brand consistency across platforms — social media, proposals, and print materials now share a recognisable visual language for the first time. The template system reduced the team's time-to-publish for social content from hours to minutes, since layouts are pre-built and only require content swap. Client feedback cited the brand's "premium but approachable" positioning as a factor in choosing to work with Pixel Pulse over competitors. The extended colour system gave the team creative flexibility while the brand guidelines prevented drift.`,

    reception: `The templates I built saved the team hours per post. The team stopped asking "how should this look?" and started asking "which template do I use?" — which is the sign the system works.`,

    reflection: `Brand projects are where I learned that constraints create better work. The 6-week timeline forced disciplined decision-making — we couldn't afford to explore 10 directions. Three was the right number: enough choice to feel considered, few enough to compare meaningfully.`,

    links: [],
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)

export const getNextProject = (slug) => {
  const idx = projects.findIndex((p) => p.slug === slug)
  if (idx === -1) return projects[0]
  return projects[(idx + 1) % projects.length]
}
