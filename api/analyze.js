export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

  const prompt = `You are an expert hair stylist and face shape analyst. Analyze this person's face shape from the photo.

Respond ONLY with a valid JSON object in exactly this format (no markdown, no preamble):
{
  "faceShape": "Oval|Round|Square|Heart|Oblong|Diamond|Triangle",
  "confidence": "High|Medium",
  "reasoning": "2-3 sentences explaining the specific facial features that led to this determination — jawline width, forehead width, cheekbones, face length, chin shape.",
  "recommendedCuts": [
    {"name": "Cut name", "why": "One sentence why it works for this face shape"},
    {"name": "Cut name", "why": "One sentence why it works for this face shape"},
    {"name": "Cut name", "why": "One sentence why it works for this face shape"},
    {"name": "Cut name", "why": "One sentence why it works for this face shape"}
  ],
  "stylesAvoid": ["Style 1", "Style 2", "Style 3"]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'Anthropic API error' });

    const raw = data.content.map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
