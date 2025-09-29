const {executeQuery}= require("../../../utils/db/dbUtils");


// Get all book requests 
const getBookRequests = async (req, res) => {
  try {
    const owner_id = req.query.owner_id || null;
    const limit = parseInt(req.query.limit) || 10; 
    const page = parseInt(req.query.page) || 1;      
    const offset = (page - 1) * limit;

    if (!owner_id) {
      return res.status(400).json({ message: "Owner ID required" });
    }

    // ✅ Paginated query
    const query = `
      SELECT 
        mbr.request_id,
        mbr.request_status,
        mbr.created_at,
        u.user_id as requester_id,
        u.full_name as requester_name,
        b.book_id,
        b.title as book_title
      FROM manage_books_request mbr
      LEFT JOIN users u ON u.user_id = mbr.user_id
      LEFT JOIN books b ON b.book_id = mbr.book_id
      WHERE b.created_by = ?
      ORDER BY mbr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const requests = await executeQuery(query, [owner_id, limit, offset]);

    // ✅ Total count query (for pagination)
    const totalQuery = `
      SELECT COUNT(*) as total
      FROM manage_books_request mbr
      LEFT JOIN books b ON b.book_id = mbr.book_id
      WHERE b.created_by = ?
    `;
    const totalResult = await executeQuery(totalQuery, [owner_id]);
    const total = totalResult[0]?.total || 0;

    res.status(200).json({ requests, total });
  } catch (err) {
    console.error("Error in getManageRequests:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


module.exports={ getBookRequests };