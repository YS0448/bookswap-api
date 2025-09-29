const express = require('express');
const router = express.Router();
const authenticate  = require('../middleware/authMiddleware');

const { getAllBooks } = require('../controllers/customer/books/getAllBooks')
const {addBook, updateBook, softDeleteBook} = require('../controllers/customer/books/manageBooks');

const { getBookRequests } = require('../controllers/customer/books/getBookRequests');
const { createRequest, updateRequestStatus } = require('../controllers/customer/books/manageRequest')

const { getUserBooks } = require('../controllers/customer/books/getUserBooks')
const { getMyOrders} = require('../controllers/customer/orders/getMyOrders')


// create request
router.post('/book-requests', authenticate, createRequest)
// Get Book requests 
router.get('/book-requests', authenticate, getBookRequests)
// Update book request
router.patch('/book-requests/:request_id', authenticate, updateRequestStatus)


// Get All Books except my
router.get('/books', getAllBooks )


// Add books
router.post('/book/add', authenticate, addBook )
// Get my books
router.get('/users/me/books', authenticate, getUserBooks)
// Update a book
router.patch("/books/:book_id", authenticate, updateBook);
// Soft delete a book
router.delete("/books/:book_id", authenticate, softDeleteBook);


// Get orders
router.get('/users/me/orders', authenticate, getMyOrders)


module.exports = router