const { executeQuery } = require("../../../utils/db/dbUtils");

const getAllBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const offset = parseInt(req.query.offset) || 0;
    const user_id = req.query.user_id || null;
    const is_active = 1;
    const request_status = "accepted";
    const book_status = "available";
    // Query books
    let booksQuery = "";
    let queryParams = [];

    if (user_id) {
      booksQuery = `
        SELECT 
          book_id, 
          title, 
          author, 
          book_condition, 
          image, 
          created_by, 
          status, 
          is_active              
        FROM books        
        WHERE is_active = ? AND status = ? AND created_by != ?   
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;

      queryParams = [is_active, book_status, user_id, limit, offset];
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
    console.log('books:', books);

    // Total count query
    let totalQuery = "";
    let totalParams = [];

    if (user_id) {
      totalQuery = `
        SELECT COUNT(*) as count
        FROM books 
        WHERE is_active = ? AND created_by != ? AND status = ?  `;
      totalParams = [ is_active, user_id, book_status];
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
