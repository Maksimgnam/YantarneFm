const User = require('../models/User');
const AuthCode = require('../models/AuthCode');

/**
 * @swagger
 * /api/userByCode/{code}:
 *   get:
 *     summary: Get user by code
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: The code of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Code not found
 *       500:
 *         description: Internal server error
 */
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
