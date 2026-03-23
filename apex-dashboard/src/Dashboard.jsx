import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart,
} from 'recharts'
import {
  shopify30d as FB_shopify30d,
  subscribers as FB_subscribers,
  skioWeekly as FB_skioWeekly,
  ga4Weekly as FB_ga4Weekly,
  klaviyoWeekly as FB_klaviyoWeekly,
  lastCampaign as FB_lastCampaign,
  dailyData as FB_dailyData,
} from './lib/fallbackData.js'
import { useGA4Weekly, useKlaviyo, useShopifyDaily } from './lib/useWindsor.js'

// ─── Colour tokens ─────────────────────────────────────────────────────────
const C = {
  primary: '#E8FF4D', bg: '#0A0A0A', card: '#141414', border: '#222',
  text: '#FFFFFF', muted: '#888', positive: '#4DFF91',
  negative: '#FF4D4D', blue: '#4D9FFF', purple: '#b04dff',
}

// ─── Formatters ────────────────────────────────────────────────────────────
const fmt = (n, d = 0) => typeof n === 'number'
  ? n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d }) : n
const fmtGBP = n => typeof n === 'number'
  ? '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : n
const pct = n => typeof n === 'number' ? n.toFixed(1) + '%' : n

// ─── UI primitives ─────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>{label}</div>
      <div style={{ color: C.text, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ color: subColor || C.muted, fontSize: 11, marginTop: 5 }}>{sub}</div>}
    </div>
  )
}

function SectionHeader({ title, source }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10, marginTop: 24 }}>
      <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{title}</div>
      {source && <div style={{ color: C.muted, fontSize: 10 }}>{source}</div>}
    </div>
  )
}

function ChartCard({ children, height = 210 }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 6px 8px 6px' }}>
      <ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer>
    </div>
  )
}

const Tip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1c1c1c', border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 13px', fontSize: 11 }}>
      <div style={{ color: C.muted, marginBottom: 5, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ color: C.text, fontWeight: 600 }}>{formatter ? formatter(p.value, p.name) : fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function Note({ children }) {
  return (
    <div style={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 15px', marginTop: 14, fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
      {children}
    </div>
  )
}

function LiveBadge({ live }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: '#161616', border: `1px solid ${C.border}`,
      borderRadius: 7, padding: '4px 10px', fontSize: 10,
      color: live ? C.positive : C.muted,
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: live ? C.positive : C.muted }} />
      {live ? 'Live data' : 'Cached snapshot'}
    </div>
  )
}

const TABS = ['Overview', 'Daily', 'Subscriptions', 'Website', 'Email']

