// ─────────────────────────────────────────────────────────────────────────────
// Ретрансляція ефіру Yantarne.FM у трансляцію Telegram-каналу (RTMPS).
// Бере аудіопотік Icecast, додає статичну картинку (Telegram вимагає відео)
// і цілодобово передає в канал. Якщо ефір або Telegram на мить відпаде —
// все автоматично перепідключається.
//
// Як влаштовано: мережею займається Node.js, а ffmpeg лише перекодовує.
//   ефір (http/https) ──Node──▶ ffmpeg stdin ──▶ rtmp://127.0.0.1 ──Node TLS-проксі──▶ Telegram (rtmps)
// Так зроблено, бо статична збірка ffmpeg з npm (ffmpeg-static) не вміє
// резолвити доменні імена (DNS) і падає, якщо дати їй адресу на кшталт complex.in.ua.
//
// Змінні середовища (Render → Environment):
//   TG_STREAM_ENABLED=true                       увімкнути ретрансляцію
//   TG_RTMP_URL=rtmps://dc4-1.rtmp.t.me/s/       «URL сервера» з Telegram
//   TG_STREAM_KEY=...                            «Ключ трансляції» з Telegram (секрет!)
//   STREAM_SOURCE_URL=https://complex.in.ua/yantarne   (необов'язково)
//   TG_STREAM_COVER=/шлях/до/картинки.jpg               (необов'язково)
//   TG_STREAM_DEBUG=true                                (необов'язково) докладні логи
// ─────────────────────────────────────────────────────────────────────────────
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');

// TG_STREAM_DEBUG=true — докладні логи ffmpeg (для пошуку проблем)
const DEBUG = process.env.TG_STREAM_DEBUG === 'true'

let ffmpegPath;
try { ffmpegPath = require('ffmpeg-static'); } catch { ffmpegPath = 'ffmpeg'; }

const state = {
  enabled: false,
  status: 'stopped', // stopped | starting | live | restarting | error
  startedAt: null,
  liveSince: null,
  restarts: 0,
  sourceReconnects: 0,
  lastError: null,
  lastExitAt: null
};

let proc = null
let proxy = null
let proxyPort = 0
let sourceReq = null
let restartTimer = null
let sourceTimer = null
let backoff = 5000
let stopping = false

function config() {
  const rtmp = (process.env.TG_RTMP_URL || '').trim()
  const key = (process.env.TG_STREAM_KEY || '').trim()
  let target = null
  if (rtmp && key) {
    const u = new URL(rtmp.replace(/\/?$/, '/'))
    target = {
      secure: u.protocol === 'rtmps:',
      host: u.hostname,
      port: Number(u.port) || (u.protocol === 'rtmps:' ? 443 : 1935),
      app: u.pathname.replace(/^\/|\/$/g, '') || 's',
      key
    }
  }
  return {
    enabled: process.env.TG_STREAM_ENABLED === 'true',
    target,
    source: process.env.STREAM_SOURCE_URL || 'https://complex.in.ua/yantarne',
    cover: process.env.TG_STREAM_COVER || path.join(__dirname, '../../assets/telegram-cover.jpg')
  }
}

const log = (...a) => console.log('📡 Telegram-трансляція:', ...a)
const mask = s => String(s).replace(/(rtmps?:\/\/[^\s]*?\/[^/\s]+\/)[^\s]+/g, '$1***')

