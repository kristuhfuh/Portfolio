// Authored from Christopher's LEMA redesign report. This is development/testing
// evidence; no production adoption, task-time, or business-impact claims are made.
export const lemaProject = {
  slug: 'lema',
  number: '02',
  title: 'LEMA /admin',
  tagline: 'Redesigning — and building — the everyday tools behind Landmark Africa.',
  tags: ['Enterprise UX', 'AI-assisted building', 'Workflow design', 'Web App'],
  client: 'Landmark Africa',
  year: 'In development',
  role: 'Product designer & AI-assisted builder',
  timeline: '12 weeks of iteration',
  team: '',
  location: '',
  status: 'In development and testing',
  cover: '/images/lema/cover.svg',
  accent: '#6535C5',
  accentSoft: '#D8C2F7',
  hook: 'The data already supported the work. The interface needed to catch up.',
  recruiterSummary: {
    audience: 'Landmark Africa staff and the HR, Finance, Property, Attendance, Performance, IT Support, and Hiring teams using /admin.',
    problem: 'LEMA worked like a database interface: sprawling tables, competing row actions, ambiguous account states, and workflows that made routine tasks harder than they needed to be.',
    contribution: 'I redesigned the /admin experience and used AI to build the redesign. I worked across visual hierarchy, information architecture, microcopy, employee search, performance workflows, attendance scheduling, and implementation failure paths.',
    result: 'A working redesign is in development and testing. It introduces a shared content frame, clearer employee profiles, grouped publishing blockers, searchable employee selection, and three role-specific shift-management surfaces.',
    constraint: 'Keep the existing data model, authentication, and permissions intact. Improve the interface and workflows people use every day.',
    evidence: 'The before/after comparisons come from implementation observations and an internal heuristic critique. Production task times, error rates, adoption, and business impact remain to be measured.',
    strengths: ['Enterprise workflow design', 'Design-to-code ownership', 'AI-assisted implementation', 'Role-aware systems thinking'],
  },
  overview: `LEMA is Landmark Africa's Enterprise Management System. Its /admin panel supported a broad set of internal operations, but the interface largely reflected the defaults of its Filament framework: dense tables, flat detail pages, framework language, and little containment on large screens.

I redesigned that experience and built my redesign with AI over twelve weeks of iteration. This gave me ownership of both the design decisions and their implementation — including what happens when a form binding fails or a loading state never appears.

The brief had a clear boundary: preserve the existing data model, authentication, and permissions. The work is currently in development and testing.`,
  challenge: `The recurring problem was the distance between what the system could store and what people could actually do with it.

• **Scanning required too much work.** Employee tables stretched across very wide screens. Column headings overlapped, row actions clipped, and four coloured buttons competed with the employee information itself.
• **People were presented as metadata.** Employee detail pages opened with a flat list. Two separate account-state booleans left the reader to work out whether someone could sign in.
• **Routine workflows had gaps.** Leave requests did not require hand-over notes. Performance publishing exposed hundreds of repeated blockers instead of helping HR resolve the underlying problems.
• **The attendance model did not match the organization.** Staff in rotating roles and staff with standard office hours were treated as if everyone worked 08:00–17:00.
• **Finding a colleague meant navigating a 500-person select.** The picker supported little beyond jumping to the first letter.

The redesign needed to make these workflows understandable while respecting the system's existing access rules and technical foundation.`,
  pullQuote: 'The data model was never the blocker. What was missing was the interface that let people use it.',
  principles: [
    { title: 'Lead with the person.', body: 'Names, role, department, and plain-English account state establish context before detailed metadata.' },
    { title: 'Make the next step clear.', body: 'Labels such as “Next: Hand-over notes” and “Send to EXCO and HR” explain the action and its destination.' },
    { title: 'Make rules reusable.', body: 'Shared content framing, table behaviour, pagination, search, and loading patterns should carry across the panel.' },
  ],
  chapters: [
    {
      number: '01', title: 'Give the everyday scan a clear hierarchy.',
      body: `I established a bounded content frame across /admin: a bordered white surface, a consistent radius, and 24–32px of internal space. Tables then had a predictable canvas instead of expanding indefinitely across the viewport.

I fixed column layout and reserved space for selection and actions. Row actions moved into a single contextual menu, with Approve and Reject available only when the record was pending. This trades immediate visibility of every action for a calmer primary scan.

Employee detail pages now lead with a profile strip: name, role, department, and a plain-English state such as “Active · can sign in.” Identity, Organisation, Access, and Activity form four smaller groups below it.

The directory uses exception dots and a quick-filter legend with live counts. I also rewrote framework language: “Direct Permissions” became “Extra access”; “Last Login” became “Last sign-in”; “Add New Staff” became “Add staff.”`,
      image: '/images/lema/hierarchy.svg',
      caption: 'Structure diagram: from a flat metadata list to a profile-led employee page.',
    },
    {
      number: '02', title: 'Redesign the workflow behind the screen.',
      body: `Leave requests now include mandatory hand-over notes before the sent confirmation. The interface asks for continuity of work at the moment someone requests time away.

Self-assessment became a two-step flow: KPI results, then behaviour ratings. Inline 1–5 controls match the manager's appraisal interface.

Manager appraisals now route to EXCO and HR in parallel, removing the HR relay from that route. Publishing blockers are grouped by issue, with counts, sample names, and a route to Appraisal progress. In the documented 145-person cycle example, a 290-row blocker list became two issue cards.

IT support reporting became four numbered sections with urgency choices and a searchable employee picker for raising an issue on someone else's behalf.`,
      image: '/images/lema/workflow.svg',
      caption: 'Workflow diagram: the appraisal routing change and the hand-over step introduced for leave requests.',
    },
    {
      number: '03', title: 'Put shift decisions with the people who know the work.',
      body: `The existing HrShift and HrShiftRoster models could represent variable shifts. The interface had never exposed that capability properly. I designed and built three connected surfaces:

• **HR — Shift library:** reusable, department-scoped shift templates.
• **Manager — Team shifts:** a weekly grid of direct reports. Rotating staff receive per-day shift choices; standard-hours staff retain their normal pattern. Past dates are locked.
• **Employee — My schedule:** a read-only view of today and the next seven days, with the source of each shift explained in plain English.

HR and Super Admin can view the broader staff list with search, department filters, and a rotating-staff toggle. The manager makes the operational scheduling decision, while the employee can see where it came from.`,
      image: '/images/lema/shifts.svg',
      caption: 'Role and responsibility diagram for the three shift-management surfaces.',
    },
    {
      number: '04', title: 'Build the paths that keep the experience dependable.',
      body: `I used AI to build the redesigned interface within the existing application foundation. Implementation details mattered when they affected whether a person could finish a task.

The employee picker now matches substrings in names and email addresses, with a 300ms debounce. Its results render outside clipped parent containers, so a menu can remain visible inside the new content frames.

Critical forms — leave requests, IT support, and point logs — have native CSRF-protected POST fallbacks when Livewire does not bind in a user's browser. Notifications read real records, “Mark all read” performs the action, and shared skeletons and progress feedback acknowledge loading.

I also standardized pagination and corrected sticky detail rails so they clear the topbar. These are part of the same design responsibility: make the interaction work beyond the ideal path.`,
      image: '/images/lema/reliability.svg',
      caption: 'Implementation diagram: interactive form submission with a native POST fallback and visible progress feedback.',
    },
  ],
  decisions: [
    { chose: 'Redesign within the existing system', over: 'Replace the underlying data and access model', because: 'The existing models already represented important operational rules. The brief was to make that capability usable without changing authentication or permissions.' },
    { chose: 'One contextual action menu per row', over: 'Three or four competing inline buttons', because: 'The table should lead with the record. The trade-off is an extra step to reveal an action, balanced against a clearer scan and a consistent action location.' },
    { chose: 'Grouped publishing blockers', over: 'One row for every employee–problem pair', because: 'HR needs to resolve a type of issue. Repeating it for every employee hides the next useful action.' },
    { chose: 'Role-specific shift surfaces', over: 'One schedule editor for everyone', because: 'HR defines reusable templates, managers know operational staffing needs, and employees need a trustworthy view of their own schedule.' },
    { chose: 'Containment and truncation for dense tables', over: 'Default horizontal scrolling', because: 'The primary table and actions need to fit the frame. Testing must also check whether people can reliably discover the complete values behind truncated cells.' },
  ],
  comparisons: [
    { label: 'Row actions', before: '3–4 inline buttons', after: '1 contextual menu', note: 'Implementation comparison. Available actions still follow record state and visibility rules.' },
    { label: 'Appraisal publishing blockers', before: '290 repeated rows', after: '2 issue cards', note: 'The documented example cycle contains 145 employees with 0 appraisals published. This describes the presentation of blockers.' },
    { label: 'Employee selection', before: '500-option native select', after: 'Substring search', note: 'The report demonstrates matches after 2–3 keystrokes. Completion time and search success need user testing.' },
    { label: 'Employees-directory critique', before: '21 / 40', after: '27 / 40', note: 'Internal design-health score from a /critique review of the directory. Evidence type: heuristic assessment.' },
  ],
  images: [],
  metrics: [{ value: '12', label: 'Weeks of iteration' }, { value: '7', label: 'Operational areas' }],
  outcomeStats: [],
  deliverables: [
    'A shared /admin content frame, table patterns, pagination, and loading feedback',
    'Profile-led employee details and plain-English account states',
    'Contextual row actions and directory quick filters',
    'Reusable searchable employee selection',
    'Reworked leave, self-assessment, appraisal routing, and publishing flows',
    'Shift library, Team shifts, and My schedule',
    'Real notification behaviour and native POST fallbacks for critical forms',
  ],
  approach: [],
  outcome: `The redesign is built and currently in development and testing. It changes how the interface presents information and how people move through core tasks while retaining the existing data, authentication, and permission foundation.

The implementation comparisons show a clearer action hierarchy, grouped appraisal blockers, searchable employee selection, and newly exposed shift-management capabilities. The internal critique score for the Employees directory moved from 21/40 to 27/40.

These are implementation observations and a heuristic review. Production adoption, task completion time, error rates, and business outcomes remain unmeasured. The next evaluation should follow real staff through finding a colleague, submitting leave with hand-over notes, resolving an appraisal blocker, and assigning a rotating shift.`,
  statusNote: 'In development and testing. Before/after counts describe interface structure; the design-health score is an internal heuristic assessment.',
  reception: '',
  reflection: `The strongest lesson was that the existing data model already held more capability than the interface exposed. Designing the three shift surfaces made that gap concrete: useful scheduling rules were present, but people had no practical way to work with them.

Building the redesign with AI connected visual decisions to implementation consequences. Containment, contextual actions, failure paths, and loading feedback all needed to survive the real application environment.

I would carry the shared patterns forward and test the trade-offs deliberately: discoverability of row actions, complete values behind truncated cells, clarity of status signals, and real task completion across the different staff roles.`,
  links: [],
}
