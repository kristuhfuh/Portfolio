export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { brief } = req.body

  if (!brief) {
    return res.status(400).json({ error: 'No brief provided' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const prompt = `You are a world-class product design writer. Given a project brief, generate compelling case study copy for a designer's portfolio.

PROJECT BRIEF:
${brief}

Return ONLY a valid JSON object with these exact keys (no markdown, no code blocks, just raw JSON):
{
  "hook": "One punchy dramatic sentence that opens the case study. Max 15 words.",
  "overview": "2-3 sentences giving a clear picture of the project, the context, and the designer's role.",
  "challenge": "2-3 sentences describing the core problem or constraint that made this project hard.",
  "approach": "Three distinct process steps separated by \\n---\\n. Each step is 1-2 sentences describing what was done and why.",
  "outcome": "2-3 sentences on the results, impact, and what shipped.",
  "reflection": "1-2 sentences on the key lesson or most interesting thing learned.",
  "pullQuote": "One editorial-style insight or principle that emerged from the work. Reads like a quote from the designer."
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(500).json({ error: `Claude API error: ${err}` })
    }

    const data = await response.json()
    const text = data.content[0].text.trim()

    let generated
    try {
      generated = JSON.parse(text)
    } catch {
      return res.status(500).json({ error: 'Failed to parse Claude response', raw: text })
    }

    return res.status(200).json(generated)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
