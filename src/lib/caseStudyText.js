import { hasDraftText } from '../data/caseStudyNotes.js'
import { sanitizeRichText } from './richText.js'

const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const inline = value => escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

// Support the existing rich-text CMS and the Markdown used by static case studies.
export function formatCaseStudyText(content = '') {
  if (!content) return ''
  if (/<[a-z][\s\S]*>/i.test(content)) return sanitizeRichText(content)
  const blocks = []
  let paragraph = [], list = []
  const flushParagraph = () => { if (paragraph.length) blocks.push(`<p>${paragraph.map(inline).join('<br>')}</p>`); paragraph = [] }
  const flushList = () => { if (list.length) blocks.push(`<ul>${list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`); list = [] }
  for (const line of String(content).split('\n')) {
    if (hasDraftText(line)) continue
    if (!line.trim()) { flushParagraph(); flushList(); continue }
    const bullet = line.match(/^\s*(?:•|-)\s+(.+)/)
    if (bullet) { flushParagraph(); list.push(bullet[1]); continue }
    flushList(); paragraph.push(line)
  }
  flushParagraph(); flushList()
  return blocks.join('')
}
