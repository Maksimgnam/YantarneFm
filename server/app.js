const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

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

  const files = res.data.files;

  if (files.length) {
    console.log(`📁 Файли в папці ${folderId}:`);
    return files.map(file => {
      const viewLink = `https://drive.google.com/file/d/${file.id}/view`;
      console.log(`${file.name} (${file.id}) - ${viewLink}`);
      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        viewLink,
      };
    });
  } else {
    console.log('❌ Папка порожня або недоступна.');
    return [];
  }
}

// Folder ID твоєї папки
const FOLDER_ID = '15M1t-6FAJh1TSDar9Sl-UMVmbkoon8ud';

app.get('/files', async (req, res) => {
  try {
    const files = await listFilesInFolder(FOLDER_ID);
    res.json({ files });
  } catch (err) {
    console.error('⛔️ Помилка:', err.message);
    res.status(500).json({ error: 'Не вдалося отримати список файлів' });
  }
});

app.get('/', (req, res) => {
  res.send('📂 Google Drive File Server працює!');
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});
