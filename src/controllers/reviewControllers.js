const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/booksModel.js")
const mongoose = require("mongoose");

const addReview = async function(req,res){
    let data = req.params.bookId;
    if(!mongoose.Types.ObjectId.isValid(data)) return res.status(400).send({status:false, message:"invalid BookId"})
    data.isdeleted = false;
    let requiredBook = await bookModel.findOne(data)
    if(!requiredBook) return res.status(400).send({status:false, message:"No Such book present"})
    res.send(requiredBook)

    
}