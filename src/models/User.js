import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  likedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  savedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

const User = mongoose.model('User', userSchema);

// Define isAdmin function for User
User.prototype.isAdmin = function() {
  return this.role === 'admin';
}

export default User;
