const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/booksModel.js")
const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const addReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
    const requiredBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!requiredBook) return res.status(404).send({ status: false, message: "No Such book present" })
    const data = req.body
    const { reviewedBy, rating, review } = data

    if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please Enter Reviewr's name" })

    if (!isValid(review)) return res.status(400).send({ status: false, message: "Please Enter Review" })

    if (!(/^[1-5]$/).test(rating)) return res.status(400).send({ status: false, message: "Enter Rating Between 1 to 5" })

    data.bookId = bookId
    data.reviewedAt = new Date();
    const reviewsData = await reviewModel.create(data)
    const totalReview = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()
    const book = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { reviews: totalReview }, { new: true }).lean()
    book.reviewsData = reviewsData
    return res.status(201).send({ status: true, message: 'Success', data: book })
  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}


const updateReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
    const requiredBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
    if (!requiredBook) return res.status(404).send({ status: false, message: "No Such book present" })
    const reviewId = req.params.reviewId;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "invalid reviewId" })
    const requiredReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
    if (!requiredReview) return res.status(404).send({ status: false, message: "No Such review present" });

    const data = req.body

    const { reviewedBy, rating, review } = data

    if (reviewedBy) {
      if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please Enter Reviewr's name" })
    }

    if (review) {
      if (!isValid(review)) return res.status(400).send({ status: false, message: "Please Enter Review" })
    }

    if (rating) {
      if (!(/^[1-5]$/).test(rating)) return res.status(400).send({ status: false, message: "Enter Rating Between 1 to 5" })
    }
    const myFilter = {
      _id: reviewId,
      isDeleted: false
    }
    const updatedReview = await reviewModel.findOneAndUpdate(myFilter, data, { new: true }).lean()
    requiredBook.reviewsData = updatedReview
    return res.status(200).send({ status: true, message: "Success", data: requiredBook })
  } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


const deleteReview = async function (req, res) {
  try {
    let bookId = req.params.bookId
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
    const requiredBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!requiredBook) return res.status(400).send({ status: false, message: "No Such book present" })
    const reviewId = req.params.reviewId;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "invalid reviewId" })
    const requiredReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
    if (!requiredReview) return res.status(404).send({ status: false, message: "No Such review present" });

    const deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
    const totalReview = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()
    const book = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { reviews: totalReview })
    return res.status(200).send({ status: true, message: "The review has been Deleted" })
  } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


module.exports = { addReview, updateReview, deleteReview }
