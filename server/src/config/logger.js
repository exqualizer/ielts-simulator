import { createLogger, format, transports } from 'winston'
import expressWinston from 'express-winston'
import { LoggingWinston } from '@google-cloud/logging-winston'

const logLevel = process.env.LOG_LEVEL || 'info'

expressWinston.requestWhitelist.push('user', 'location')
if (process.env.NODE_ENV === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
}

const getLevel = (req, res) => {
  let level = ''
  if (res.statusCode >= 100) level = 'info'
  if (res.statusCode >= 400) level = 'warn'
  if (res.statusCode >= 500) level = 'error'
  if (res.statusCode === 401 || res.statusCode === 403) level = 'error'
  return level
}

export const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
  ],
})

const gcpLogName = process.env.GCP_LOG_NAME || 'ielts-simulator-api'
const gcpProjectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || undefined

const nodeEnv = process.env.NODE_ENV
const wantsGcpLogging =
  process.env.DISABLE_GCP_LOGGING !== 'true' &&
  (nodeEnv === 'staging' ||
    nodeEnv === 'production' ||
    Boolean(process.env.K_SERVICE || process.env.CLOUD_RUN_JOB))

/**
 * LoggingWinston needs ADC (metadata on Cloud Run, or GOOGLE_APPLICATION_CREDENTIALS, or gcloud ADC).
 * Avoid instantiating it for local NODE_ENV=production without credentials (throws on first write).
 */
function canUseGcpLoggingWinston() {
  if (process.env.K_SERVICE || process.env.CLOUD_RUN_JOB) return true
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return true
  if (process.env.ENABLE_GCP_LOGGING === 'true') return true
  return false
}

if (wantsGcpLogging && canUseGcpLoggingWinston()) {
  try {
    logger.add(
      new LoggingWinston({
        ...(gcpProjectId ? { projectId: gcpProjectId } : {}),
        logName: gcpLogName,
        labels: {
          service: process.env.K_SERVICE || process.env.CLOUD_RUN_JOB || 'ielts-simulator-api',
          revision: process.env.K_REVISION || process.env.CLOUD_RUN_EXECUTION || 'local',
        },
        defaultCallback: (err) => {
          if (err) console.error('[logger] GCP transport:', err.message)
        },
      }),
    )
  } catch (err) {
    console.warn('[logger] GCP LoggingWinston not started:', err?.message || err)
  }
} else if (wantsGcpLogging && !canUseGcpLoggingWinston()) {
  console.warn(
    '[logger] NODE_ENV is production/staging but GCP logging is skipped (no Cloud Run / credentials). ' +
      'Set GOOGLE_APPLICATION_CREDENTIALS, run on Cloud Run, or set ENABLE_GCP_LOGGING=true with ADC.',
  )
}

const requestFilter = (req, propName) => {
  if (propName === 'headers') {
    return {
      'user-agent': req.headers['user-agent'],
      origin: req.headers.origin,
    }
  }
  if (propName === 'user') {
    const u = req.user
    if (!u) return undefined
    return { id: u.id, email: u.email }
  }
  if (propName === 'httpVersion' || propName === 'originalUrl') {
    return undefined
  }
  return req[propName]
}

export const expressLogger = expressWinston.logger({
  winstonInstance: logger,
  msg(req, res) {
    if (logLevel === 'debug' && process.env.NODE_ENV === 'development') {
      return `${req.method} ${req.url} ${res.statusCode} ${res.responseTime}ms \n Request Body: ${JSON.stringify(
        req.body ?? '',
        null,
        4,
      )} \n Response Body: ${JSON.stringify(res.body ?? '', null, 4)}`
    }
    return `${req.method} ${req.url} ${res.statusCode} ${res.responseTime}ms`
  },
  statusLevels: false,
  level: getLevel,
  requestFilter,
  ignoredRoutes: ['/api/health'],
  colorize: true,
  skip(req, res) {
    return getLevel(req, res) === 'error'
  },
})

export const expressErrorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  msg:
    process.env.NODE_ENV === 'development'
      ? '{{req.method}} {{req.url}} {{err.status}} \n message: {{err.message}} \n stack: {{err.stack}}'
      : '{{req.method}} {{req.url}} {{err.status}}',
  colorize: true,
  requestFilter,
  requestWhitelist: ['body', 'user', 'location'],
  blacklistedMetaFields: ['level', 'error', 'date'],
})
