// Заявки «Замовити рекламу» з сайту → повідомлення в Telegram адміністраторам через бота радіо.
//
// Змінні середовища (Render → Environment):
//   ADS_CHAT_ID=123456789            кому надсилати заявки: ID користувача або групи (кілька — через кому).
//                                    Людина має хоча б раз написати боту /start, а групу — додати бота в учасники.
//                                    Дізнатися ID: написати боту /chatid (в особистих чи в групі).

const { bot } = require('../bot/bot');

const LIMITS = { name: 80, company: 120, phone: 40, email: 120, contactVia: 40, start: 60, budget: 60, about: 2000 };
const RATE = { windowMs: 10 * 60 * 1000, max: 5 }; // не більше 5 заявок з однієї IP за 10 хвилин
const hits = new Map();

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < RATE.windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // захист від розростання пам'яті
  return list.length > RATE.max;
}

async function createAdRequest(req, res) {
  try {
    const body = req.body || {};

    // пастка для ботів: приховане поле, яке людина не заповнює
    if (body.website) return res.status(200).json({ ok: true });

    const chatIds = String(process.env.ADS_CHAT_ID || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!chatIds.length) {
      console.error('❌ ad-request: не задано ADS_CHAT_ID');
      return res.status(503).json({ ok: false, message: 'Прийом заявок тимчасово не налаштовано' });
    }

    if (rateLimited(clientIp(req))) {
      return res.status(429).json({ ok: false, message: 'Забагато заявок, спробуйте трохи пізніше' });
    }

    const d = {};
    for (const [k, n] of Object.entries(LIMITS)) d[k] = clip(body[k], n);
    const types = (Array.isArray(body.types) ? body.types : String(body.types || '').split(','))
      .map(t => clip(t, 60)).filter(Boolean).slice(0, 8);

    if (d.name.length < 2 || d.phone.replace(/\D/g, '').length < 7 || !types.length) {
      return res.status(400).json({ ok: false, message: 'Вкажіть ім’я, телефон і хоча б один тип реклами' });
    }

    const lines = [
      '📻 <b>Нова заявка на рекламу — Yantarne.FM</b>',
      '',
      `🎯 <b>Тип:</b> ${esc(types.join(', '))}`,
      `👤 <b>Ім’я:</b> ${esc(d.name)}`,
      d.company && `🏢 <b>Компанія:</b> ${esc(d.company)}`,
      `📞 <b>Телефон:</b> ${esc(d.phone)}`,
      d.email && `✉️ <b>Email:</b> ${esc(d.email)}`,
      d.contactVia && `💬 <b>Зручно зв’язатися:</b> ${esc(d.contactVia)}`,
      d.start && `🗓 <b>Старт:</b> ${esc(d.start)}`,
      d.budget && `💰 <b>Бюджет:</b> ${esc(d.budget)}`,
      d.about && `\n📝 <b>Що рекламуємо:</b>\n${esc(d.about)}`,
      '',
      `<i>${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}</i>`
    ].filter(Boolean).join('\n');

    const results = await Promise.allSettled(
      chatIds.map(id => bot.sendMessage(id, lines, { parse_mode: 'HTML', disable_web_page_preview: true }))
    );
    const sent = results.filter(r => r.status === 'fulfilled').length;
    results.forEach((r, i) => { if (r.status === 'rejected') console.error(`❌ ad-request: не вдалося надіслати в ${chatIds[i]}:`, r.reason?.message) });

    if (!sent) return res.status(502).json({ ok: false, message: 'Не вдалося передати заявку, спробуйте ще раз' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ ad-request:', err);
    return res.status(500).json({ ok: false, message: 'Помилка сервера' });
  }
}

module.exports = { createAdRequest };
