// Clean accidental whitespace while preserving the writer's message formatting.
export function normalizeContact(value) {
  return {
    name: String(value.name || '').trim().replace(/\s+/g, ' '),
    email: String(value.email || '').trim(),
    message: String(value.message || '').trim(),
  }
}
