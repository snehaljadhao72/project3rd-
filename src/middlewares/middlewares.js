const jwt = require("jsonwebtoken");
const bookModel = require("../models/booksModel.js");
const userModel = require("../models/userModel.js");

//================================Authentication=======================================//
const isTokenValid = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, message: "token is not present" })
        jwt.verify(token, "Project3-78")
        next()
    } catch (err) {
        if (err.message == "invalid token") return res.status(401).send({ status: false, msg: "invalid token" })
        if (err.message == "jwt expired") return res.status(401).send({ status: false, msg: "jwt expired" })
        if (err.message == "invalid signature") return res.status(401).send({ status: false, msg: "invalid signature" })
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=====================================Authorisation=======================================//
const isAuthorised = async function (req, res, next) {
    try {
        bookId = req.params.bookId;
        let requiredBook = await bookModel.findById(bookId)
        if (!requiredBook) {
            return res.status(404).send("No such book present ")
        }
        const userId = requiredBook.userId
        const token = req.headers["x-api-key"]
        const decodedToken = jwt.verify(token, "Project3-78")
        if (userId == decodedToken.userId) {
            next()
        }
        else {
            return res.status(403).send("you are not authorized to take this action")
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// const isAuthorised2 = async function (req, res, next) {
//     try{
//     reviewId = req.params.reviewId;
//     let requiredReview = await reviewModel.findById(reviewId)
//     if(!requiredReview){
//         return res.status(404).send("No such review present ")
//     }
//     const user = await userModel.findOne({name:requiredReview.reviewedBy})
//     const  token = req.headers["x-api-key"]
//     const decodedToken = jwt.verify(token, "Project3-78")
//     if (userId == decodedToken.userId) {
//         next()
//     }
//     else {
//         return res.status(403).send("you are not authorized to take this action")
//     }}catch (err) {
//     if(err.message=="invalid token") return res.status(400).send({status:false, msg:"invalid token"})
//     if(err.message=="invalid signiture") return res.status(400).send({status:false, msg:"invalid signiture"})
//         return res.status(500).send(err.message)
//     }
// }



module.exports = { isTokenValid, isAuthorised }
