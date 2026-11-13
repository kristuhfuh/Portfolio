import Field from './AdminField.jsx'

const inputClass = 'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#141414] outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10'
const textClass = `${inputClass} min-h-[110px] resize-y`

export const homepageSections = [
  { key: 'site', title: 'Navigation & footer', fields: [
    ['brand', 'Logo text'], ['workNav', 'Work menu label'], ['personNav', 'About menu label'], ['experienceNav', 'Experience menu label'], ['contactNav', 'Contact menu label'],
    ['backNav', 'Back link'], ['talkLabel', 'Email action'],
    ['copyrightName', 'Copyright name'], ['footerNote', 'Footer note'], ['footerWordmark', 'Large footer wordmark'], ['backToTop', 'Back to top label'],
    ['timeCity', 'Clock city'], ['timeZone', 'Clock time zone (IANA name)'],
  ] },
  { key: 'work', title: 'Selected work introduction', fields: [
    ['heading', 'Heading first line'], ['headingAccent', 'Heading accent line'],
    ['description', 'Description', true], ['countLabel', 'Project count label'], ['projectCta', 'Project card action'],
  ] },
  { key: 'marquee', title: 'Moving text', fields: [['playLabel', 'Play button label'], ['pauseLabel', 'Pause button label']], lists: [{ key: 'words', label: 'Phrases', itemLabel: 'Phrase', fields: [['value', 'Text']] }] },
  { key: 'statement', title: 'Point of view', fields: [
    ['heading', 'Main statement', true], ['signoff', 'Short signoff (one line per row)', true], ['description', 'Supporting text', true],
  ] },
  { key: 'otherDesignsIntro', title: 'Other designs introduction', fields: [
    ['heading', 'Heading'], ['cardCta', 'Design card action'],
  ] },
  { key: 'process', title: 'Process', fields: [['heading', 'Heading']], lists: [
    { key: 'steps', label: 'Process steps', itemLabel: 'Step', fields: [['title', 'Title'], ['description', 'Description', true]] },
  ] },
  { key: 'experience', title: 'Experience', fields: [['heading', 'Heading'], ['description', 'Introduction', true]], lists: [
    { key: 'jobs', label: 'Roles', itemLabel: 'Role', fields: [
      ['company', 'Company'], ['role', 'Job title'], ['employmentType', 'Employment type'], ['location', 'Location'],
      ['start', 'Start'], ['end', 'End'], ['description', 'Description', true],
    ] },
  ] },
  { key: 'aboutExtras', title: 'About details', fields: [
    ['making', 'Design and AI paragraph', true], ['kitLabel', 'Tools label'], ['recordLabel', 'Track record label'],
  ], lists: [
    { key: 'tools', label: 'Tools', itemLabel: 'Tool', fields: [['value', 'Name']] },
    { key: 'recognition', label: 'Track record points', itemLabel: 'Point', fields: [['value', 'Text', true]] },
  ] },
  { key: 'beyondIntro', title: 'Beyond the Pixels introduction', fields: [
    ['heading', 'Heading'], ['hoverHint', 'Desktop hint'], ['tapHint', 'Mobile hint'],
  ] },
  { key: 'galleryIntro', title: 'Visual gallery introduction', fields: [
    ['heading', 'Heading'], ['headingAccent', 'Heading accent'],
    ['description', 'Description', true], ['controlsLabel', 'Gallery instruction'], ['fallbackCaption', 'Caption when an image has none'],
  ] },
]

export function AdminHomepageFields({ section, value, onChange }) {
  const set = (key, next) => onChange({ ...value, [key]: next })
  return <>
    {(section.fields || []).map(([key, label, multiline]) => <Field key={key} label={label}>{multiline
      ? <textarea className={textClass} value={value[key] ?? ''} onChange={event => set(key, event.target.value)} />
      : <input className={inputClass} value={value[key] ?? ''} onChange={event => set(key, event.target.value)} />}
    </Field>)}
    {(section.lists || []).map(list => {
      const items = value[list.key] || []
      const simple = list.fields.length === 1 && list.fields[0][0] === 'value'
      const updateItems = next => set(list.key, next)
      const move = (index, direction) => {
        const next = [...items]
        ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
        updateItems(next)
      }
      return <div key={list.key} className="admin-content-list">
        <h3>{list.label}</h3>
        {items.map((item, index) => <div className="admin-content-item" key={`${list.key}-${index}`}>
          <div className="admin-content-item-heading"><span>{list.itemLabel} {index + 1}</span><div>
            <button type="button" aria-label={`Move ${list.itemLabel.toLowerCase()} ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button>
            <button type="button" aria-label={`Move ${list.itemLabel.toLowerCase()} ${index + 1} down`} disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button>
            <button type="button" onClick={() => updateItems(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
          </div></div>
          {list.fields.map(([key, label, multiline]) => <Field key={key} label={label}>{multiline
            ? <textarea className={textClass} value={simple ? item : item[key] ?? ''} onChange={event => updateItems(items.map((entry, itemIndex) => itemIndex === index ? (simple ? event.target.value : { ...entry, [key]: event.target.value }) : entry))} />
            : <input className={inputClass} value={simple ? item : item[key] ?? ''} onChange={event => updateItems(items.map((entry, itemIndex) => itemIndex === index ? (simple ? event.target.value : { ...entry, [key]: event.target.value }) : entry))} />}
          </Field>)}
        </div>)}
        <button type="button" className="admin-button" onClick={() => updateItems([...items, simple ? '' : Object.fromEntries(list.fields.map(([key]) => [key, '']))])}>+ Add {list.itemLabel.toLowerCase()}</button>
      </div>
    })}
  </>
}
