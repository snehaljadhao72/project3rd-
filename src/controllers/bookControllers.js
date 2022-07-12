const bookModel = require("../models/booksModel.js")
const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel.js");
const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const myISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
const myDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const createBook = async function (req, res) {
    try {
        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body
        //=========================validations==============================================//
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please enter details" })

        if (!isValid(title)) return res.status(400).send({ status: false, message: "please enter title" })
        const usedTitle = await bookModel.findOne({ title: title })
        if (usedTitle) return res.status(409).send({ status: false, message: " book is already exist" })

        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "please enter book excerpt" })

        if (!isValid(userId)) return res.status(400).send({ status: false, message: "please enter userId" })
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Please Enter Valid userId" })
        const userIdpresent = await userModel.findById(userId)
        if (!userIdpresent) return res.status(404).send({ status: false, message: "No such user present" })

        //======================Authorization==========================//
        let token = req.headers["x-api-key"]
        let myToken = jwt.verify(token, "Project3-78")
        if (myToken.userId != userId) {
            return res.status(403).send({ status: false, message: " you are not authorised to take this action" })
        }

        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "please enter ISBN" })
        if (!myISBN.test(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })
        const usedISBN = await bookModel.findOne({ ISBN: ISBN })
        if (usedISBN) return res.status(409).send({ status: false, message: " ISBN is already exist" })

        if (!isValid(category)) return res.status(400).send({ status: false, message: "please enter category" })

        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "please enter category" })

        if (releasedAt === null || releasedAt === undefined || releasedAt.trim().length == 0) return res.status(400).send({ status: false, message: "please enter date of release" })
        if (!myDate.test(releasedAt)) return res.status(400).send({ status: false, message: "please enter date in yyyy-mm-dd format only" })

        //======================================Creating user==========================//
        let book = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: book })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getBooks = async function (req, res) {
    try {
        const data = req.query

        if (data.userId) {
        if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "invalid UserId" })
        const userIdpresent = await userModel.findById(userId)
        if (!userIdpresent) return res.status(404).send({ status: false, message: "No such userId" })
        }

        if (data.category) {
            if (!data.category.trim()) return res.status(400).send({ status: false, message: "invalid category" })
        }
        if (data.subcategory) {
            if (!data.subcategory.trim()) return res.status(400).send({ status: false, message: "invalid subcategory" })
        }
        let allBooks = await bookModel.find({ $and: [data, { isDeleted: false }] }).select({
            title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1
        })
        allBooks.sort((a, b) => a.title.localeCompare(b.title))
        if (allBooks.length > 0) return res.status(200).send({ status: true, message: 'Books list', data: allBooks })
        return res.status(404).send({ status: false, msg: "No Books Found" })
    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


const getBookWithReviews = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
        const existingBook = await bookModel.findOne({_id:bookId , isDeleted: false}).lean()
        if (!existingBook) return res.status(404).send({ status: false, message: "No such book present" })
        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })
        existingBook.reviewsData = reviewsData
        return res.status(200).send({ status: true, message: 'Books list', data: existingBook })
    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
        const existingBook = await bookModel.findById(bookId)
        if (!existingBook) return res.status(404).send({ status: false, message: "No such book present" })

        const data = req.body

        const title = data.title;
        
        if (title != null) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "please enter title" })
            const existingTitle = await bookModel.findOne({ title: title })
            if (existingTitle) return res.status(409).send({ status: false, message: "This title is already exist" })
        }

        if (data.excerpt != null) {
            if (!isValid(data.excerpt)) return res.status(400).send({ status: false, message: "please enter book excerpt" })
        }

        const ISBN = data.ISBN;
        if (ISBN != null) {
            if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "please enter ISBN" })
            if (!myISBN.test(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })
            const usedISBN = await bookModel.findOne({ ISBN: ISBN })
            if (usedISBN) return res.status(409).send({ status: false, message: " ISBN is already exist" })
            if (ISBN.length == 0) return res.status(409).send({ status: false, message: " ISBN is Not VAlid" })
        }

        const releasedAt = data.releasedAt
        if (releasedAt) {
            if (releasedAt === null || releasedAt === undefined || releasedAt.trim().length === 0) return res.status(400).send({ status: false, message: "please enter date of release" })
            if (!myDate.test(releasedAt)) return res.status(400).send({ status: false, message: "release date should be in yyyy-mm-dd format only" })
        }

        const myFilter = {
            _id: bookId,
            isDeleted: false
        }
        const updatedBook = await bookModel.findOneAndUpdate(myFilter, data, { new: true })
        if (!updatedBook) res.status(404).send({ status: false, message: "No such book present" })
        return res.status(200).send({ status: true, message: "Success", data: updatedBook })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
        let book = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
        if (!book) return res.status(404).send({ status: false, message: "Book is not present" })
        return res.status(200).send({ status: true, message: "The book has been Deleted" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createBook, getBooks, updateBook, deleteBook, getBookWithReviews }
