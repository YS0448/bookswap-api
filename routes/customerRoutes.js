const express = require('express');
const router = express.Router();
const authenticate  = require('../middleware/authMiddleware');
const { addBook } = require('../controllers/customer/books/addBook')
const { getAllBooks } = require('../controllers/customer/books/getAllBooks')
const { createRequest, getManageRequests, updateRequestStatus } = require('../controllers/customer/books/manageRequest')
const { getUserBooks } = require('../controllers/customer/books/getUserBooks')

router.post('/book/add', authenticate, addBook )
router.get('/getAllBooks', getAllBooks )
// router.post('/manage_request', authenticate, createRequest)
router.post('/create_request', authenticate, createRequest)
router.get('/manage-requests', authenticate, getManageRequests)
router.post('/manage-requests/update', authenticate, updateRequestStatus)
router.get('/getUserBooks', authenticate, getUserBooks)


module.exports = router