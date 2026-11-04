// Reviewed public copy for the imported versions of these case studies.
// CMS records stay intact. Later author edits are preserved field by field.
const reviewedCopy = {
  "landmark-events": {
    "overview": "Landmark's event operation extended beyond taking a payment. Ticket sales, RSVP approvals, attendance checks, and reporting were split between the platform and manual processes. Operations and marketing needed those activities to form one connected workflow.\n\nI designed the guest purchase journey, organizer onboarding, event creation, dashboard, access rules, and check-in experience. I worked with the product manager, developers, event operations, and marketing and sponsorship teams. All parts of the platform launched. This case documents the design, collaboration, and released capabilities; quantified business and usability results are not included.",
    "outcome": "The launched platform connects three parts of an event: buying a ticket, organizing the event, and admitting guests.\n\n**Guest purchase:** A six-step journey covers discovery, event details, ticket selection, guest assignment, payment, and confirmation. The design shows ticket prices before payment and a QR confirmation for each assigned guest.\n\n**Organizer workspace:** Four dashboard panels bring overview, sales monitoring, event management, and reporting into one workspace. Event duplication and exportable reporting are included in the design.\n\n**Setup and admission:** Four onboarding steps lead from account creation to dashboard access. Event creation includes a review before publishing, and Open, Invite-Only, and Mixed access modes make admission rules explicit. The check-in design accounts for QR validation and offline use.\n\nAll of these capabilities launched. Reduced onboarding time, fewer check-in errors, and increased revenue still require measured evidence.",
    "statusNote": "All parts of Landmark Events launched. The counts below describe released capabilities, rather than measured improvements in adoption, usability, attendance, or revenue.",
    "outcomeStats": [
      {
        "value": "6",
        "label": "Steps in the released guest purchase journey"
      },
      {
        "value": "4",
        "label": "Organizer dashboard panels released"
      },
      {
        "value": "4",
        "label": "Steps in organizer onboarding"
      },
      {
        "value": "3",
        "label": "Released access modes: Open, Invite-Only, and Mixed"
      },
      {
        "value": "1",
        "label": "Released QR check-in workflow with offline mode"
      }
    ],
    "challenge": "Payment was identified as a point of friction in the journey review; no quantified drop-off analysis is included in this case."
  },
  "landmark-citizen-app": {
    "principles": {
      "2": {
        "title": "Make destructive choices deliberate.",
        "body": "“Keep my account” receives primary emphasis to guard against accidental deletion. Intentional deletion must remain clearly labeled and easy to complete; that balance still needs validation."
      }
    },
    "decisions": [
      {
        "chose": "An \"Order received\" button",
        "over": "Pickup codes",
        "because": "The proposed flow removes a counter step. Staff can see the order, but that alone does not verify collection by the right guest. Recipient verification and accidental confirmation still need testing with guests and stall staff."
      },
      {
        "chose": "The safe action as the primary button",
        "over": "The requested action as primary",
        "because": "The intent is to prevent accidental cancellations and deletions. The destructive action remains labeled and available. Whether the emphasis obstructs an intentional deletion still needs testing."
      }
    ],
    "chapters": {
      "1": {
        "body": "The old flow ended with a queue and a pickup code. The new one asks one question: how do you want it?\n\n• **Pick up at the counter**, with a live status: placed, preparing, ready. A map and walking directions show where Stall 4 is.\n\n• **Deliver to my seat.** Scan the QR code on your table. No code, or it won't scan? Type the table number instead.\n\n• **Proposed collection confirmation.** An \"Order received\" button replaces the pickup code and opens the rating. Before release, the flow needs validation for recipient verification, accidental taps, and how stall staff handle disputes.\n\n• **Help goes to Landmark, not the stall.** The order screen offers \"Contact Landmark support\", never the vendor's phone number.\n\n• **The same pattern carries into retail,** with a \"Ready for pickup\" screen for Style Hub orders."
      }
    }
  }
}
const reviewedVersions = {
  "landmark-events": {
    "overview": [
      "3a9f9e8b"
    ],
    "outcome": [
      "7c678fbc",
      "26f2047d"
    ],
    "statusNote": [
      "811c9dc5"
    ],
    "outcomeStats": [
      "8803c3f3",
      "67af01c4"
    ],
    "challenge": [
      "4937b32a",
      "a459a71f"
    ]
  },
  "landmark-citizen-app": {
    "principles": [
      "f252bb0f",
      "437d50a3"
    ],
    "decisions": [
      "9ffa16c8",
      "15c79978",
      "33608e22"
    ],
    "chapters": [
      "8b909f2b",
      "513f4263"
    ]
  }
}

function fingerprint(value) {
  let hash = 2166136261
  for (const char of JSON.stringify(value) || '') hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16)
}

export function getReviewedProject(project) {
  const copy = reviewedCopy[project.slug]
  if (!copy) return project
  const result = { ...project }
  for (const [field, versions] of Object.entries(reviewedVersions[project.slug])) {
    const version = fingerprint(project[field])
    if (!versions.includes(version)) continue
    if (field === 'challenge') result[field] = project[field].replace('Drop-off was highest at the payment step.', copy.challenge)
    else if (field === 'chapters') result[field] = project[field].map((chapter, index) => index === 1 ? { ...chapter, body: copy[field][index].body } : chapter)
    else if (field === 'principles') result[field] = project[field].map((principle, index) => index === 2 ? { ...principle, ...copy[field][index] } : principle)
    else if (field === 'decisions') result[field] = project[field].map(decision => {
      const reviewed = copy[field].find(item => item.chose === decision.chose)
      return reviewed && ['An "Order received" button', 'The safe action as the primary button'].includes(decision.chose) ? { ...decision, because: reviewed.because } : decision
    })
    else result[field] = copy[field]
  }
  // Christopher confirmed Landmark project work began in 2025, and Events launched.
  const correctYear = value => {
    if (typeof value === 'string') return value.replaceAll('2024', '2025')
    if (Array.isArray(value)) return value.map(correctYear)
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, correctYear(item)]))
    return value
  }
  for (const field of ['year', 'timeline', 'overview', 'pullQuote', 'reflection', 'decisions']) {
    if (result[field]) result[field] = correctYear(result[field])
  }
  if (project.slug === 'landmark-events' && !project.status) result.status = 'Launched'
  return result
}
