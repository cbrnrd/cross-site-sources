import mongoose from "mongoose";
import commentSchema from "./Comment.js";
const Schema = mongoose.Schema;

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

// Add an index to the title and content fields
articleSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Article', articleSchema);
