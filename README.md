# Christopher Akpoguma — Portfolio

A React portfolio built with Vite, Tailwind CSS, React Router, and Framer Motion. Editorial aesthetic — Fraunces serif display + Inter Tight body + JetBrains Mono labels — with purple as a single sharp accent. Light/dark mode, case study routing, animated transitions.

## Getting started

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:5173`.

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/        # Nav, Hero, Work, Experience, About, Contact, Footer, etc.
├── pages/
│   ├── Home.jsx       # Composes all home sections
│   └── CaseStudy.jsx  # Dynamic case study page (/work/:slug)
├── data/
│   ├── projects.js    # ← edit project content + metrics here
│   └── experience.js  # ← edit jobs, tools, track record here
├── lib/
│   └── theme.jsx      # Light/dark mode
├── App.jsx
├── main.jsx
└── index.css          # Tailwind + custom typography utilities
```

## The content you must write

The design is ready. The content isn't. Specifically:

1. **`src/data/projects.js`** — Three projects (We Are Wear, Flysmart, Pixel Pulse) have placeholder text marked `[Write ...]`. Fill these in. Also replace any `(TBD)` metrics with real numbers. Metrics are what make the portfolio work.
2. **`src/data/experience.js`** — Descriptions are drafted but generic; make them specific to what you actually shipped at each company.
3. **`src/components/About.jsx`** — Bio reads well but it's mine, not yours. Rewrite in your voice.
4. **Contact links in `src/components/Contact.jsx`** — Replace placeholder handles with your real LinkedIn, Twitter/X, Dribbble URLs.
5. **Email** — Replace `hello@kristuhfuh.com` with your real email (appears in Nav and Contact).
6. **Resume** — Drop your CV at `public/resume.pdf` so the "Download CV" button works.
7. **Favicon** — `public/favicon.svg` is a simple monogram placeholder. Swap if desired.

## Deploying to Vercel

### Option 1 — via GitHub (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), click **New Project**, import the repo.
3. Vercel auto-detects Vite. Defaults are correct:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.

`vercel.json` already handles SPA routing so case study URLs resolve correctly on direct load and refresh.

### Option 2 — via CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. For production: `vercel --prod`.

### Custom domain

In Vercel: Project → Settings → Domains. Add your domain and follow the DNS instructions.

## Design notes

- **Colors**: Cream (#F5F3EE) + near-black ink + single purple accent (#6D28D9). No purple gradients — accent is used sparingly to create hierarchy, not decoration. Dark mode swaps to a true black background.
- **Typography**: Fraunces is the display serif, chosen for its optical sizing and personality. Inter Tight is body, tighter than default Inter. JetBrains Mono handles labels and numerical data. All loaded from Google Fonts in `index.html`.
- **Motion**: Framer Motion handles entrance animations (staggered fade-up on scroll). The marquee scrolls on CSS animation. Hover states use CSS transitions. Page transitions are scroll-reset on route change.
- **Grain**: A subtle SVG noise texture is overlaid site-wide via `.grain` — it gives the page an editorial print feel. Adjust opacity in `src/index.css` if too subtle or too strong.
- **Layout**: 1400px max-width container. 12-column grid for content-heavy sections. Generous vertical rhythm — don't compress the padding; the breathing room is deliberate.

## What still needs fixing (content, not code)

The biggest wins for your portfolio aren't in the code. In order of impact:

1. Write the three missing case studies with real metrics.
2. Quantify the two Landmark projects — the numbers I put in are plausible placeholders; swap for real ones.
3. Get one testimonial from a client or manager. Drop it into the About section as a pull quote.
4. Decide on your primary positioning. The site currently leads with "Product Designer" and treats Framer as a specialty. If you want Framer Developer to be primary, swap the order in `Hero.jsx`.

## License

Design and code © Christopher Akpoguma. Built as a bespoke portfolio — not licensed as a template.
