const express = require('express');
const router = express.Router();
const bookControllers = require('../controllers/bookControllers.js')
const userControllers = require('../controllers/userControllers.js')


router.post('/register', userControllers.createUser)

router.post('/login', userControllers.userLogin)

router.post('/books', bookControllers.createBook)

router.get('/books', bookControllers.getBooks)

router.post('/books', bookControllers.getBooks)

router.put('/books/:bookId', bookControllers.updateBook)








module.exports = router
