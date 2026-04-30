export type AudioTimingMetrics = {
  durationSec: number
  silenceRatio: number
  estimatedPauseCount: number
}

type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext }

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

/**
 * Decodes an audio Blob and estimates silence ratio + pause count.
 * This is a lightweight heuristic (not phoneme/ASR) intended for practice feedback.
 */
export async function analyzeAudioTiming(blob: Blob): Promise<AudioTimingMetrics> {
  const arrayBuf = await blob.arrayBuffer()
  const w = window as WindowWithWebkitAudio
  const Ctor = window.AudioContext || w.webkitAudioContext
  const ctx = new Ctor()
  try {
    const audioBuf = await ctx.decodeAudioData(arrayBuf.slice(0))
    const ch0 = audioBuf.getChannelData(0)
    const sampleRate = audioBuf.sampleRate
    const durationSec = audioBuf.duration || (ch0.length / sampleRate)

    // Frame-based RMS energy
    const frameMs = 30
    const frameSize = Math.max(1, Math.floor((sampleRate * frameMs) / 1000))
    const frames = Math.floor(ch0.length / frameSize)
    if (frames <= 1) {
      return { durationSec: Math.max(0, durationSec), silenceRatio: 0, estimatedPauseCount: 0 }
    }

    const rms: number[] = []
    let max = 0
    for (let i = 0; i < frames; i++) {
      const start = i * frameSize
      let sum = 0
      for (let j = 0; j < frameSize; j++) {
        const v = ch0[start + j] ?? 0
        sum += v * v
      }
      const r = Math.sqrt(sum / frameSize)
      rms.push(r)
      if (r > max) max = r
    }

    // Dynamic threshold based on peak RMS.
    // This generally works for phone/laptop mics without calibration.
    const thr = max * 0.08
    const isSilent = rms.map((r) => r < thr)
    const silentFrames = isSilent.filter(Boolean).length
    const silenceRatio = clamp01(silentFrames / isSilent.length)

    // Pause count: count silent runs >= 400ms.
    const minPauseFrames = Math.ceil(400 / frameMs)
    let pauseCount = 0
    let run = 0
    for (const s of isSilent) {
      if (s) run += 1
      else {
        if (run >= minPauseFrames) pauseCount += 1
        run = 0
      }
    }
    if (run >= minPauseFrames) pauseCount += 1

    return {
      durationSec: Math.max(0, durationSec),
      silenceRatio,
      estimatedPauseCount: pauseCount,
    }
  } finally {
    void ctx.close().catch(() => {})
  }
}

