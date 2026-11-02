// Editorial summaries distilled from the existing authored case studies.
// These enrich the public presentation without overwriting CMS project records.
export const caseStudyNotes = {
  'landmark-citizen-app': {
    audience: 'Landmark guests, families, and the teams supporting their visits.',
    problem: 'The app could process a payment, but it did not help a family discover and plan a day at Landmark. Disconnected booking patterns, pickup queues, and inconsistent UI made the experience harder than it needed to be.',
    contribution: 'I led the v2 redesign and the LCA 3.0 design work: discovery and booking flows, food ordering, rewards, support, interface consistency, and the stakeholder prototype.',
    result: 'LCA 3.0 is designed and prototyped, with shared booking patterns and a consistent visual and content system. The 3.0 work is in stakeholder review.',
    evidence: 'The case draws on surveys, post-booking feedback, and customer-service reports. The 3.0 results describe design delivery; they are not post-launch usage or revenue measurements.',
    constraint: 'Keep one recognizable experience across food, activities, hotels, retail, and support while accounting for on-site realities such as unreliable QR codes.',
    strengths: ['Complex service journeys', 'Evidence-informed redesign', 'Systems thinking'],
  },
  'landmark-events': {
    audience: 'Guests buying tickets, organizers managing events, and staff handling admission.',
    problem: 'Ticket purchases, approvals, check-in, and reporting were fragmented across partially automated tools and manual work. The system supported transactions without supporting the whole event.',
    contribution: 'I designed the guest purchase experience, organizer onboarding and dashboard, event creation, ticket rules, access control, and event-day check-in flows.',
    result: 'The design connects the event lifecycle: discovery and checkout for guests, publishing and monitoring for organizers, and QR validation for staff.',
    evidence: 'The documented evidence is the designed workflows, dashboard structure, and handoff scope. Verified changes to attendance, revenue, and task completion are not included in this case study.',
    constraint: 'Support distinct guest and organizer needs while making event-day admission and financial visibility clear.',
    strengths: ['B2B and B2C workflows', 'Operational product design', 'Iteration and handoff'],
    decisions: [
      { chose: 'Separate guest and organizer journeys', over: 'One shared flow for every user', because: 'Buying a ticket and operating an event require different information, permissions, and navigation.' },
      { chose: 'Structured event creation with a review step', over: 'An unstructured configuration form', because: 'Ticket types, access rules, and publishing decisions need a clear sequence before an event goes public.' },
      { chose: 'Open, invite-only, and mixed access modes', over: 'Ad-hoc invite coordination', because: 'Organizers need explicit control over who can attend and how invitations and approvals work.' },
    ],
  },
  'we-are-wear': {
    audience: 'Shoppers discovering African fashion and designers selling through the marketplace.',
    problem: 'AI styling and circular fashion needed to fit naturally into shopping. Recommendations had to feel personal and useful, while features arriving in phases still needed a coherent experience.',
    contribution: 'I worked with the founder and engineers on the mobile experience, including the styling persona, digital closet, sustainability actions, feature waitlists, and post-purchase tracking.',
    result: 'The design brings styling, discovery, and the Restyle, Reuse, Retell framework into one experience, with a path for introducing more advanced features over time.',
    evidence: 'The case documents product decisions, feature design, and collaboration. Verified adoption, conversion, and sustainability-impact measurements are not included.',
    constraint: 'Work within a phased engineering rollout while making weather-based recommendations and sustainability actions understandable.',
    strengths: ['AI product experience', 'Phased product delivery', 'Founder and engineering collaboration'],
    decisions: [
      { chose: 'A named, illustrated stylist', over: 'Anonymous recommendation output', because: 'The styling experience needed a recognizable voice and a personal point of entry.' },
      { chose: 'Sustainability actions within the closet', over: 'A separate sustainability mode', because: 'Restyling and reuse need to be available where people already make wardrobe decisions.' },
      { chose: 'Waitlists for forthcoming features', over: 'Unusable feature screens', because: 'The phased rollout needed a clear way to communicate availability and capture interest.' },
    ],
  },
  flysmart: {
    audience: 'Customers booking deliveries, merchants fulfilling orders, and operations teams managing drones and hubs.',
    problem: 'Three user groups needed very different workflows, but the product still had to feel coherent. Booking, inventory, fleet status, and financial information each demanded a different hierarchy.',
    contribution: 'As the sole product designer, I owned information architecture, user flows, wireframes, high-fidelity interfaces, light and dark themes, the component system, and developer handoff.',
    result: 'I delivered 94+ screens across the three portals with a shared component system and annotated handoff. Each portal uses navigation organized around its users’ primary tasks.',
    evidence: 'Screen and component counts describe delivery scope. The team adopted the proposed navigation hierarchy; post-launch business and usability measurements are not included.',
    constraint: 'Deliver a complex multi-portal system in five months while supporting branching booking flows, operational data, and financial trust.',
    strengths: ['End-to-end ownership', 'Multi-role information architecture', 'Design systems and handoff'],
    decisions: [
      { chose: 'A task-led sidebar for each portal', over: 'Identical navigation for all users', because: 'Customers prioritize booking, merchants prioritize orders, and administrators prioritize infrastructure.' },
      { chose: 'A shared token-based component system', over: 'Designing each screen independently', because: 'The scale and two-theme requirement needed repeatable patterns that engineers could implement consistently.' },
      { chose: 'Visible inventory sync status and controls', over: 'Background-only synchronization', because: 'Merchants need to understand whether inventory is current and how to recover when it is not.' },
    ],
  },
  'pixel-pulse': {
    audience: 'Corporate clients evaluating the studio, creative talent, and the team producing everyday brand material.',
    problem: 'A multidisciplinary creative collective needed one recognizable identity across digital, print, and business communications, with enough flexibility to speak to different audiences.',
    contribution: 'I led discovery, explored three strategic directions, and developed the selected identity into a logo, colour and type system, templates, and usage guidelines.',
    result: 'The delivery included 40+ assets across six touchpoint categories and a template system the team can use without redesigning each piece of content.',
    evidence: 'The case describes delivered assets and their applications. A measured baseline for publishing time, brand recognition, or commercial impact is not provided.',
    constraint: 'Balance cultural relevance and professional credibility within a six-week engagement.',
    strengths: ['Brand strategy', 'Visual systems', 'Practical team enablement'],
    decisions: [
      { chose: 'Three distinct positioning directions', over: 'A large set of visual variations', because: 'The team needed to choose what the brand stood for before refining its appearance.' },
      { chose: 'A core and extended colour palette', over: 'One fixed expression for every context', because: 'Different applications needed flexibility while retaining a recognizable visual language.' },
      { chose: 'Reusable production templates', over: 'Guidelines as the only handoff', because: 'A system has to support the people making proposals, posts, and documents after the designer leaves.' },
    ],
  },
}

export const hasDraftText = value => /\[(?:PLACEHOLDER|Write\b|X\b|TBD\b)[^\]]*\]|\(TBD\)/i.test(String(value || ''))

export function getCaseStudyNotes(project) {
  const authored = caseStudyNotes[project.slug]
  const custom = project.recruiterSummary || {}
  const firstParagraph = value => String(value || '').replace(/<[^>]*>/g, ' ').split(/\n\n/).filter(p => !hasDraftText(p))[0] || ''
  return {
    audience: '',
    problem: firstParagraph(project.challenge),
    contribution: project.role || '',
    result: firstParagraph(project.outcome),
    evidence: project.statusNote || '',
    constraint: '',
    strengths: [],
    ...authored,
    ...custom,
  }
}
