// ─────────────────────────────────────────────────────────────
// PROJECTS DATA — Story-driven case studies with outcome stats
// New fields: hook, pullQuote, outcomeStats[], deliverables[], reception
// ─────────────────────────────────────────────────────────────

export const projects = [
  {
    slug: 'landmark-citizen-app',
    number: '01',
    title: 'Landmark Citizen App',
    tagline: `Redesigning the complete ecosystem for West Africa's premium beachfront destination`,
    tags: ['Mobile App', 'UI Design', 'UX Research', 'Hospitality', 'Lifestyle'],
    client: 'Landmark Africa',
    year: '2024',
    location: 'Victoria Island, Lagos',
    role: 'UI/UX Designer',
    timeline: '6 weeks',
    team: 'Project Manager, Developer, 2 Data Analysts',
    cover: 'https://framerusercontent.com/images/A96w4ZpC5F1QA39OE7wySL4yBg4.webp?width=2400&height=1800',
    accent: '#FF8C42',
    accentSoft: '#FFB380',

    hook: `Make the complete ecosystem feel like one intuitive experience.`,

    images: [
      'https://framerusercontent.com/images/A96w4ZpC5F1QA39OE7wySL4yBg4.webp?width=2400&height=1800',
      'https://framerusercontent.com/images/3C0VOTTkKKwN2ontWnhZfDoAbzI.png?width=1722&height=2084',
      'https://framerusercontent.com/images/xn14raFI0MqgR8EHybMvOYUVY.png?width=1104&height=955',
    ],

    metrics: [
      { value: '6', label: 'Weeks to redesign' },
      { value: '3', label: 'Major user flows rebuilt' },
    ],

    outcomeStats: [
      { value: '8', label: 'Important features identified from research' },
      { value: '5', label: 'Optional enhancements added' },
      { value: '4', label: 'Core sections redesigned (Home, Events, Rewards, Onboarding)' },
      { value: '2', label: 'Iteration cycles from first draft to final' },
      { value: '3', label: 'Design improvements (Registration, Booking, UI modernization)' },
      { value: '1', label: 'Gamified rewards system introduced' },
    ],

    deliverables: [
      'Simplified registration and onboarding flow',
      'Redesigned booking flow with fewer steps',
      'Modernized home page with improved navigation',
      'Events page with search, categorization, and agenda view',
      'Gamified activity and rewards system',
      'Visual empty-state illustrations',
      'Push notification system',
      'Google Sign-In integration',
      'Cross-brand business promotion module',
      'Instagram promotional graphics and videos',
    ],

    overview: `Landmark Africa needed a system where transactions and bookings could be processed faster and automatically linked to the database, removing the need for manual collation and data entry. Hence, the Landmark Citizen App was introduced — a central hub designed to give customers access to all activities within the Landmark ecosystem, eliminating the need to visit different physical locations to complete transactions.

The app's activity rate peaked during the establishment of Landmark Beach, located in Victoria Island, Lagos, Nigeria. Through the app, users could purchase food and beverages, book events, reserve rooms and furniture, and engage with a range of activities within the Landmark community.

I redesigned the existing Landmark Citizen App, collected and studied data from past reviews and suggestions, made improvements, and added new features to make the app more user-friendly, intuitive, and easy on the eye. I worked in a team consisting of a project manager, a developer, and a couple of data analysts.`,

    challenge: `While the app's development brought about significant improvements and proved beneficial to the business, this was still the first version, and therefore, feedback was essential to understand how users felt about their experience.

From the feedback collected through user surveys, in-app forms, and customer service reports, several recurring pain points and improvement ideas emerged. These insights were categorised into important features/fixes and optional enhancements based on their impact on usability, customer experience, and business goals.

**Important Features Identified:**

• Simplify Registration Process — Users found the onboarding forms too long and discouraging.

• Redesign Booking Flow — The process felt confusing and required too many steps and transitions.

• Modernize The User Interface — Visuals felt outdated and inconsistent with Landmark's premium brand.

• Fix Receipt Printing Errors — Users frequently experienced issues with transaction receipts not generating properly.

• Clarify Empty-State Pages — Users were unsure why some pages had no content or what action to take next.

**Optional Enhancements:**

• Add Google Sign-In to allow quick and seamless access.

• Promote Other Company-Related Businesses within the app to improve cross-brand visibility.

• Gamify The App Experience to make usage more fun and engaging.

• Introduce Push Notifications to keep users informed about events, offers, and updates.`,

    pullQuote: `The biggest lesson: user feedback isn't just bug reports. It's a blueprint for what actually matters to people using your product every day.`,

    approach: [
      'Collected user feedback through email surveys, in-app forms presented at the end of each booking experience, and direct reports from Customer Service Representatives who interacted with customers on-site',
      'Analysed and categorised all responses into two groups: important features/fixes (impacting core usability) and optional enhancements (improving engagement and cross-sell)',
      'Held collaborative brainstorming sessions with the product team, designers, and developers to map ideas against user pain points and identify quick fixes versus long-term improvements',
      'Mapped out user journeys in detail from registration to booking and payment, ensuring each task was logical and efficient. Streamlined the booking flow with fewer screens and clearer CTAs, standardised navigation patterns, defined empty-state content and error messaging',
      'Modernised the visual direction to reflect Landmark\'s premium brand identity using a refined colour palette, improved typography, and polished iconography. Added interactive elements like micro-animations and hover states to enhance feedback and delight',
      'First iteration: Created draft with drawn illustrations, new opening and splash screens, changed font from Nunito to Plus Jakarta Sans for better mobile readability, improved colour contrast of text and icons for visibility',
      'Final iteration: Changed splash screen to more interactive style with full-screen images, switched to illustrations instead of actual photos to prevent future image rights issues',
    ],

    outcome: `The redesigned Landmark Citizen App delivered a modernised, user-friendly experience that addressed both critical usability issues and introduced engagement-boosting features.

**Home Page Redesign** improved user engagement and simplified access to key features through modernized branding, improved navigation, enhanced user flow, improved layout, and improved informative sections.

**Events Page Redesign** streamlined user experience and improved discoverability through a new search bar for finding events by name/date/category, categorisation into clear sections, modernised event cards with larger visually appealing images, and a new "Agenda" button for viewing event schedules.

**Activity and Rewards Redesign** transformed the app from a transactional platform into a gamified lifestyle companion. Users can now clearly see points, cashback, and reward progress in a visually engaging way with progress indicators and celebratory feedback. Coupons and benefits were reorganised into intuitive tabs (Active, Expired, Used), and features like cashback breakdowns and milestone incentives help users understand tangible benefits.

The final design represents continuous iterations with a focus on enhanced user flow, visual clarity, and brand consistency.`,

    reception: `The font change from Nunito to Plus Jakarta Sans and the shift to illustrated splash screens became standard design decisions for Landmark's subsequent mobile products.`,

    reflection: `This project taught me the value of user feedback as a design tool, not just a validation metric. The CSR reports and post-booking surveys gave us insights we couldn't have gotten from analytics alone — they showed us not just what users did, but why they struggled.

If I were to revisit this, I'd push for A/B testing on the rewards gamification earlier. We built the entire system based on research and best practices, but live testing with real transaction data would have validated (or challenged) our assumptions faster.`,

    link: null,
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

    outcomeStats: [
      { value: '3', label: 'User flows mapped (Guest, Organizer, Event Day)' },
      { value: '6', label: 'Steps in simplified guest ticket purchase flow' },
      { value: '4', label: 'Dashboard panels (Overview, Sales, Event Management, Reporting)' },
      { value: '4', label: 'Onboarding steps for organizers' },
      { value: '2', label: 'Major design iterations (first → final)' },
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

I designed and structured a scalable event ticketing and management system that supports both guests and organizers. The platform transforms how events are run — what was once just a transactional ticketing page has evolved into a fully integrated event infrastructure. It now functions as a revenue engine that optimizes pricing and sales, an access control system that governs entry with precision, an operational dashboard that provides live performance insights, and a reporting tool that gives stakeholders clarity and confidence.

This is no longer just about selling tickets. It's about powering the entire event ecosystem — before, during, and after the event.`,

    challenge: `From stakeholder interviews and system audits, we identified recurring operational friction points:

**Recurring Issues:**
• Ticket structuring
• Invite-only access
• Real-time visibility
• Payment flexibility
• Reporting transparency

All findings were categorized into core operational needs and scalable enhancements.

**Key Insights from Research:**
• Organizers need control without complexity
• Sponsors require measurable reporting
• Guests expect frictionless checkout
• Check-in must work offline
• Revenue visibility must be instant

**The Platform Had to Balance:**
• Simplicity for users
• Control for organizers
• Transparency for stakeholders`,

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

    outcome: `The final platform delivers a scalable event ticketing system with structured access control, real-time operational visibility, sponsor-ready analytics, seamless QR check-in, and a flexible ticket architecture designed to support events of any size.

But more importantly, it transforms how events are run. What was once just a transactional ticketing page has evolved into a fully integrated event infrastructure — a revenue engine that optimizes pricing and sales, an access control system that governs entry with precision, an operational dashboard that provides live performance insights, and a reporting tool that gives stakeholders clarity and confidence.

This is no longer just about selling tickets. It's about powering the entire event ecosystem — before, during, and after the event.

**Organiser Dashboard System** became the operational command centre:
• **Overview Panel** provided a snapshot of performance, highlighting active and past events alongside total revenue and tickets sold. This gave organizers immediate visibility into event activity and financial outcomes
• **Sales Monitoring** section delivered real-time insights into sales trends, revenue breakdown, and order status — enabling organizers to track performance and make informed decisions quickly
• **Event Management** allowed organizers to edit existing events, duplicate events for faster iteration, and manage access types seamlessly. Organizers could create, edit, and cancel events across the entire event lifecycle
• **Reporting** section provided insights into attendance rates and sponsor performance breakdowns, with exportable data for reconciliation and post-event analysis

**Organizer Onboarding** was designed to reduce setup friction while ensuring system integrity:
• **4-Step Flow:** Create Account → Business Details → Payment Setup → Dashboard Access
• Quick account registration with email verification
• Business and brand information capture
• Bank details submission for payout processing
• Instant access to the organiser dashboard (no manual approval bottlenecks)

**Improved Ticket Purchase Flow:**
• Discovery → Event Detail → Select Ticket Type → Assign Ticket Holder → Payment → Confirmation
• Key improvements include: Multiple ticket tier selection (General, VIP, Group, etc.), Clear pricing breakdown before payment, Ability to assign each ticket to a specific attendee during checkout, Unique QR code generated per assigned guest, Instant confirmation and downloadable ticket

**Ticket Access Control:**
Different access control setups were created for organizers to add to specific tickets. The setup let organizer create special links for these individuals which can be sent directly to them while the organizers have to power to approve manually or automatically`,

    reception: null,

    reflection: `The biggest lesson was understanding that B2B and B2C flows can coexist in the same platform without compromising either — but only if you design them as separate products from the start, not as variations of the same flow. The structured event creation flow and modular dashboard architecture became repeatable patterns we applied to other Landmark ecosystem tools.`,

    link: null,
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

    outcomeStats: [
      { value: '1', label: 'Personal AI stylist with persona illustration' },
      { value: '3', label: 'Styling types supported (Traditional, 90s, Romantic)' },
      { value: '3', label: 'RF features (Restyle, Reuse, Retell)' },
      { value: '2', label: 'Delivery tracking channels (WhatsApp, Email)' },
      { value: '1', label: 'Carbon calculator integration for sustainability' },
      { value: '60', suffix: '+', label: 'Screens across discovery, styling, and checkout' },
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
      'Integrated delivery tracking into payment success screen with both WhatsApp and email options — giving users multiple channels to monitor their orders post-purchase',
      'Collaborated with engineering team to integrate working carbon calculator demo — showing environmental impact of fashion choices to reinforce sustainability without being preachy',
      'Ensured 3RF buttons were prominent on each item in the styling feed — making circular fashion actions as easy as adding to cart',
    ],

    outcome: `Delivered a complete AI-powered styling experience that goes beyond conventional fashion e-commerce.

**Personal AI Styling System** launched with weather-responsive fabric recommendations, event-based outfit suggestions, and style type filtering. The AI stylist persona (with name and illustration) transformed abstract recommendations into conversational guidance that users actually engaged with.

**Digital Closet View** was designed as a familiar feed interface with search functionality, but each fashion item featured the 3RF buttons — making sustainable fashion actions (Restyle, Reuse, Retell) as frictionless as browsing. This design decision meant circular fashion wasn't buried in settings; it was part of the core experience.

**Multi-Channel Delivery Tracking** via WhatsApp and email addressed the African e-commerce reality where email alone isn't reliable. Adding WhatsApp tracking to the payment success screen reduced "where's my order" support queries.

**Carbon Calculator Integration** showed environmental impact without preaching. The working demo was integrated seamlessly, allowing users to see the sustainability impact of their choices in real-time.

**Join Waitlist Features** for advanced styling kept users engaged during phased rollout. Email sign-up pop-ups allowed us to track demand and notify users when new AI capabilities went live.`,

    reception: `The AI stylist persona — giving it a name and face — was initially debated, but became the feature users referenced most in testing. "Ask [name]" became shorthand for using the styling recommendations.`,

    reflection: `This project taught me that AI features need personality to feel trustworthy. The difference between "algorithm suggests outfit" and "your stylist recommends this look" is the difference between a tool and a companion.

The 3RF integration showed me that sustainability features work best when they're built into the core experience, not added as a separate "eco mode." Making circular fashion easy is better than making it virtuous.

If I were to revisit this, I'd push harder on the carbon calculator UI earlier in the process. The functionality was ready, but we integrated it late — it deserved to be more prominent from day one, not an afterthought feature.

Working collaboratively with Salem, Umaru TOBI, and the team taught me the value of iterative design feedback — the "Vogue text" discussion and styling screen debates made the final product stronger because we challenged each other's assumptions.`,

    link: null,
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

    outcomeStats: [
      { value: '94', suffix: '+', label: 'Unique screens across 3 portals' },
      { value: '3', label: 'Distinct user portals (Customer, Merchant, Admin)' },
      { value: '20', suffix: '+', label: 'Component sets in design system' },
      { value: '6', label: 'Steps in core booking flow' },
      { value: '4', label: 'Branching paths in booking logic' },
      { value: '2', label: 'Themes — light & dark across everything' },
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

    challenge: `This was one of the most structurally complex projects I\'ve worked on. The challenges were layered:

• Three distinct user mental models in one product — Customers think in terms of "I need to send a package." Merchants think in terms of "I need to fulfil orders and track inventory." Admins think in terms of "I need to manage drones, hubs, and system health." Each portal needed its own navigation hierarchy, dashboard priorities, and task flows — but they all had to feel like the same product.

• A 6-step booking flow that couldn\'t afford friction — the core customer journey had to handle branching logic without the user feeling lost in a wizard. Every additional step is a drop-off risk.

• Real-time operational complexity — the admin portal needed a real-time map for live drone tracking, a drone management dashboard showing fleet status, a maintenance log for compliance, hub management for physical locations, and trip management for active deliveries. These are data-dense, operationally critical screens where a wrong reading has real consequences.

• Financial trust layer — the platform includes a wallet system with top-up flows, transaction history, and a premium subscription tier (₦4,999/month) with a loyalty points engine. Users need to trust the payment system enough to pre-load money into a wallet for a service category (drone delivery) that\'s still novel in the market.

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

    reflection: `FlySmart was the project that forced me to think in systems rather than screens. The component system wasn\'t a nice-to-have; it was the only way to stay sane and stay consistent.

The biggest lesson was about navigation architecture. Each portal\'s sidebar tells a different story about what matters: the customer sidebar leads with "Book a Drone Delivery" (action-first), the merchant sidebar leads with "Order Management" (operations-first), and the admin sidebar leads with "Drone Management" (infrastructure-first). Getting those hierarchies right was more important than any individual screen design.`,

    link: null,
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
      { value: '40', suffix: '+', label: 'Individual brand assets delivered' },
      { value: '6', label: 'Touchpoint categories covered' },
      { value: '3', label: 'Strategic directions explored' },
      { value: '4', label: 'Refinement rounds on selected direction' },
      { value: '8', label: 'Accent colours in extended palette' },
      { value: '40', label: 'Pages of brand guidelines documented' },
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

• System over logo — the founder explicitly didn\'t want "just a logo." They needed a system flexible enough to work across social media, proposal documents, event badges, merchandise, and environmental signage.`,

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

    outcome: `Delivered the complete brand identity system across 6 touchpoint categories with 40+ individual assets. The identity is now live across Pixel Pulse\'s social media, client proposals, and event materials.

Brand consistency across platforms — social media, proposals, and print materials now share a recognisable visual language for the first time. The template system reduced the team\'s time-to-publish for social content from hours to minutes, since layouts are pre-built and only require content swap. Client feedback cited the brand\'s "premium but approachable" positioning as a factor in choosing to work with Pixel Pulse over competitors. The extended colour system gave the team creative flexibility while the brand guidelines prevented drift.`,

    reception: `The templates I built saved the team hours per post. The team stopped asking "how should this look?" and started asking "which template do I use?" — which is the sign the system works.`,

    reflection: `Brand projects are where I learned that constraints create better work. The 6-week timeline forced disciplined decision-making — we couldn\'t afford to explore 10 directions. Three was the right number: enough choice to feel considered, few enough to compare meaningfully.`,

    link: null,
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)

export const getNextProject = (slug) => {
  const idx = projects.findIndex((p) => p.slug === slug)
  if (idx === -1) return projects[0]
  return projects[(idx + 1) % projects.length]
}
