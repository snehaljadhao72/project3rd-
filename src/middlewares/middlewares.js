const jwt = require("jsonwebtoken");
const bookModel = require("../models/booksModel.js");


//this function is for the purpose for the authentication
const isTokenValid = function (req, res, next) {
    try{
    let token = req.headers["x-api-key"]
    if(!token) return res.status(400).send("token is not present")
     jwt.verify(token, "Project3-78" , (err , Token)=>{
          if(err) return res.status(401).send({status:false, msg:"invalid token"})
          req.decodedToken = Token
    })
        next()
}catch (err) {
    return res.status(500).send(err.message)
}}


//this token is for the purpose of authorisation
const isAuthorised = async function (req, res, next) {
    try{
    bookId = req.params.bookId;
    decodedToken = req.decodedToken
    let requiredBook = await bookModel.findById(bookId)
    if(!requiredBook){
        return res.status(404).send({sta})
    }
    // let authorId = requiredBlog.authorId
    // let token = req.headers["x-api-key"]
    // let decodedToken = jwt.verify(token, "Project-1-Blogging-site")
    // console.log(decodedToken)
    // if (authorId == decodedToken.authorId) {
        next()
    // }
    
        return res.status(403).send("you are not authorized to take this action")//403 for forbiden request
    }catch (err) {
        return res.status(500).send({status:false , message : err.message})
    }
}



module.exports={isTokenValid, isAuthorised}