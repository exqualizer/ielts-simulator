type ApiError = Error & { status?: number; data?: unknown }

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || ''

function withBase(path: string): string {
  if (!API_BASE) return path
  return `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const headers = new Headers(opts.headers)
  if (opts.json !== undefined) {
    headers.set('content-type', 'application/json')
    headers.set('accept', 'application/json')
    headers.set('originreferer', window.location.href)
    headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
    headers.set('Access-Control-Allow-Origin', '*')
  }

  const res = await fetch(withBase(path), {
    ...opts,
    referrer: window.location.href,
    headers,
    credentials: 'include',
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  })

  const text = await res.text()
  const data = text ? safeJson(text) : null

  if (!res.ok) {
    const errMsg =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message?: unknown }).message ?? `Request failed (${res.status})`)
        : `Request failed (${res.status})`
    const err = new Error(errMsg) as ApiError
    err.status = res.status
    err.data = data
    throw err
  }

  return data as T
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s)
  } catch {
    return s
  }
}

