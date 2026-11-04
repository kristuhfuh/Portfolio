// Separate the source, design decision, and remaining validation.
export const caseStudyEvidence = {
  'landmark-citizen-app': [
    {
      title: 'Food collection and table delivery',
      evidence: 'The existing journey ended at a counter with a pickup code. Table delivery also needed a fallback when a QR sticker was damaged or unreadable.',
      decision: 'I designed table-number entry alongside QR scanning and proposed an “Order received” action for collection.',
      validation: 'The prototype demonstrates the proposed paths. Testing with guests and stall staff still needs to establish recipient verification, accidental confirmations, and dispute handling before the pickup-code change can be considered validated.',
    },
    {
      title: 'Intentional account deletion',
      evidence: 'The design gives “Keep my account” primary emphasis and presents “Delete my account” as a labeled destructive option.',
      decision: 'The intent is to guard against accidental deletion while keeping deliberate deletion available.',
      validation: 'A test should ask people to both cancel and complete deletion. Completion, hesitation, and wrong selections would show whether the emphasis protects people or obstructs their choice. No such result is claimed here.',
    },
  ],
  'landmark-events': [
    {
      title: 'From manual coordination to explicit rules',
      evidence: 'The documented stakeholder review described invitation lists and access decisions being coordinated through spreadsheets and WhatsApp.',
      decision: 'I designed Open, Invite-Only, and Mixed admission modes, with configuration reviewed before publishing.',
      validation: 'These admission modes launched. The case does not include measured check-in success, exception-handling results, or a before/after count of manual work.',
    },
    {
      title: 'An organizer workspace beyond ticket sales',
      evidence: 'The operations review described sales, attendance, and reporting as disconnected activities.',
      decision: 'I grouped overview, sales monitoring, event management, and reporting into four dashboard panels.',
      validation: 'All four panels launched. They demonstrate the delivered information architecture; faster reconciliation or better organizer decisions have not been measured in this case.',
    },
  ],
  lema: [
    {
      title: 'One place for row actions',
      evidence: 'Implementation review showed three or four inline actions competing with employee information.',
      decision: 'I built one contextual action menu per row, accepting an extra step to reveal an action in exchange for a clearer table scan.',
      validation: 'The before/after implementation confirms the interface change. Action-discovery success and task completion time still need user testing.',
    },
    {
      title: 'Resolve causes instead of repeated blockers',
      evidence: 'An example appraisal run displayed 290 blocker rows, with repeated issues obscuring the underlying causes.',
      decision: 'I grouped those blockers into two issue categories so HR can work through the causes.',
      validation: 'The grouping is observable in the development build. It does not establish a reduction in publishing time or HR errors; the redesign remains in development and testing.',
    },
  ],
}
