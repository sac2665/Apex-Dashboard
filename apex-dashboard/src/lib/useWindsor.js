// src/lib/useWindsor.js
// Fetches data from our /api/windsor proxy (which holds the real API key)
// Falls back to static data if the API is unavailable

import { useState, useEffect } from 'react'

const BASE = '/api/windsor'

function buildUrl(connector, fields, datePreset, extraParams = {}) {
  const p = new URLSearchParams({
    connector,
    fields: fields.join(','),
    date_preset: datePreset,
    ...extraParams,
  })
  return `${BASE}?${p}`
}

// Generic fetcher with fallback
async function windsorFetch(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  // Windsor returns { data: [...] }
  return json.data ?? json
}

// ─── Individual data hooks ────────────────────────────────────────────────────

export function useShopify30d(fallback) {
  return useWindsorQuery(
    buildUrl('shopify', ['date', 'sessions', 'transactions', 'revenue'], 'last_30d', {
      filter: 'sales_channel==Skio',
    }),
    fallback
  )
}

export function useShopifyDaily(fallback) {
  return useWindsorQuery(
    buildUrl('shopify', ['date', 'transactions', 'revenue'], 'last_14d'),
    fallback
  )
}

export function useGA4Weekly(fallback) {
  return useWindsorQuery(
    buildUrl('google_analytics_4', ['date', 'users', 'new_users', 'sessions', 'engaged_sessions', 'engagement_rate', 'bounce_rate'], 'last_60d'),
    fallback
  )
}

export function useKlaviyo(fallback) {
  return useWindsorQuery(
    buildUrl('klaviyo', ['date', 'delivered', 'opens_unique', 'open_rate', 'clicks_unique', 'revenue', 'unsubscribes'], 'last_60d'),
    fallback
  )
}

// ─── Core hook ───────────────────────────────────────────────────────────────

function useWindsorQuery(url, fallback) {
  const [state, setState] = useState({ data: fallback, loading: true, live: false, error: null })

  useEffect(() => {
    let cancelled = false
    setState(s => ({ ...s, loading: true }))
    windsorFetch(url)
      .then(data => {
        if (!cancelled && data?.length) {
          setState({ data, loading: false, live: true, error: null })
        } else if (!cancelled) {
          // API returned empty — use fallback
          setState({ data: fallback, loading: false, live: false, error: 'no data' })
        }
      })
      .catch(err => {
        if (!cancelled) {
          setState({ data: fallback, loading: false, live: false, error: err.message })
        }
      })
    return () => { cancelled = true }
  }, [url])

  return state
}
