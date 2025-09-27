const { executeQuery } = require("../../../utils/db/dbUtils");
const { getUTCDateTime } = require("../../../utils/date/dateUtils");

const createRequest = async (req, res) => {
  try {
    const { book_id, user_id } = req.body;
    console.log('req.body:', req.body);

    if (!book_id || !user_id) {
      return res.status(400).json({ success: false, message: "Book ID and User ID are required."});
    }

    const currentDateTime = getUTCDateTime();
    const query = `INSERT INTO manage_books_request (book_id, user_id, updated_at, created_at ) VALUES (?, ?, ?, ? )`;

    const result = await executeQuery(query, [book_id, user_id, currentDateTime, currentDateTime]);
    console.log('result:', result);

    return res.status(201).json({
      success: true,
      message: "Book request sent successfully",
      request_id: result.insertId,
    });

  } catch (error) {
    console.error("Error creating book request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get all requests for the logged-in user's books
// ✅ Fetch all requests for books created by logged-in user
const getManageRequests = async (req, res) => {
  try {
    const owner_id = req.query.owner_id || null;
    const limit = parseInt(req.query.limit) || 10;   // ✅ default 10
    const page = parseInt(req.query.page) || 1;      // ✅ default 1
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



// Update request status (accept/decline)
const updateRequestStatus = async (req, res) => {
  try {
    const { request_id, status } = req.body;
    if (!request_id || !status) {
      return res.status(400).json({ message: "Request ID and status required" });
    }

    const validStatuses = ["accepted", "declined", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const currentDateTime = getUTCDateTime();
    
    const query = `
      UPDATE manage_books_request
      SET request_status = ?, updated_at = ?
      WHERE request_id = ?
    `;

    let result= await executeQuery(query, [status, currentDateTime, request_id ]);
    res.status(200).json({ message: "Request updated successfully" });
  } catch (err) {
    console.error("Error in updateRequestStatus:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


module.exports = { createRequest, getManageRequests, updateRequestStatus };
