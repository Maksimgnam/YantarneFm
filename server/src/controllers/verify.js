const User = require('../models/User');
const AuthCode = require('../models/AuthCode');

exports.getUserByCode = async (req, res) => {
    try {
        const code_info = await AuthCode.findOne({ code: req.params.code });
        if (!code_info){
            res.status(404).send('Code not found');
            return;
        }
        const tg_id = code_info.telegramId
        const user = await User.findOne({telegramId: tg_id})
        res.status(200).json(user.id);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve user');
    }
};
