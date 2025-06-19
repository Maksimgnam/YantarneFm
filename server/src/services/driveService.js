const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const auth = require('../config/googleDrive');

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
      .on('end', () => resolve(destPath))
      .on('error', reject)
      .pipe(dest);
  });
}

module.exports = { listFilesInFolder, downloadFile };
