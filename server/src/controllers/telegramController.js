const fs = require('fs');
const path = require('path');
const { listFilesInFolder, downloadFile } = require('../services/driveService');
const User = require('../models/User')

const FOLDER_ID = '15M1t-6FAJh1TSDar9Sl-UMVmbkoon8ud';

async function handleDownloadAudio(bot, chatId, songName) {
  try {
    const songs = await listFilesInFolder(FOLDER_ID);
    
    if (!songs){
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    const song = songs.find(s => s.name === songName);
    if (!song) {
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    const fileExt = path.extname(song.name) || '.mp3';
    const localPath = path.join(__dirname, `../../temp_${song.id}${fileExt}`);

    await downloadFile(song.id, localPath);

    const sentMessage = await bot.sendAudio(chatId, fs.createReadStream(localPath), { title: song.name });
    console.log('message_id:', sentMessage.message_id);

    fs.unlinkSync(localPath);

    return sentMessage.message_id

  } catch (error) {
    console.log('Unexpected error:', error)
  }
}

async function handleDeleteMessage(bot, chatId, messageId){
  try {
    await bot.deleteMessage(chatId, messageId);
  } catch (error){
    console.log('Error during deleting message:', error)
  }
}

async function handleGetSong(bot, chatId) {
  try {
    const songs = await listFilesInFolder(FOLDER_ID);
    if (!songs.length) {
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    const song = songs[56];
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
    const user = await User.findOne({telegramId: chatId});

    if (user) {
      console.log(user.savedSongs);
    } else {
      return bot.sendMessage(chatId, 'Не знайдено пісень')
    }

    if (!songs.length) {
      return bot.sendMessage(chatId, '❌ Немає доступних пісень.');
    }

    if (user.savedSongs.length) {
      const message = user.savedSongs.map((s, i) => `${i + 1}. ${s}`).join('\n');
      return bot.sendMessage(chatId, `Список пісень:\n${message}`);
    } else {
      return bot.sendMessage(chatId, 'Не знайдено пісень')
    }
  } catch (error) {
    console.error('❌ Telegram Bot Error:', error);
    bot.sendMessage(chatId, '⚠️ Помилка при отриманні пісень.');
  }
}

module.exports = { handleGetSong, handleGetSongs, handleDownloadAudio, handleDeleteMessage };
