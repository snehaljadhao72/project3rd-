const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/booksModel.js")
const mongoose = require("mongoose");

const addReview = async function (req, res) {

    let bookId = req.params.bookId;

    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
    let requiredBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!requiredBook) return res.status(400).send({ status: false, message: "No Such book present" })
    let data = req.body
    let bookList = await bookModel.findById({ _id: bookId })
    let reviewsData = await reviewModel.create(data)
    if (reviewsData) bookList.reviews++
    // const bookData = {

    //     reviewsData
    // }
    res.send({ bookList, reviewsData })

}

module.exports.addReview = addReview