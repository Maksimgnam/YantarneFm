const User = require('../models/User');

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
