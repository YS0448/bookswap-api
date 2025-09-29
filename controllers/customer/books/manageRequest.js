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





// Update request status (accept/decline)
const updateRequestStatus = async (req, res) => {
  try {
    const request_id= req.params.request_id;
    const { request_status, book_id } = req.body;
    if (!request_id || !request_status) {
      return res.status(400).json({ message: "Request ID and status required" });
    }

    const validStatuses = ["accepted", "declined", "pending"];
    if (!validStatuses.includes(request_status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const currentDateTime = getUTCDateTime();
    
    const query = `
      UPDATE manage_books_request
      SET request_status = ?, updated_at = ?
      WHERE request_id = ?
    `;

    let result= await executeQuery(query, [request_status, currentDateTime, request_id ]);

    if(request_status==='accepted'){
      const book_status = "sold";
      
      const bookUpdateQuery = `
        UPDATE books 
        SET status = ?, updated_at = ?
        WHERE book_id = ? 
      `
    const bookupdateValues = [book_status, currentDateTime, book_id];
    const requestDetails = await executeQuery(bookUpdateQuery, bookupdateValues);
    }

    res.status(200).json({ message: "Request updated successfully" });
  } catch (err) {
    console.error("Error in updateRequestStatus:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


module.exports = { createRequest, updateRequestStatus };
