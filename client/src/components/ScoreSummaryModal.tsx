import { useMemo, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import { apiFetch } from '../lib/api'

type BaseProps = {
  open: boolean
  onClose: () => void
  section: 'listening' | 'reading' | 'writing' | 'speaking'
  startedAt: string | null
  endedAt: string | null
  durationSec: number
  results: unknown
}

function fmt(dt: string | null): string {
  if (!dt) return '—'
  try {
    return new Date(dt).toLocaleString()
  } catch {
    return dt
  }
}

function fmtDur(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}m ${r}s`
}

export function ScoreSummaryModal({
  open,
  onClose,
  section,
  startedAt,
  endedAt,
  durationSec,
  results,
}: BaseProps) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const canSave = useMemo(() => Boolean(startedAt) && Boolean(endedAt || durationSec > 0), [startedAt, endedAt, durationSec])

  async function onSave() {
    setStatus(null)
    if (!canSave) {
      setStatus('Start the test first so time can be recorded.')
      return
    }

    if (!user) {
      setStatus('Please login to save your score to your account.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        section,
        startedAt,
        endedAt: endedAt ?? new Date().toISOString(),
        durationSec,
        results,
      }
      await apiFetch('/api/sessions', { method: 'POST', json: payload })
      setStatus('Saved to your account.')
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: unknown }).message ?? 'Failed to save.')
          : 'Failed to save.'
      setStatus(msg)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Score summary">
      <div className="modal__card">
        <div className="modal__head">
          <h2 style={{ margin: 0 }}>Score summary</h2>
          <button type="button" className="btn btn--sm" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="hint" style={{ marginTop: 0 }}>
          Section: <strong>{section}</strong>
        </p>

        <div className="wcheck__grid" role="list">
          <div className="wcheck__card" role="listitem">
            <div className="wcheck__cardHead">
              <h3 className="wcheck__crit">Timing</h3>
              <span className="wcheck__band">{fmtDur(durationSec)}</span>
            </div>
            <p className="wcheck__summary">
              Started: {fmt(startedAt)}
              <br />
              Ended: {fmt(endedAt)}
            </p>
          </div>
          <div className="wcheck__card" role="listitem">
            <div className="wcheck__cardHead">
              <h3 className="wcheck__crit">Result</h3>
              <span className="wcheck__band">Saved</span>
            </div>
            <pre className="wcheck__summary" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>

        {status && (
          <p className="banner banner--warn" role="status" style={{ marginTop: '0.75rem' }}>
            {status}
          </p>
        )}

        <div className="actions-row" style={{ marginTop: '0.75rem' }}>
          <button type="button" className="btn btn--primary" onClick={() => void onSave()} disabled={saving || !user}>
            {saving ? 'Saving…' : 'Save to my account'}
          </button>
        </div>
      </div>
    </div>
  )
}

