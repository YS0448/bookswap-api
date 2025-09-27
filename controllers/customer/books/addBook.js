const {executeQuery}= require("../../../utils/db/dbUtils"); // your MySQL connection
const uploadImage = require("../../../utils/uploadMedia/uploadImage"); // your helper
const { getUTCDateTime } = require("../../../utils/date/dateUtils");


const addBook = async (req, res) => {
  try {
    const { title, author, condition } = req.body;
    const userId = req.user.user_id; // Assuming user ID is available in req.user

    if (!title || !author || !condition) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Book image is required" });
    }

    const imageFile = req.files.image;
    const imagePath = await uploadImage(imageFile);
    console.log('imagePath:', imagePath);

    const status = "available"; 
    let currentDateTime = getUTCDateTime();
    const query = `
      INSERT INTO books (title, author, book_condition, image, created_by, updated_at, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const value= [title, author, condition, imagePath, userId, currentDateTime, currentDateTime, status]
    const result = await executeQuery(query, value);

    res.status(201).json({
      message: "Book added successfully",
      bookId: result.insertId,
      image: imagePath
    });
  } catch (err) {
    console.error("Error in addBook:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = { addBook };