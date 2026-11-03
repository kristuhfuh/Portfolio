export const escapeText = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export function safeLink(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  try { const url = new URL(text, 'https://portfolio.local'); return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? text : '' } catch { return '' }
}

export function sanitizeRichText(value) {
  if (typeof document === 'undefined') return escapeText(value)
  const input = document.createElement('template')
  input.innerHTML = String(value || '')
  const output = document.createElement('div')
  const allowed = new Set(['P','DIV','BR','STRONG','B','EM','I','U','S','H2','H3','UL','OL','LI','A','SPAN','BLOCKQUOTE','CODE'])
  const blocked = new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','MATH','TEMPLATE','NOSCRIPT'])
  function append(node, parent) {
    if (node.nodeType === 3) { parent.appendChild(document.createTextNode(node.textContent)); return }
    if (node.nodeType !== 1 || blocked.has(node.tagName)) return
    const target = allowed.has(node.tagName) ? document.createElement(node.tagName.toLowerCase()) : document.createDocumentFragment()
    if (node.tagName === 'A' && safeLink(node.getAttribute('href'))) { target.setAttribute('href', safeLink(node.getAttribute('href'))); target.setAttribute('rel','noopener noreferrer') }
    if (target.nodeType === 1) {
      const alignment = node.style?.textAlign
      if (['left','right','center','justify'].includes(alignment)) target.style.textAlign = alignment
      if (node.style?.fontWeight === 'bold' || /^\d00$/.test(node.style?.fontWeight || '')) target.style.fontWeight = node.style.fontWeight
      if (node.style?.fontStyle === 'italic') target.style.fontStyle = 'italic'
      if (['underline','line-through'].includes(node.style?.textDecorationLine)) target.style.textDecorationLine = node.style.textDecorationLine
    }
    [...node.childNodes].forEach(child => append(child, target))
    parent.appendChild(target)
  }
  [...input.content.childNodes].forEach(node => append(node, output))
  return output.innerHTML
}
