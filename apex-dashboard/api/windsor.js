// api/windsor.js
// Vercel serverless function — keeps WINDSOR_API_KEY server-side only
// Deploy env var: WINDSOR_API_KEY

export default async function handler(req, res) {
  // CORS headers (only needed for local dev; Vercel same-origin is fine in prod)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const apiKey = process.env.WINDSOR_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'WINDSOR_API_KEY not configured' })
  }

  // Forward all query params from the client, injecting the real API key
  const { connector = 'all', ...rest } = req.query
  const params = new URLSearchParams({ ...rest, api_key: apiKey })
  const upstream = `https://connectors.windsor.ai/${connector}?${params}`

  try {
    const upstream_res = await fetch(upstream)
    const data = await upstream_res.json()
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Windsor API error', detail: err.message })
  }
}
