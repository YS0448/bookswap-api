const { executeQuery } = require("../../../utils/db/dbUtils");

// Fetch user orders with pagination
const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user?.user_id || null;
    if (!user_id) return res.status(400).json({ message: "User ID required" });

    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;

    const ordersQuery = `
      SELECT 
        mbr.request_id, 
        mbr.request_status,
        mbr.created_at,
        b.book_id, 
        b.title,
        b.author,
        b.book_condition,
        b.image,
        b.status
      FROM manage_books_request mbr
      LEFT JOIN books b ON mbr.book_id = b.book_id
      WHERE mbr.user_id = ?
      ORDER BY mbr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const orders = await executeQuery(ordersQuery, [user_id, limit, offset]);

    const totalResult = await executeQuery(
      "SELECT COUNT(*) as count FROM manage_books_request WHERE user_id = ?",
      [user_id]
    );

    const total = totalResult[0]?.count || 0;
    res.status(200).json({ orders, total });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMyOrders };
