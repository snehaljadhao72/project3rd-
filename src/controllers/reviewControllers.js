const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/booksModel.js")
const mongoose = require("mongoose");

const addReview = async function(req,res){
//     try{
//     const bookId = req.params.bookId;
//     if(!bookId)return res.status(400).send({status:false, message:"Please enter bookId"})
//     if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false, message:"invalid BookId"})
//     let requiredBook = await bookModel.findOne({_id:bookId,isDeleted:false})
//     if(!requiredBook) return res.status(404).send({status:false, message:"No Such book present"})
//     const data = req.body
//     const newData = {bookId:bookId,...data}
//     const newReview = await reviewModel.create(newData)
//     const reviewUpdate = await bookModel.findOneAndUpdate({_id:bookId},{reviews:reviews+1})
//     res.status(201).send({status:true, message:"Success", data : newReview})
// }catch(err){
//     res.status(500).send({status:false, message: err.message})
// }}

let bookId = req.params.bookId;
    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false, message:"invalid BookId"})
    let requiredBook = await bookModel.findOne({_id: bookId, isDeleted: false})
    if(!requiredBook) return res.status(400).send({status:false, message:"No Such book present"})
  let data = req.body
  let bookList = await bookModel.findById({_id:bookId}).select({__v:0})
  let reviewsData = await reviewModel.create(data)
  if (reviewsData) bookList.reviews++
  const bookData = {...bookList,reviewsData:reviewsData }
  res.send({status: true, data:bookData})

    
}



module.exports = {addReview}