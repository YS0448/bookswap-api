// controllers/bookController.js
const { executeQuery } = require("../../../utils/db/dbUtils");

const getUserBooks = async (req, res) => {
  try {
    const user_id = req.user.user_id || null;
    console.log('user_id:', user_id);
    if (!user_id) return res.status(400).json({ message: "User ID required" });

    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;

    const booksQuery = `
      SELECT 
        book_id, title, author, book_condition, image, status, is_active, created_at, updated_at
      FROM books
      WHERE created_by = ? AND is_active = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const books = await executeQuery(booksQuery, [user_id, limit, offset]);

    const totalResult = await executeQuery(
      "SELECT COUNT(*) as count FROM books WHERE created_by = ? AND is_active = 1",
      [user_id]
    );

    const total = totalResult[0]?.count || 0;

    res.status(200).json({ books, total });
  } catch (err) {
    console.error("Error fetching user books:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserBooks };
