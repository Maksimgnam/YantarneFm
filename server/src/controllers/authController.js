const User = require('../models/User');
const { createAuthCode, verifyAuthCode } = require('../services/codeService');
const escapeMarkdown = require('../utils/escapeMarkdown');
const { handleRegistrationStep } = require('../state/registrationState');


async function startAuth(bot, chatId, telegramUser) {
    const { id, first_name } = telegramUser;
  
    const rawUsername = first_name || 'Користувач';
    const safeUsername = escapeMarkdown(rawUsername);
  
  
    const existingUser = await User.findOne({ telegramId: id });
  
    if (existingUser) {
        const code = await createAuthCode(id);
        const safeCode = escapeMarkdown(code.toString())    
        const welcomeMsg = `👋 Вітаємо назад, ${safeUsername}\nВаш код для входу: \`${safeCode}\``;
        bot.sendMessage(chatId, welcomeMsg, { parse_mode: "MarkdownV2" });
    } else {
        console.log('Its here')
        handleRegistrationStep.set(id, { step: 'email' });
  
        const regMsg = `🆕 Обліковий запис для *${safeUsername}* не знайдено\\.\n\nВведіть свій *email* для реєстрації:`;
        bot.sendMessage(chatId, regMsg, { parse_mode: "MarkdownV2" });
    }
}
  
async function handleRegistration(bot, chatId, telegramUser, text) {
  const { id } = telegramUser;
  const stepData = handleRegistrationStep.get(id);

  if (!stepData) return;

  if (stepData.step === 'email') {
    stepData.email = text.trim();
    stepData.step = 'password';
    handleRegistrationStep.set(id, stepData);
    return bot.sendMessage(chatId, `🔒 Введіть пароль для вашого облікового запису:`);
  }

  if (stepData.step === 'password') {
    const password = text.trim();

    const newUser = await User.create({
      telegramId: id,
      username: telegramUser.username || '',
      firstName: telegramUser.first_name || '',
      lastName: telegramUser.last_name || '',
      email: stepData.email,
      password // ⚠️ У продакшені: bcrypt.hash()
    });

    const code = await createAuthCode(id);
    const safeCode = escapeMarkdown(code.toString());

    handleRegistrationStep.delete(id);

    return bot.sendMessage(chatId, `✅ Обліковий запис створено\nВаш код підтвердження: \`${safeCode}\``, {
      parse_mode: "MarkdownV2"
    });
  }
}


module.exports = { startAuth, handleRegistration };
