import morgan from 'morgan'
import { logger } from '../../lib/logger.js'

morgan.token('request-body', (req) => {
  const yeuCau = req as typeof req & { body?: unknown }
  if (req.method === 'GET' || req.method === 'HEAD') {
    return ''
  }

  try {
    return JSON.stringify(yeuCau.body ?? {})
  } catch {
    return '[unserializable-body]'
  }
})

const boQuaBody = (body: string) => {
  if (!body || body === '{}' || body === '[]') {
    return undefined
  }

  if (body.length > 1000) {
    return `${body.slice(0, 1000)}...`
  }

  return body
}

export const requestLogger = morgan((tokens, req, res) => {
  logger.info('API request', {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    statusCode: Number(tokens.status(req, res) || 0),
    contentLength: tokens.res(req, res, 'content-length') || '0',
    responseTimeMs: Number(tokens['response-time'](req, res) || 0),
    ip: tokens['remote-addr'](req, res),
    requestBody: boQuaBody(tokens['request-body'](req, res) || ''),
  })

  return null
})
