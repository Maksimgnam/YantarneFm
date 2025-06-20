const AuthCode = require('../models/AuthCode');

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createAuthCode(telegramId) {
  const code = generateCode();

  await AuthCode.create({
    telegramId,
    code,
    expiresAt: new Date(Date.now() + 60 * 1000)
  });

  return code;
}


module.exports = { createAuthCode };