// ── локальний проксі: ffmpeg говорить звичайний RTMP на 127.0.0.1, Node загортає в TLS до Telegram
function startProxy(target) {
  return new Promise((resolve, reject) => {
    proxy = net.createServer(local => {
      // Чекаємо перший пакет: справжній RTMP від ffmpeg починається з байта 0x03 (1537 байт рукостискання).
      // Будь-що інше (наприклад, HTTP-перевірка портів від хостингу) у Telegram не пускаємо.
      local.once('data', first => {
        const preview = first.slice(0, 48).toString('latin1').replace(/[^\x20-\x7e]/g, '.')
        if (first[0] !== 0x03) {
          log(`стороннє зʼєднання на локальному порту (${first.length} Б: "${preview}"), ігнорую`)
          return local.destroy()
        }
        if (DEBUG) log(`ffmpeg почав RTMP-рукостискання (${first.length} Б)`)
        let up = first.length, down = 0
        const remote = target.secure
          ? tls.connect({ host: target.host, port: target.port, servername: target.host })
          : net.connect({ host: target.host, port: target.port })
        remote.setNoDelay(true)
        remote.once(target.secure ? 'secureConnect' : 'connect', () => log(`зʼєднання з ${target.host}:${target.port} встановлено`))
        remote.write(first)
        local.on('data', c => { up += c.length })
        remote.on('data', c => { down += c.length })
        local.pipe(remote).pipe(local)
        const close = err => {
          if (err) { state.lastError = 'Зʼєднання з Telegram: ' + err.message; log(state.lastError) }
          local.destroy(); remote.destroy()
        }
        local.on('error', close); remote.on('error', close)
        local.on('close', () => remote.destroy())
        remote.on('close', () => {
          log(`Telegram закрив зʼєднання (надіслано ${up} Б, отримано ${down} Б)`)
          local.destroy()
        })
      })
      local.on('error', () => local.destroy())
    })
    proxy.on('error', reject)
    proxy.listen(0, '127.0.0.1', () => { proxyPort = proxy.address().port; resolve() })
  })
}

// ── джерело: Node тягне ефір і віддає байти у stdin ffmpeg; при обриві — перепідключення
function pumpSource(url, sink, redirects = 0) {
  if (stopping || !sink.writable) return
  const lib = url.startsWith('https:') ? https : http
  sourceReq = lib.get(url, { headers: { 'User-Agent': 'YantarneFM-TelegramRestream/1.0', 'Icy-MetaData': '0' } }, res => {
    if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
      res.resume()
      return pumpSource(new URL(res.headers.location, url).href, sink, redirects + 1)
    }
    if (res.statusCode !== 200) {
      res.resume()
      return retrySource(url, sink, 'ефір відповів кодом ' + res.statusCode)
    }
    res.on('data', chunk => { if (sink.writable) sink.write(chunk) })
    res.on('end', () => retrySource(url, sink, 'ефір завершив передачу'))
    res.on('error', err => retrySource(url, sink, err.message))
  })
  sourceReq.setTimeout(20000, () => sourceReq.destroy(new Error('таймаут ефіру')))
  sourceReq.on('error', err => retrySource(url, sink, err.message))
}

function retrySource(url, sink, reason) {
  if (stopping || !sink.writable) return
  clearTimeout(sourceTimer)
  state.sourceReconnects++
  state.lastError = 'Ефір: ' + reason
  log('ефір перервався (' + reason + '), перепідключення через 3 с')
  sourceTimer = setTimeout(() => pumpSource(url, sink), 3000)
}

function buildArgs({ cover, rtmpUrl, tcUrl }) {
  return [
    '-hide_banner', '-loglevel', DEBUG ? 'verbose' : 'warning', '-nostats',
    // відео: одна картинка, 2 кадри/с у реальному часі — мінімальний трафік
    '-re', '-loop', '1', '-framerate', '2', '-i', cover,
    // аудіо: ефір, який Node подає в stdin
    '-thread_queue_size', '1024', '-i', 'pipe:0',
    '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
    '-r', '2', '-g', '4', '-b:v', '80k', '-maxrate', '100k', '-bufsize', '200k',
    '-c:a', 'aac', '-b:a', '96k', '-ar', '44100', '-ac', '2',
    // Telegram має бачити свою адресу, а не локальний проксі 127.0.0.1
    '-rtmp_tcurl', tcUrl,
    '-f', 'flv', rtmpUrl
  ]
}

