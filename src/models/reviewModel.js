const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,

    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: String,
    
    isDeleted: {
        type: Boolean,
        default: false
    }



}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)