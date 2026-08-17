// Шлях у проєкті: app/api/stream-check/route.js
// (якщо в проєкті Pages Router, а не App Router — див. варіант нижче у коментарі в кінці файлу)
//
// Навіщо: дає відповідь на пріоритетні питання з чек-листа без потреби в curl
// на конкретній машині (сервер Next.js сам ходить в мережу, без CORS-обмежень
// браузера і без блокувань, які можуть бути в пісочниці/локальному фаєрволі).
//
// Відкрий у браузері: https://yantarne.fm/api/stream-check

const STREAM_URL = 'https://complex.in.ua/yantarne';

export async function GET() {
  try {
    const res = await fetch(STREAM_URL, {
      method: 'GET',
      headers: {
        // Icy-MetaData: 1 — просимо сервер віддати icy-* заголовки, якщо це Icecast/Shoutcast
        'Icy-MetaData': '1',
        'User-Agent': 'YantarneFM-StreamCheck/1.0',
      },
      // Не чекаємо вічно і не тягнемо весь стрім — нам треба тільки заголовки + перші байти
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    const headers = {};
    res.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Читаємо лише перший чанк тіла, щоб не тримати з'єднання відкритим і не
    // качати весь live-стрім через наш власний сервер
    let sampleHex = null;
    let sampleLength = 0;
    if (res.body) {
      const reader = res.body.getReader();
      const { value } = await reader.read();
      if (value) {
        sampleLength = value.length;
        sampleHex = Array.from(value.slice(0, 16))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(' ');
      }
      await reader.cancel().catch(() => {});
    }

    const isIcecastLike = Boolean(
      headers['icy-name'] || headers['icy-genre'] || headers['icy-br'] || headers['icy-url']
    );
    const looksLikeHls = (headers['content-type'] || '').includes('mpegurl');
    const proxyHints = ['via', 'x-cache', 'x-served-by', 'cf-ray', 'x-proxy-cache']
      .filter((h) => headers[h])
      .reduce((acc, h) => ({ ...acc, [h]: headers[h] }), {});

    return Response.json({
      streamUrl: STREAM_URL,
      httpStatus: res.status,
      contentType: headers['content-type'] || null,
      server: headers['server'] || null,
      // Якщо тут щось є — icy-name/icy-br тощо — це прямий Icecast/Shoutcast mount
      diagnosis: {
        isDirectIcecastOrShoutcast: isIcecastLike,
        looksLikeHlsPlaylist: looksLikeHls,
        // Якщо тут не пусто — між браузером і джерелом є проксі/CDN/relay,
        // що і є першим підозрюваним у затримці
        proxyOrCdnHeaders: Object.keys(proxyHints).length ? proxyHints : null,
      },
      allHeaders: headers,
      firstBytesSampleHex: sampleHex,
      firstChunkSizeBytes: sampleLength,
    });
  } catch (err) {
    return Response.json(
      { error: err.message, streamUrl: STREAM_URL },
      { status: 500 }
    );
  }
}

// --- Якщо в проєкті Pages Router (pages/api/stream-check.js), а не App Router: ---
// export default async function handler(req, res) {
//   const response = await fetch(STREAM_URL, { headers: { 'Icy-MetaData': '1' } });
//   const headers = Object.fromEntries(response.headers.entries());
//   res.status(200).json({ headers, isIcecastLike: !!(headers['icy-name'] || headers['icy-br']) });
// }