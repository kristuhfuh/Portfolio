import { experience, tools, recognition } from './experience.js'

// The visible copy lives here so a fresh installation and an existing CMS
// installation render the same homepage before an editor changes anything.
export const homepageDefaults = {
  site: {
    brand: 'christopher',
    workNav: 'Work', personNav: 'The person', experienceNav: 'Experience', contactNav: 'Say hello',
    backNav: 'Back to the work', talkLabel: "Let's talk",
    copyrightName: 'Christopher Akpoguma', footerNote: 'Made with feeling, in Lagos.',
    footerWordmark: 'the design poet', backToTop: 'Back to top', timeCity: 'Lagos', timeZone: 'Africa/Lagos',
  },
  work: { heading: 'Thoughtfully made.', headingAccent: 'Impossible to ignore.',
    description: 'A few things I put my head,\nheart, and a lot of pixels into.',
    countLabel: 'selected projects', projectCta: 'Enter the project',
  },
  marquee: { words: ['A little more feeling.', 'A little less ordinary.', 'A lot more you.'], playLabel: 'Play moving text', pauseLabel: 'Pause moving text' },
  statement: {
    heading: 'Good design makes things work. Great design makes people feel seen.',
    signoff: 'Empathy first.\nExpression, always.',
    description: 'I bring thoughtful strategy and an expressive eye to digital products. Because useful can be beautiful. And beautiful should mean something.',
  },
  otherDesignsIntro: { heading: 'Other Designs.', cardCta: 'View design' },
  process: { heading: 'Feeling, meet thinking.',
    steps: [
      { title: 'Listen first.', description: "Before a single wireframe, I need to understand what problem we're actually solving. I interview, push back on assumptions, and sit with the data until the real question emerges - because building the wrong thing beautifully is still failure." },
      { title: 'Make it real, fast.', description: "I move from rough concepts to interactive Framer prototypes faster than most designers get to wireframes. You'll see something you can click and test - not a slide deck full of boxes - so we catch wrong turns early." },
      { title: 'Ship, then watch.', description: 'Handoff is not the finish line. I stay close through engineering, care about what actually ships, and track how real people use it. The most useful design insight usually comes the week after launch.' },
    ],
  },
  experience: { heading: "Where I've shown up.",
    description: 'Product design across real estate, SaaS, consumer apps, and government-facing platforms.',
    jobs: experience,
  },
  beyondIntro: { heading: 'Outside the work.', hoverHint: 'Hover to play', tapHint: 'Tap to play' },
  galleryIntro: { heading: 'A wandering', headingAccent: 'eye.',
    description: "Things I've made. Things I love.\nA little glimpse inside my head.",
    controlsLabel: 'Made to be explored. Pick a frame.',
    fallbackCaption: 'A moment in the collection',
  },
  aboutExtras: {
    making: "My practice also goes from design into making. I use AI to prototype ideas and build websites and web apps - including while redesigning LEMA, Landmark's Enterprise Management System.",
    kitLabel: 'The kit', tools, recordLabel: 'Track record', recognition,
  },
}
