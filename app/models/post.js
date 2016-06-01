var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  post: { type: String, required: true },
  name: { type: String, required: true },
  mail: { type: String, required: true },
  description : { type : String, required: true}
});

module.exports = mongoose.model('Post', PostSchema);