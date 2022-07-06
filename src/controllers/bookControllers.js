const bookModel = require("../models/booksModel.js")
const mongoose = require("mongoose");


const createBook =  async function(req,res){
    try{
    const data = req.body;
    let user = await bookModel.create(data)
    res.status(201).send({status:true, message:"Success", data : user})
}catch(err){
    res.status(500).send({status:false, message: err.message})
}}

const getBooks = async function (req, res) {
    try {
        const data = req.query
        let allBooks = await bookModel.find({ $and: [data,{ isDeleted: false }] }).select({
        title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1})
        allBooks.sort((a,b) => a.title.localeCompare(b.title))
        console.log(allBooks)
        if (allBooks.length > 0) return res.status(200).send({ status: true, data: allBooks })
        return res.status(404).send({ status: false, msg: "No Books Found" })
    } catch (err) { return res.status(500).send(err.message) }
}


const updateBook = async function(req,res){
    try{
    let bookId = req.params.bookId
    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false, message:"invalid BookId"})
    const data = req.body
    const myFilter = {
        _id : bookId,
        isDeleted: false
    }
    const updatedBook = await bookModel.findOneAndUpdate(myFilter,data,{new:true})
    if(!updatedBook)res.status(404).send({status:false, message:"No such book present"})
    return res.status(200).send({ status: true, message:"Success",data:updatedBook  })
} catch (err) { return res.status(500).send(err.message) }}

const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let book = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true })
       if (!book) return res.status(404).send({ status: false, msg: "Book is not present" })
        return res.status(200).send({message:"The book has been deleted"})
    } catch (err) { return res.status(500).send({error:err.message}) }
}


module.exports = {createBook,getBooks,updateBook,deleteBook}