// ─── Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState('Overview')

  // Live data hooks — each falls back to static data automatically
  const ga4 = useGA4Weekly(FB_ga4Weekly)
  const klaviyo = useKlaviyo(FB_klaviyoWeekly)
  const shopifyDaily = useShopifyDaily(FB_dailyData)

  // Use live data if available, otherwise static fallback
  const ga4Data = ga4.data || FB_ga4Weekly
  const dailyData = shopifyDaily.data || FB_dailyData
  const klaviyoData = klaviyo.data || FB_klaviyoWeekly

  const isLive = ga4.live || klaviyo.live || shopifyDaily.live
  const today = FB_dailyData[FB_dailyData.length - 1]

  return (
    <div style={{
      background: C.bg, minHeight: '100vh',
      fontFamily: "'-apple-system', 'Helvetica Neue', sans-serif",
      color: C.text, padding: '26px 18px', maxWidth: 900, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary }} />
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Apex Rides</span>
            <span style={{ color: C.muted, fontSize: 12 }}>Dashboard</span>
          </div>
          <div style={{ color: C.muted, fontSize: 10, marginTop: 3 }}>
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · Shopify · GA4 · Klaviyo
          </div>
        </div>
        <LiveBadge live={isLive} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 22, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 13px',
            fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
            color: tab === t ? C.primary : C.muted,
            borderBottom: tab === t ? `2px solid ${C.primary}` : '2px solid transparent',
            marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'Overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10 }}>
            <StatCard label="Active Subscribers" value={fmt(FB_subscribers)} sub="Known figure · Skio" />
            <StatCard label="Net Sales (30d)" value={fmtGBP(FB_shopify30d.netSales)} sub={`${fmt(FB_shopify30d.orders)} orders`} />
            <StatCard label="Gross Sales (30d)" value={fmtGBP(FB_shopify30d.grossSales)} />
            <StatCard label="Website Users (W11)" value="576" sub="Best recent week" subColor={C.positive} />
            <StatCard label="Email Open Rate" value={pct(FB_lastCampaign.openRate)} sub="Last campaign" subColor={C.positive} />
            <StatCard label="Email Unsubs W10–11" value="152" sub="Campaign-driven" subColor={C.negative} />
          </div>
          <SectionHeader title="Subscription Revenue by Week" source="Shopify / Skio" />
          <ChartCard>
            <BarChart data={FB_skioWeekly} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '£' + (v / 1000).toFixed(0) + 'k'} />
              <Tooltip content={<Tip formatter={v => fmtGBP(v)} />} />
              <Bar dataKey="revenue" name="Revenue" fill={C.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
          <SectionHeader title="Website Users by Week" source="GA4" />
          <ChartCard height={185}>
            <LineChart data={ga4Data.slice(0, -1)} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="users" name="Users" stroke={C.primary} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#555" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
            </LineChart>
          </ChartCard>
        </div>
      )}

      {/* ── DAILY ── */}
      {tab === 'Daily' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <StatCard label={`Orders · ${today.date}`} value={fmt(today.shopifyOrders)} sub="Shopify" />
            <StatCard label={`Net Sales · ${today.date}`} value={fmtGBP(today.shopifyRevenue)} sub="Shopify" />
            <StatCard label={`Users · ${today.date}`} value={fmt(today.users)} sub="GA4" />
            <StatCard label={`Email Rev · ${today.date}`} value={fmtGBP(today.klaviyoRevenue)} sub="Klaviyo attributed" />
          </div>
          <SectionHeader title="Daily Net Sales" source="Shopify" />
          <ChartCard>
            <BarChart data={dailyData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '£' + (v / 1000).toFixed(1) + 'k'} />
              <Tooltip content={<Tip formatter={v => fmtGBP(v)} />} />
              <Bar dataKey="shopifyRevenue" name="Net Sales" fill={C.primary} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartCard>
          <SectionHeader title="Daily Orders" source="Shopify" />
          <ChartCard height={185}>
            <BarChart data={dailyData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="shopifyOrders" name="Orders" fill={C.blue} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartCard>
          <SectionHeader title="Daily Website Users & Engaged Sessions" source="GA4" />
          <ChartCard height={185}>
            <ComposedChart data={dailyData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
              <Bar dataKey="users" name="Users" fill="#444" radius={[3, 3, 0, 0]} />
              <Line type="monotone" dataKey="engagedSessions" name="Engaged Sessions" stroke={C.positive} strokeWidth={2} dot={{ r: 2 }} />
            </ComposedChart>
          </ChartCard>
          <SectionHeader title="Daily Klaviyo Revenue" source="Klaviyo" />
          <ChartCard height={185}>
            <BarChart data={dailyData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '£' + (v / 1000).toFixed(1) + 'k'} />
              <Tooltip content={<Tip formatter={v => fmtGBP(v)} />} />
              <Bar dataKey="klaviyoRevenue" name="Email Revenue" fill={C.purple} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartCard>
          <Note>Klaviyo revenue is email-attributed and overlaps with Shopify figures — it is not additive. Spikes reflect campaign send activity.</Note>
        </div>
      )}

      {/* ── SUBSCRIPTIONS ── */}
      {tab === 'Subscriptions' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10 }}>
            <StatCard label="Active Subscribers" value={fmt(FB_subscribers)} sub="Known figure · Skio" />
            <StatCard label="Skio Orders (30d)" value="~930" sub="Recurring charges" />
            <StatCard label="Sub Revenue (30d)" value={fmtGBP(22437)} sub="Net via Skio" />
            <StatCard label="Avg Weekly Revenue" value={fmtGBP(4487)} sub="Last 5 weeks" />
          </div>
          <SectionHeader title="Weekly Subscription Orders & Revenue" source="Shopify / Skio" />
          <ChartCard height={235}>
            <BarChart data={FB_skioWeekly} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '£' + (v / 1000).toFixed(0) + 'k'} />
              <YAxis yAxisId="r" orientation="right" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip formatter={(v, n) => n === 'Revenue' ? fmtGBP(v) : fmt(v)} />} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.muted }} />
              <Bar yAxisId="l" dataKey="revenue" name="Revenue" fill={C.primary} radius={[4, 4, 0, 0]} />
              <Bar yAxisId="r" dataKey="orders" name="Orders" fill="#333" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
          <Note>
            <span style={{ color: C.text, fontWeight: 600 }}>Subscriber count: </span>
            The 1,200 figure is confirmed via Skio. Windsor.ai 30-day pull returns ~600 because roughly half the base is on quarterly or annual billing. Check Skio for a plan-type breakdown.
          </Note>
        </div>
      )}

      {/* ── WEBSITE ── */}
      {tab === 'Website' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <StatCard label="Users (W11)" value="576" sub="Best recent week" subColor={C.positive} />
            <StatCard label="Avg Weekly Users" value="342" sub="W04–W11 avg" />
            <StatCard label="New User Rate" value="89%" sub="W11" />
            <StatCard label="Engagement Rate" value={pct(21.3)} sub="W11 · down from 33%" subColor={C.negative} />
            <StatCard label="Bounce Rate" value={pct(78.7)} sub="W11 · high" subColor={C.negative} />
            <StatCard label="Avg Session" value="42s" sub="W11 · down from 130s" subColor={C.negative} />
          </div>
          <SectionHeader title="Weekly Users, Sessions & Engaged Sessions" source="GA4" />
          <ChartCard>
            <LineChart data={ga4Data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
              <Line type="monotone" dataKey="users" name="Users" stroke={C.primary} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#555" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="engagedSessions" name="Engaged Sessions" stroke={C.positive} strokeWidth={1.5} dot={{ r: 2 }} />
            </LineChart>
          </ChartCard>
          <SectionHeader title="Engagement Rate vs Bounce Rate" source="GA4" />
          <ChartCard height={185}>
            <LineChart data={ga4Data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} domain={[0, 100]} />
              <Tooltip content={<Tip formatter={v => v.toFixed(1) + '%'} />} />
              <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
              <Line type="monotone" dataKey="engagementRate" name="Engagement Rate" stroke={C.positive} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bounceRate" name="Bounce Rate" stroke={C.negative} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ChartCard>
        </div>
      )}

      {/* ── EMAIL ── */}
      {tab === 'Email' && (
        <div>
          <SectionHeader title="Last Campaign · Mar 16" source="Klaviyo" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
            <StatCard label="Recipients" value={fmt(FB_lastCampaign.recipients)} />
            <StatCard label="Open Rate" value={pct(FB_lastCampaign.openRate)} sub="Strong" subColor={C.positive} />
            <StatCard label="Unique Clicks" value={fmt(FB_lastCampaign.uniqueClicks)} sub="Low — review CTA" subColor={C.negative} />
            <StatCard label="Revenue Attributed" value={fmtGBP(FB_lastCampaign.conversionValue)} />
            <StatCard label="Unsubscribes" value={fmt(FB_lastCampaign.unsubscribes)} sub="1.4% of list" subColor={C.negative} />
          </div>
          <SectionHeader title="Weekly List Changes" source="Klaviyo" />
          <ChartCard>
            <BarChart data={klaviyoData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
              <Bar dataKey="subscribed" name="Subscribed" fill={C.positive} radius={[4, 4, 0, 0]} />
              <Bar dataKey="unsubscribed" name="Unsubscribed" fill={C.negative} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
          <SectionHeader title="Weekly Email Revenue" source="Klaviyo" />
          <ChartCard height={185}>
            <BarChart data={klaviyoData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '£' + (v / 1000).toFixed(0) + 'k'} />
              <Tooltip content={<Tip formatter={v => fmtGBP(v)} />} />
              <Bar dataKey="revenue" name="Revenue" fill={C.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 32, paddingTop: 14, borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.muted,
      }}>
        <span>Apex Rides · Internal · Not for distribution</span>
        <span>W12* = partial · Klaviyo revenue is attributed, not additive</span>
      </div>
    </div>
  )
}
