var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  title: String,
  description: String
});

module.exports = mongoose.model("Post", postSchema);
