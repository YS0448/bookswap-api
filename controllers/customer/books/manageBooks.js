const { executeQuery } = require("../../../utils/db/dbUtils");
const {getUTCDateTime} = require("../../../utils/date/dateUtils")
const {uploadImage} = require("../../../utils/uploadMedia/uploadImage");


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


// Update book
const updateBook = async (req, res) => {
  try {
    const { book_id } = req.params;
    const { title, author, book_condition, status } = req.body || {};
    let imagePath = null;
    const currentDateTime = getUTCDateTime();

    if (req.files?.image) {
      imagePath = await uploadImage(req.files.image);
    }

    // Build fields dynamically
    const updates = {
        ...(title?.trim() && { title }),
        ...(author?.trim() && { author }),
        ...(book_condition?.trim() && { book_condition }),
        ...(status?.trim() && { status }),
        ...(imagePath && { image: imagePath }),
        updated_at: currentDateTime,
    };

    if (Object.keys(updates).length === 1){
        return res.status(400).json({ message: "No fields to update" });
    } 

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const params = [...Object.values(updates), book_id];

    await executeQuery(`UPDATE books SET ${fields} WHERE book_id = ?`, params);

    res.status(200).json({ 
      message: "Book updated successfully",
      imagePath: imagePath || null
    });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Soft delete book
const softDeleteBook = async (req, res) => {
  try {
    const { book_id } = req.params;
    const is_active= 0;
    const currentDateTime = getUTCDateTime()
    const deleteQuery= `UPDATE books SET is_active= ?, updated_at=? WHERE book_id= ?`;
    const values= [is_active ,currentDateTime ,book_id]
    const result= await executeQuery(deleteQuery, values  );

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports={ addBook, updateBook, softDeleteBook }