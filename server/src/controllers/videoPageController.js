const VideoPage = require("../models/VideoPage");

exports.videoPage = async (req, res) => {
    try {
        const {text, url} = req.body;
        VideoPage.replaceOne(
            {},
            {text, url},
            {upsert: true}
        ).then(result => {
            console.log("Документ замінено або створено:", result);
            res.status(200).json({message: "Success! :)"});
        }).catch(err => {
            console.error("Помилка при заміні:", err);
            res.status(500).json({message: "Error :("});
        });
    } catch (error) {
        console.log("Error during updating video page. Error:", error);
        res.status(500).json({message: 'Err0r. Look in console for more information :('});
    };
};

exports.getVideoPage = async (req, res) => {
    try {
        const news = await VideoPage.find();
        res.json(news);
    } catch (error) {
        console.log("Error during getting videoPage:", error);
        res.status(500).json("Error during getting videoPage");
    };
};