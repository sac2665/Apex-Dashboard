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
      alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif',
    }}>
      <div style={{ textAlign: 'center', width: 280 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8FF4D' }} />
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Apex Rides</span>
        </div>
        <input
          type="password"
          placeholder="Password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{
            width: '100%', padding: '10px 14px', background: '#141414',
            border: `1px solid ${error ? '#FF4D4D' : '#333'}`, borderRadius: 8,
            color: '#fff', fontSize: 14, outline: 'none', marginBottom: 10,
            transition: 'border-color 0.2s',
          }}
          autoFocus
        />
        <button
          onClick={attempt}
          style={{
            width: '100%', padding: '10px 14px', background: '#E8FF4D',
            border: 'none', borderRadius: 8, color: '#0A0A0A',
            fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '0.02em',
          }}
        >
          Enter
        </button>
        {error && <div style={{ color: '#FF4D4D', fontSize: 11, marginTop: 8 }}>Incorrect password</div>}
      </div>
    </div>
  )
}
