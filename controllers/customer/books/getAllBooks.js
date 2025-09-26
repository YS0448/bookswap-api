const { executeQuery } = require("../../../utils/db/dbUtils");

const getAllBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const offset = parseInt(req.query.offset) || 0;
    const user_id = req.query.user_id || null;
    const is_active = 1;
    const request_status = "approved";

    // Query books
    let booksQuery = "";
    let queryParams = [];

    if (user_id) {
      booksQuery = `
        SELECT 
          b.book_id, 
          b.title, 
          b.author, 
          b.book_condition, 
          b.image, 
          b.created_by, 
          b.status, 
          b.is_active,
          mbr.request_status
        FROM books b
        LEFT JOIN manage_books_request mbr 
          ON b.book_id = mbr.book_id AND mbr.user_id = ?
        WHERE b.is_active = ? AND b.created_by != ? 
          AND (mbr.request_status IS NULL OR mbr.request_status != ?)
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?
      `;
      queryParams = [user_id, is_active, user_id, request_status, limit, offset];
    } else {
      booksQuery = `
        SELECT * FROM books 
        WHERE is_active = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      queryParams = [is_active, limit, offset];
    }

    const books = await executeQuery(booksQuery, queryParams);

    // Total count query
    let totalQuery = "";
    let totalParams = [];

    if (user_id) {
      totalQuery = `
        SELECT COUNT(*) as count
        FROM books b
        LEFT JOIN manage_books_request mbr 
          ON b.book_id = mbr.book_id AND mbr.user_id = ?
        WHERE b.is_active = ? AND b.created_by != ? 
          AND (mbr.request_status IS NULL OR mbr.request_status != ?)
      `;
      totalParams = [user_id, is_active, user_id, request_status];
    } else {
      totalQuery = "SELECT COUNT(*) as count FROM books WHERE is_active = ?";
      totalParams = [is_active];
    }

    const totalResult = await executeQuery(totalQuery, totalParams);
    const totalCount = totalResult[0]?.count || 0;

    res.status(200).json({ books, total: totalCount });
  } catch (err) {
    console.error("Error in getAllBooks:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = { getAllBooks };
