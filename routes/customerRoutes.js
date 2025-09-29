const express = require('express');
const router = express.Router();
const authenticate  = require('../middleware/authMiddleware');
const { addBook } = require('../controllers/customer/books/addBook')
const { getAllBooks } = require('../controllers/customer/books/getAllBooks')
const { createRequest, getBookRequests, updateRequestStatus } = require('../controllers/customer/books/manageRequest')
const { getUserBooks } = require('../controllers/customer/books/getUserBooks')
const { getMyOrders} = require('../controllers/customer/orders/getMyOrders')

// Add books
router.post('/book/add', authenticate, addBook )

// Get Books
router.get('/books', getAllBooks )

// create request
router.post('/book-requests', authenticate, createRequest)

// Get Book requests 
router.get('/book-requests', authenticate, getBookRequests)

// Update book request
router.patch('/book-requests/:request_id', authenticate, updateRequestStatus)

// Get my books
router.get('/users/me/books', authenticate, getUserBooks)

// Get orders
router.get('/users/me/orders', authenticate, getMyOrders)

module.exports = router