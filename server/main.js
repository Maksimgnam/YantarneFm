const express = require('express');
const fs = require('fs');
const cors = require("cors");
const { google } = require('googleapis');
const dotenv = require('dotenv');
const TelegramBot = require("node-telegram-bot-api");
const path = require('path');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 2000;
const token_tg = process.env.TOKEN_TG;

const bot = new TelegramBot(token_tg, { polling: true });

const auth = new google.auth.GoogleAuth({
  keyFile: './cred.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

async function listFilesInFolder(folderId) {
  const authClient = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: authClient });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  return res.data.files;
}

async function downloadFile(fileId, destPath) {
  const authClient = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: authClient });

  const dest = fs.createWriteStream(destPath);

  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream', auth: authClient }
  );

  return new Promise((resolve, reject) => {
    res.data
      .on('end', () => {
        resolve(destPath);
      })
      .on('error', err => {
        reject(err);
      })
      .pipe(dest);
  });
}

const FOLDER_ID = '15M1t-6FAJh1TSDar9Sl-UMVmbkoon8ud';

bot.onText(/^\/getsong$/, async (msg) => {
  const chatId = msg.chat.id.toString();
  try {
    const songs = await listFilesInFolder(FOLDER_ID);
    if (!songs.length) {
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    const song = songs[0];
    const fileExt = path.extname(song.name) || '.mp3';
    const localPath = path.join(__dirname, `temp_${song.id}${fileExt}`);

    await downloadFile(song.id, localPath);

    await bot.sendAudio(chatId, fs.createReadStream(localPath), {
      title: song.name,
    });

    fs.unlinkSync(localPath);

  } catch (error) {
    console.error('❌ Telegram Bot Error:', error);
    bot.sendMessage(chatId, '⚠️ Помилка при отриманні пісень.');
  }
});

bot.onText(/^\/getsongs$/, async (msg) => {
  const chatId = msg.chat.id.toString();
  try {
    const songs = await listFilesInFolder(FOLDER_ID);
    if (!songs.length) {
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    let message = 'Список пісень:\n';
    songs.forEach((song, index) => {
      message += `${index + 1}. ${song.name}\n`;
    });

    bot.sendMessage(chatId, message);

  } catch (error) {
    console.error('❌ Telegram Bot Error:', error);
    bot.sendMessage(chatId, '⚠️ Помилка при отриманні пісень.');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущено на порту ${port}`);
});
