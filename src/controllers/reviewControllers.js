const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/booksModel.js")
const mongoose = require("mongoose");

const addReview = async function(req,res){
  try{
const  bookId = req.params.bookId;
    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false, message:"invalid BookId"})
    const requiredBook = await bookModel.findOne({_id: bookId, isDeleted: false})
    if(!requiredBook) return res.status(400).send({status:false, message:"No Such book present"})
    const data = req.body
    data.bookId = bookId
    const  reviewsData = await reviewModel.create(data)
    const totalReview = await reviewModel.find({bookId : bookId }).count()
    const book = await bookModel.findOneAndUpdate({_id:bookId,isDeleted: false},{reviews:totalReview}).lean()
   book.reviewsData = reviewsData 
  return res.status(201).send({status: true, data:book})
  }catch(err){
      res.status(500).send({status:false, message: err.message})
  }

}

const updateReview = async function (req,res){
  try{
    const bookId = req.params.bookId;
    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false, message:"invalid BookId"})
    const requiredBook = await bookModel.findOne({_id: bookId, isDeleted: false})
    if(!requiredBook) return res.status(400).send({status:false, message:"No Such book present"})
    const reviewId =  req.params.reviewId;
    if(!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({status:false, message:"invalid reviewId"})
    const requiredReview = await reviewModel.findOne({_id: reviewId, isDeleted: false})
    if(!requiredReview) return res.status(400).send({status:false, message:"No Such review present"});

    const data = req.body
    const myFilter = {
      _id : reviewId,
      isDeleted: false
  }
  const updatedReview = await bookModel.findOneAndUpdate(myFilter,data,{new:true})
  return res.status(200).send({ status: true, message:"Success",data:updatedReview  })
} catch (err) { return res.status(500).send({status: false , message : err.message}) }}


const deleteReview = async function (req, res) {
  try {
      let bookId = req.params.bookId
      if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false, message:"invalid BookId"})
    const requiredBook = await bookModel.findOne({_id: bookId, isDeleted: false})
    if(!requiredBook) return res.status(400).send({status:false, message:"No Such book present"})
    const reviewId =  req.params.reviewId;
    if(!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({status:false, message:"invalid reviewId"})
    const requiredReview = await reviewModel.findOne({_id: reviewId, isDeleted: false})
    if(!requiredReview) return res.status(400).send({status:false, message:"No Such review present"});
    const deletedReview = await reviewModel.findOneAndUpdate({_id:reviewId},{ isDeleted: true, deletedAt: new Date()},{new:true})
    return res.status(200).send({ status: true, message:"The review has been deleted"  })
  } catch (err) { return res.status(500).send({status:false , message:err.message}) }
} 


module.exports = {addReview,updateReview,deleteReview}