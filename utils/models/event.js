var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
// define the schema for our user model
mongoose.connect(require("../../config/app").db.connectionUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var eventSchema = mongoose.Schema({
  id: String,
  user: {
    id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String }
  },
  latitude: String,
  longitude: String,
  location: String,
  radius: Number,
  description: String,
  media: {
    dest: { type: String},
    type: { type: String},
    ext:  { type: String}
  },
  time: { type: Date, default: (new Date()).toISOString()},
  room: String ,
  comments: Array,
  likes: String,
  createdAt: String,
  type: String
});

module.exports = mongoose.model("event", eventSchema);

// create the model for users and expose it to our app
