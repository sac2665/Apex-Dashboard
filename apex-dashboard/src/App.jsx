import { useState } from 'react'
import Dashboard from './Dashboard.jsx'

const PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || 'apex2026'

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('apex_auth') === '1')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function attempt() {
    if (input === PASSWORD) {
      sessionStorage.setItem('apex_auth', '1')
      setAuthed(true)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1800)
    }
  }

  if (authed) return <Dashboard />

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden',
    }}>
      {/* Decorative blobs echoing the site hero */}
      <div style={{
        position: 'fixed', top: -140, right: -140, width: 420, height: 420,
        borderRadius: '50%', background: '#C8F000', opacity: 0.10, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -100, left: -100, width: 320, height: 320,
        borderRadius: '50%', background: '#F2A7CC', opacity: 0.07, pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', width: 300, position: 'relative' }}>
        <div style={{
          fontSize: 40, fontWeight: 900, letterSpacing: '0.14em',
          color: '#FFFFFF', lineHeight: 1, textTransform: 'uppercase', marginBottom: 6,
        }}>APEX</div>
        <div style={{
          fontSize: 10, letterSpacing: '0.25em', color: '#555',
          textTransform: 'uppercase', marginBottom: 32,
        }}>Internal Dashboard</div>

        <div style={{ width: 36, height: 2, background: '#C8F000', margin: '0 auto 28px' }} />

        <input
          type="password"
          placeholder="Enter password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{
            width: '100%', padding: '12px 16px', background: '#141414',
            border: `1px solid ${error ? '#FF4D4D' : '#2a2a2a'}`, borderRadius: 6,
            color: '#fff', fontSize: 14, outline: 'none', marginBottom: 10,
            transition: 'border-color 0.2s', fontFamily: 'inherit',
          }}
          autoFocus
        />
        <button onClick={attempt} style={{
          width: '100%', padding: '12px 16px', background: '#C8F000',
          border: 'none', borderRadius: 6, color: '#0A0A0A', fontWeight: 800,
          fontSize: 11, cursor: 'pointer', letterSpacing: '0.18em',
          textTransform: 'uppercase', fontFamily: 'inherit',
        }}>
          Enter
        </button>
        {error && <div style={{ color: '#FF4D4D', fontSize: 11, marginTop: 10 }}>Incorrect password</div>}
      </div>
    </div>
  )
}
