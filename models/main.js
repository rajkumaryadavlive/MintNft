var mongoose = require("mongoose");
var artSchema = new mongoose.Schema({
    allDetails: String,
    artistName: String,
    artName: String,
    image_uri: String,
    otherDetails: String,
    year: String,
    technique: String
})

module.exports = mongoose.model("Art", artSchema)