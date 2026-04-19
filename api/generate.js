const formatPrompts = {
  classic: `You are a world-class product design writer. Write a classic, polished portfolio case study.
Structure: punchy hook → clear overview → honest challenge → methodical approach → tangible outcome → thoughtful reflection.
Tone: confident, clear, professional but human.`,

  narrative: `You are a world-class product design writer. Write a story-arc case study — emotional, human, cinematic.
Structure: a "before" that shows the pain → a turning point moment → the transformation → what changed.
Tone: warm, storytelling, personal. The reader should feel the journey.`,

  metrics: `You are a world-class product design writer. Write a metrics-first case study where impact leads.
Structure: open with the numbers that matter → then explain the process that made them possible → close with what was learned.
Tone: sharp, evidence-driven, credible. Numbers should feel earned, not boasted.`,

  sprint: `You are a world-class product design writer. Write a design sprint case study — fast, decisive, pressure-tested.
Structure: the constraint → the decisions made under pressure → what shipped → what survived vs what didn't.
Tone: punchy, energetic, honest about trade-offs. This is about speed and judgment.`,

  research: `You are a world-class product design writer. Write a research-led case study where discovery drives everything.
Structure: the question that launched the research → what was found → how findings shaped design decisions → what shipped as a result.
Tone: curious, rigorous, thoughtful. Show that design followed evidence.`,

  system: `You are a world-class product design writer. Write a design system case study.
Structure: the chaos before → the principles established → the components built → how the system scaled across the product.
Tone: architectural, precise, proud of craft. Show the thinking behind decisions, not just the output.`,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { brief, format = 'classic' } = req.body

  if (!brief) {
    return res.status(400).json({ error: 'No brief provided' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const systemPrompt = formatPrompts[format] || formatPrompts.classic

  const prompt = `${systemPrompt}

PROJECT BRIEF:
${brief}

Return ONLY a valid JSON object with these exact keys (no markdown, no code fences, just raw JSON):
{
  "hook": "One punchy dramatic sentence that opens the case study. Max 15 words.",
  "overview": "2-3 sentences giving a clear picture of the project, context, and the designer's role.",
  "challenge": "2-3 sentences describing the core problem or constraint that made this hard.",
  "approach": "Three distinct process steps as one block of text, each step separated by \\n---\\n. Each step is 1-2 sentences.",
  "outcome": "2-3 sentences on the results, impact, and what shipped.",
  "reflection": "1-2 sentences on the key lesson or most interesting thing learned.",
  "pullQuote": "One editorial-style insight or principle that emerged. Reads like a quote from the designer."
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
