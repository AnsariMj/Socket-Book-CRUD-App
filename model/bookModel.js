const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bookSchema = new Schema({
    bookName: String,
    bookPrice: Number,
})
const Book = mongoose.model('Book', bookSchema)
module.exports = Book