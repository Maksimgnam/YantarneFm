const User = require('../models/User')
const { handleDownloadAudio, handleDeleteMessage } = require('../controllers/telegramController')
const {bot} = require('../bot/bot')

/**
 * @swagger
 * /api/addSong:
 *   post:
 *     summary: Like an audio file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameAudio:
 *                 type: string
 *                 description: The name of the audio file to like
 *               userId:
 *                 type: string
 *                 description: The ID of the user liking the audio
 *     responses:
 *       200:
 *         description: Audio liked successfully
 *       400:
 *         description: Audio is already liked
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

exports.likeAudio = async (req, res) => {
    try {
        const { nameAudio, userId } = req.body;
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const chatId = user.telegramId;
        const isLiked = user.savedSongs.some(song => song.nameAudio === nameAudio);
        if (isLiked) {
            const messageId = user.savedSongs.find(song => song.nameAudio === nameAudio).idMessage;
            const index = user.savedSongs.findIndex(song => song.nameAudio === nameAudio);
            user.savedSongs.splice(index, 1);
            await user.save();
            await handleDeleteMessage(bot, chatId, messageId);
            res.status(200).json({message: 'Song deleted successfully'})
        } else {
            const idMessage = await handleDownloadAudio(bot, chatId, nameAudio);

            if (!idMessage) {
                return res.status(500).json({ message: 'Failed to send audio' });
            }

            user.savedSongs.push({ nameAudio, idMessage });
            await user.save();

            res.status(200).json({ message: 'Audio liked successfully' });
        }
    } catch (error) {
        console.log('Error during likeAudio:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
