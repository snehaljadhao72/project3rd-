const jwt = require("jsonwebtoken");
const bookModel = require("../models/booksModel.js");


const isTokenValid = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send("token is not present")
        let decodedToken = jwt.verify(token, "Project3-78")
        console.log(decodedToken)

        next()

    } catch (err) {
        if (err.message == "invalid token") return res.status(400).send({ status: false, msg: "invalid token" })
        if (err.message == "invalid signature") return res.status(400).send({ status: false, msg: "invalid signature" })
        return res.status(500).send(err.message)
    }
}


//this token is for the purpose of authorisation
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
        console.log(decodedToken)
        if (userId == decodedToken.userId) {
            next()
        }
        else {
            return res.status(403).send("you are not authorized to take this action")//403 for forbiden request
        }
    } catch (err) {
        if (err.message == "invalid token") return res.status(400).send({ status: false, msg: "invalid token" })
        if (err.message == "invalid signiture") return res.status(400).send({ status: false, msg: "invalid signiture" })
        return res.status(500).send(err.message)
    }
}




module.exports = { isTokenValid, isAuthorised }