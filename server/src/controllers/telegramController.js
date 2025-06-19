const fs = require('fs');
const path = require('path');
const { listFilesInFolder, downloadFile } = require('../services/driveService');

const FOLDER_ID = '15M1t-6FAJh1TSDar9Sl-UMVmbkoon8ud';

async function handleGetSong(bot, chatId) {
  try {
    const songs = await listFilesInFolder(FOLDER_ID);
    if (!songs.length) {
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    const song = songs[0];
    const fileExt = path.extname(song.name) || '.mp3';
    const localPath = path.join(__dirname, `../../temp_${song.id}${fileExt}`);

    await downloadFile(song.id, localPath);
    await bot.sendAudio(chatId, fs.createReadStream(localPath), { title: song.name });
    fs.unlinkSync(localPath);

  } catch (error) {
    console.error('❌ Telegram Bot Error:', error);
    bot.sendMessage(chatId, '⚠️ Помилка при отриманні пісень.');
  }
}

async function handleGetSongs(bot, chatId) {
  try {
    const songs = await listFilesInFolder(FOLDER_ID);
    if (!songs.length) {
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    const message = songs.map((s, i) => `${i + 1}. ${s.name.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1')}`).join('\n');
    bot.sendMessage(chatId, `Список пісень:\n${message}`);

  } catch (error) {
    console.error('❌ Telegram Bot Error:', error);
    bot.sendMessage(chatId, '⚠️ Помилка при отриманні пісень.');
  }
}

module.exports = { handleGetSong, handleGetSongs };
