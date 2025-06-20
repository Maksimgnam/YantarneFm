const User = require('../models/User')
const { handleDownloadAudio } = require('../controllers/telegramController')
const {bot} = require('../bot/bot')

exports.likeAudio = async (req, res) => {
    try {
        const {nameAudio, userId} = req.body;
        const user = await User.findOne({id: userId});
        const chatId = user.telegramId;
        user.savedSongs.push(nameAudio)
        await user.save();
        handleDownloadAudio(bot, chatId, nameAudio)
        res.status(200).json({message: 'Audio liked successfully'});
    } catch (error){
        console.log('Error during likeAudio:', error)
        res.status(500).json({message: 'Internal server error'});
    }
}