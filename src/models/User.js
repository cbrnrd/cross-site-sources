const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  savedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