function launch() {
  const cfg = config()
  if (!cfg.target) {
    state.status = 'error'
    state.lastError = 'Не задано TG_RTMP_URL або TG_STREAM_KEY'
    return log(state.lastError)
  }
  if (!fs.existsSync(cfg.cover)) {
    state.status = 'error'
    state.lastError = 'Не знайдено картинку: ' + cfg.cover
    return log(state.lastError)
  }

  const rtmpUrl = `rtmp://127.0.0.1:${proxyPort}/${cfg.target.app}/${cfg.target.key}`
  const tcUrl = `${cfg.target.secure ? 'rtmps' : 'rtmp'}://${cfg.target.host}:${cfg.target.port}/${cfg.target.app}`
  state.status = state.restarts ? 'restarting' : 'starting'
  state.startedAt = new Date().toISOString()
  log(`запуск (${cfg.source} → ${cfg.target.secure ? 'rtmps' : 'rtmp'}://${cfg.target.host}/${cfg.target.app}/***)`)

  proc = spawn(ffmpegPath, buildArgs({ cover: cfg.cover, rtmpUrl, tcUrl }), { stdio: ['pipe', 'ignore', 'pipe'] })
  proc.stdin.on('error', () => {}) // ffmpeg міг закритися — не валимо сервер
  pumpSource(cfg.source, proc.stdin)

  // процес прожив 20 с без падіння — вважаємо, що ефір іде
  const liveTimer = setTimeout(() => {
    if (proc) { state.status = 'live'; state.liveSince = new Date().toISOString(); backoff = 5000 }
  }, 20000)

  let lastLog = 0
  proc.stderr.on('data', chunk => {
    const text = mask(chunk.toString()).split('\n').filter(l => !/Statistics: \d+ bytes read/.test(l)).join('\n').trim()
    if (!text) return
    state.lastError = text.slice(-500)
    if (DEBUG || Date.now() - lastLog > 10000) { lastLog = Date.now(); console.warn('📡 ffmpeg:', DEBUG ? text : text.slice(-300)) }
  })

  proc.on('exit', (code, signal) => {
    clearTimeout(liveTimer)
    clearTimeout(sourceTimer)
    if (sourceReq) sourceReq.destroy()
    proc = null
    state.lastExitAt = new Date().toISOString()
    state.liveSince = null
    if (stopping) { state.status = 'stopped'; return }
    state.status = 'restarting'
    state.restarts++
    log(`ffmpeg завершився (code ${code}, ${signal || '—'}), перезапуск через ${backoff / 1000} с`)
    restartTimer = setTimeout(launch, backoff)
    backoff = Math.min(backoff * 2, 60000)
  })

  proc.on('error', err => { state.lastError = 'Не вдалося запустити ffmpeg: ' + err.message; log(state.lastError) })
}

async function start() {
  const cfg = config()
  state.enabled = cfg.enabled
  if (!cfg.enabled) return log('вимкнена (TG_STREAM_ENABLED != true)')
  if (!cfg.target) { state.status = 'error'; state.lastError = 'Не задано TG_RTMP_URL або TG_STREAM_KEY'; return log(state.lastError) }
  stopping = false
  try {
    await startProxy(cfg.target)
    launch()
  } catch (err) {
    state.status = 'error'; state.lastError = 'Проксі: ' + err.message; log(state.lastError)
  }
}

function stop() {
  stopping = true
  clearTimeout(restartTimer); clearTimeout(sourceTimer)
  if (sourceReq) sourceReq.destroy()
  if (proc) proc.kill('SIGTERM')
  if (proxy) proxy.close()
}

// коректно зупиняємо при перезапуску сервера на Render
;['SIGTERM', 'SIGINT'].forEach(sig => process.once(sig, () => { stop(); setTimeout(() => process.exit(0), 1500) }))

function status() {
  return { ...state, uptimeSec: state.liveSince ? Math.round((Date.now() - Date.parse(state.liveSince)) / 1000) : 0 }
}

module.exports = { start, stop, status }
