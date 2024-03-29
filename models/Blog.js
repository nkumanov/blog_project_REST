
const {model, Schema} = require('mongoose');


const schema = new Schema({
    title: {type: String, required: true, minlength: [2, 'The title must be at least 2 characters long.']},
    subTitle: {type: String, required: true, minlength: [2, 'The title must be at least 2 characters long.']},
    category:{type: String, required: true},
    description: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    image: { type: String },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    addedToFavourites: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = model('Blog', schema)