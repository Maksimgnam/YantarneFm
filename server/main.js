const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();
const app = express();
const port = process.env.PORT || 2000;

const getUserByCode = require('./src/routes/getUserByCode')
const likeAudio = require('./src/routes/likeAudioRoute')

app.use(express.json());
app.use(cors());
app.use('/api', getUserByCode);
app.use('/api', likeAudio)


// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Telegram Bot
require('./src/bot/bot');

// Routes (якщо потрібно додавати API)
const telegramRoutes = require('./src/routes/telegramRoutes');
app.use('/telegram', telegramRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущено на порту ${port}`);
});
