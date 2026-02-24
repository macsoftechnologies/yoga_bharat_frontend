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
      setViewOpen(true);
    }
  };

  const handleComplete = async (request) => {
    try {
      const res = await completeCallBackRequest({
        callRequestId: request.callRequestId,
        adminId: "a906c953-d3be-42a8-9ac0-a3f893de89a0",
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

      setRequestList((prev) =>
        prev.map((item) =>
          item.callRequestId === request.callRequestId
            ? { ...item, status: "completed" }
            : item
        )
      );

      setViewOpen(false);
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
    { header: "Status", accessor: "status" },
  ];

  const tableData = requestList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
    name: item.userId?.name || "",
    role: item.userId?.role || "",
    mobileNumber: item.mobileNumber,
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
    date: item.date,
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

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Request Details" size="md">
        {selectedRequest && (
          <div style={{ padding: 10 }}>
            <p><b>Mobile Number:</b> {selectedRequest.mobileNumber}</p>
            <p><b>Name:</b> {selectedRequest.userId?.name}</p>
            <p><b>Role:</b> {selectedRequest.userId?.role}</p>
            <p>
              <b>Status:</b>{" "}
              <span style={{ color: selectedRequest.status === "pending" ? "red" : "green", fontWeight: 600 }}>
                {selectedRequest.status}
              </span>
            </p>
            <p><b>Date:</b> {selectedRequest.date}</p>
            {selectedRequest.status === "pending" && (
              <button className="btn btn-success mt-2" onClick={() => handleComplete(selectedRequest)}>
                Mark as Complete
              </button>
            )}
            <button className="btn btn-secondary mt-2 ms-2" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CallbackRequest;