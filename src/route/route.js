const express = require('express');
const router = express.Router();
const bookControllers = require('../controllers/bookControllers.js')
const userControllers = require('../controllers/userControllers.js')
const reviewControllers = require('../controllers/reviewControllers.js')
const MW = require('../middlewares/middlewares.js')


router.post('/register', userControllers.createUser)

router.post('/login', userControllers.userLogin)

router.post('/books', MW.isTokenValid, bookControllers.createBook)

router.get('/books', MW.isTokenValid, bookControllers.getBooks)

router.get('/books/:bookId',MW.isTokenValid, bookControllers.getBookWithReviews)

router.put('/books/:bookId',bookControllers.updateBook)

router.delete('/books/:bookId', MW.isTokenValid, MW.isAuthorised,bookControllers.deleteBook)

router.post('/books/:bookId/review' ,reviewControllers.addReview )

router.put('/books/:bookId/review/:reviewId' , reviewControllers.updateReview )

router.delete('/books/:bookId/review/:reviewId' , reviewControllers.deleteReview )


module.exports = router
