const TelegramBot = require("node-telegram-bot-api");
const dotenv = require('dotenv');
const { handleGetSong, handleGetSongs } = require('../controllers/telegramController');
const { startAuth, handleRegistration } = require('../controllers/authController');
const { handleRegistrationStep } = require('../state/registrationState');

dotenv.config();

const bot = new TelegramBot(process.env.TOKEN_TG, { polling: true });

bot.onText(/^\/getsong$/, (msg) => {
  const chatId = msg.chat.id.toString();
  handleGetSong(bot, chatId);
});

bot.onText(/^\/getmysongs$/, (msg) => {
  const chatId = msg.chat.id.toString();
  handleGetSongs(bot, chatId);
});

bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  await startAuth(bot, chatId, user);
});

// /chatid — показує ID чату (потрібен для ADS_CHAT_ID: куди надсилати заявки на рекламу)
bot.onText(/^\/chatid(@\w+)?$/, (msg) => {
  bot.sendMessage(msg.chat.id, `ID цього чату: ${msg.chat.id}`);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const user = msg.from;

  // службові повідомлення без тексту (фото, вхід у групу тощо) та повідомлення в групах — ігноруємо
  if (!text || msg.chat.type !== 'private') return;
  if (text.startsWith('/')) return;

  if (handleRegistrationStep.has(user.id)) {
    return handleRegistration(bot, chatId, user, text);
  }

  bot.sendMessage(chatId, '❓ Команда не розпізнана.');
});

module.exports = {bot}