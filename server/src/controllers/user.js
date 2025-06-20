const User = require('../models/User');

/**
 * @swagger
 * /api/getUser/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
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
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.getUser = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        if (!id){
            res.status(404).send("ID not found");
            return;
        }
        const user = await User.findOne({id});
        if (!user){
            res.status(404).send("User not found");
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve user');
    }
};
