import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import { getCallBackRequests, completeCallBackRequest } from "../services/authService";
import "../forms/form.css";

function CallbackRequest() {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestList, setRequestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getCallBackRequests(page, 10);
      setRequestList(data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch callback requests", "error");
      setRequestList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage]);

  const handleOpenPending = (item) => {
    if (item.status === "pending") {
      setSelectedRequest(item);
      setNote("");
      setViewOpen(true);
    }
  };

  const handleComplete = async (request) => {
    try {
      const res = await completeCallBackRequest({
        callRequestId: request.callRequestId,
        adminId: "a906c953-d3be-42a8-9ac0-a3f893de89a0",
        note: note.trim(),
      });

      Swal.fire({
        title: "Success",
        text: res.message || "Request completed",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        background: "#35a542",
        color: "#ffffff",
      });

      // ✅ Update status AND save note into the list
      setRequestList((prev) =>
        prev.map((item) =>
          item.callRequestId === request.callRequestId
            ? { ...item, status: "completed", note: note.trim() }
            : item
        )
      );

      setViewOpen(false);
      setNote("");
    } catch (err) {
      Swal.fire("Error", "Failed to complete request", "error");
      console.error(err);
    }
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    { header: "Date", accessor: "date" },
    { header: "Scheduled Time", accessor: "scheduledTime" },
    { header: "Note", accessor: "note" },         // ✅ NEW column
    { header: "Status", accessor: "status" },
  ];

  const tableData = requestList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
    name: item.userId?.name || "",
    role: item.userId?.role || "",
    mobileNumber: item.mobileNumber,
    date: item.date,
    scheduledTime: item.scheduledTime,

    // ✅ Note cell — show note text or dash if empty
    note: item.note ? (
      <span
        title={item.note}
        style={{
          display: "inline-block",
          maxWidth: 150,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          verticalAlign: "middle",
        }}
      >
        {item.note}
      </span>
    ) : (
      <span style={{ color: "#aaa" }}>—</span>
    ),

    status: (
      <span
        style={{
          color: item.status === "pending" ? "red" : "green",
          backgroundColor: item.status === "pending" ? "#ffe5e5" : "#e5ffe5",
          fontWeight: 600,
          cursor: item.status === "pending" ? "pointer" : "default",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
        onClick={() => handleOpenPending(item)}
      >
        {item.status}
      </span>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>CALLBACK REQUESTS</h2>
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={10}
        isLoading={loading}
      />

        <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Request Details"
        size="md"
      >
        {selectedRequest && (
          <div style={{ padding: 10 }}>
            <div className="row">
              <div className="col-md-6">
                <p><b>Mobile Number:</b> {selectedRequest.mobileNumber}</p>
              </div>
              <div className="col-md-6">
                <p><b>Name:</b> {selectedRequest.userId?.name}</p>
              </div>
              <div className="col-md-6">
                <p><b>Role:</b> {selectedRequest.userId?.role}</p>
              </div>
              <div className="col-md-6">
                <p>
                  <b>Status:</b>{" "}
                  <span style={{ color: selectedRequest.status === "pending" ? "red" : "green", fontWeight: 600 }}>
                    {selectedRequest.status}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <p><b>Date:</b> {selectedRequest.date}</p>
              </div>
              <div className="col-md-6">
                <p><b>Scheduled Time:</b> {selectedRequest.scheduledTime}</p>
              </div>
            </div>

            {selectedRequest.status === "pending" && (
              <>
                <div className="mb-3 mt-3">
                  <label
                    htmlFor="noteInput"
                    style={{ fontWeight: 600, marginBottom: 6, display: "block" }}
                  >
                    Note <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    id="noteInput"
                    className="form-control"
                    rows={3}
                    placeholder="Type a note to enable completion..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  className="btn btn-success mt-1"
                  onClick={() => handleComplete(selectedRequest)}
                  disabled={!note.trim()}
                  style={{
                    opacity: !note.trim() ? 0.5 : 1,
                    cursor: !note.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Mark as Complete
                </button>
              </>
            )}

            <button
              className="btn btn-secondary mt-2 ms-2"
              onClick={() => setViewOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CallbackRequest;