import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import "../forms/form.css";
import { addBulksms, getSmsList, getClients, getTrainers } from "../services/authService";
import { FaEye } from "react-icons/fa";

function Sms() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [smsList, setSmsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchSmsList = async (page) => {
    setLoading(true);
    try {
      const res = await getSmsList(page, 10);
      if (res && Array.isArray(res.data)) {
        setSmsList(res.data);
        setTotalPages(res.totalPages || 1);
      } else {
        setSmsList([]);
        setTotalPages(1);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to fetch SMS list", "error");
      setSmsList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmsList(currentPage);
  }, [currentPage]);

  const handleView = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      const res = await addBulksms(data);
      Swal.fire({
        title: "Sent!",
        text: res.message || "SMS sent successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#35a542",
        color: "#ffffff",
      });
      setOpen(false);
      fetchSmsList(currentPage);
    } catch {
      Swal.fire("Error", "Failed to send SMS", "error");
    }
  };

  const columns = [
    { header: "S.No",       accessor: "srNo" },
    { header: "Message",    accessor: "message" },
    { header: "Recipients", accessor: "recipients" },
    { header: "Sent At",    accessor: "createdAt" },
    { header: "Actions",    accessor: "actions" },
  ];

  const tableData = smsList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
    message: (
      <span
        title={item.message || "-"}
        style={{
          display: "block",
          maxWidth: "350px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
        }}
      >
        {item.message || "-"}
      </span>
    ),
    recipients: (
      <span className="badge bg-primary" style={{ fontSize: "13px" }}>
        {Array.isArray(item.userId) ? item.userId.length : 0} Users
      </span>
    ),
    createdAt: item.createdAt
      ? new Date(item.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-",
    actions: (
      <div className="actions">
        <button
          className="icon-btn view"
          title="View"
          onClick={() => handleView(item)}
        >
          <FaEye />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>BULK SMS</h2>
        <Button text="+ Send SMS" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      {/* Send SMS Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Send Bulk SMS" size="md">
        <SmsForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* View SMS Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="SMS Details" size="lg">
        {selectedItem && (
          <div style={{ padding: 10 }}>
            <p><b>Message:</b> {selectedItem.message}</p>
            <p>
              <b>Sent At:</b>{" "}
              {selectedItem.createdAt
                ? new Date(selectedItem.createdAt).toLocaleString("en-IN")
                : "-"}
            </p>
            <p>
              <b>
                Recipients (
                {Array.isArray(selectedItem.userId) ? selectedItem.userId.length : 0}
                ):
              </b>
            </p>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-sm table-bordered">
                <thead style={{ background: "#f5f5f5" }}>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(selectedItem.userId) &&
                    selectedItem.userId.map((user, i) => (
                      <tr key={user._id || i}>
                        <td>{i + 1}</td>
                        <td>{user.name || "-"}</td>
                        <td>{user.mobileNumber || "-"}</td>
                        <td>{user.email || "-"}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === "trainer"
                                ? "bg-warning text-dark"
                                : "bg-info text-dark"
                            }`}
                          >
                            {user.role || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="text-end mt-3">
              <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── SMS Form ────────────────────────────────────────────────────────────────
function SmsForm({ onClose, onSubmit }) {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    if (!role) {
      setUserList([]);
      setSelectedUserIds([]);
      return;
    }
    fetchAllUsers(role);
  }, [role]);

  const fetchAllUsers = async (selectedRole) => {
    setUserLoading(true);
    setUserList([]);
    setSelectedUserIds([]);
    try {
      let allUsers = [];
      let page = 1;
      const limit = 10;

      while (true) {
        const res = selectedRole === "client"
          ? await getClients(page, limit)
          : await getTrainers(page, limit);

        const records   = Array.isArray(res.data) ? res.data : [];
        const totalPgs  = res.totalPages || 1;

        if (records.length === 0) break;

        allUsers = [...allUsers, ...records];

        // Stop if we've fetched all pages
        if (page >= totalPgs) break;
        page++;
      }

      setUserList(allUsers);
    } catch {
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setUserLoading(false);
    }
  };

  const handleCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(userList.map((u) => u.userId));
    } else {
      setSelectedUserIds([]);
    }
  };

  const allSelected =
    userList.length > 0 && selectedUserIds.length === userList.length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      Swal.fire("Validation", "Please select a role", "warning");
      return;
    }
    if (selectedUserIds.length === 0) {
      Swal.fire("Validation", "Please select at least one user", "warning");
      return;
    }
    if (!message.trim()) {
      Swal.fire("Validation", "Please enter a message", "warning");
      return;
    }

    onSubmit({ userId: selectedUserIds, message });
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* Role Selector */}
      <div className="mb-3">
        <label className="form-label">Select Role</label>
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">-- Select Role --</option>
          <option value="client">Client</option>
          <option value="trainer">Trainer</option>
        </select>
      </div>

      {/* User List */}
      {role && (
        <div className="mb-3">
          <label className="form-label">
            Select {role === "client" ? "Clients" : "Trainers"}
            {userList.length > 0 && (
              <small className="text-muted ms-2">
                ({selectedUserIds.length} / {userList.length} selected)
              </small>
            )}
          </label>

          {userLoading ? (
            <div className="text-center py-3">
              <div
                className="spinner-border spinner-border-sm"
                role="status"
                style={{ color: "#ff7a00" }}
              />
              <span className="ms-2 text-muted">Loading users...</span>
            </div>
          ) : userList.length === 0 ? (
            <div
              className="text-muted text-center py-2"
              style={{
                fontSize: "13px",
                border: "1px solid #dee2e6",
                borderRadius: 6,
              }}
            >
              No {role}s found.
            </div>
          ) : (
            <div
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                maxHeight: "220px",
                overflowY: "auto",
                background: "#fafafa",
              }}
            >
              {/* Select All */}
              <div
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #dee2e6",
                  background: "#f0f0f0",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAll"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="selectAll"
                    style={{ cursor: "pointer" }}
                  >
                    Select All
                  </label>
                </div>
              </div>

              {/* User Rows */}
              {userList.map((user) => {
                const isChecked = selectedUserIds.includes(user.userId);
                return (
                  <div
                    key={user.userId}
                    style={{
                      padding: "7px 12px",
                      borderBottom: "1px solid #f0f0f0",
                      background: isChecked ? "#fff3e6" : "transparent",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCheckbox(user.userId)}
                  >
                    <div className="form-check mb-0 d-flex align-items-center gap-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckbox(user.userId)}
                        onClick={(e) => e.stopPropagation()}
                        id={`user-${user.userId}`}
                      />
                      <label
                        htmlFor={`user-${user.userId}`}
                        className="d-flex align-items-center gap-2 mb-0"
                        style={{ cursor: "pointer", fontSize: "14px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background:
                              role === "trainer" ? "#ff7a00" : "#0dcaf0",
                            color: "#fff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "13px",
                            flexShrink: 0,
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                        <span>
                          <span style={{ fontWeight: 600 }}>
                            {user.name || "Unknown"}
                          </span>
                          <span
                            style={{
                              color: "#888",
                              fontSize: "12px",
                              marginLeft: 8,
                            }}
                          >
                            {user.mobileNumber || ""}
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Message */}
      <div className="mb-3">
        <label className="form-label">Message</label>
        <textarea
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter SMS message"
          required
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="text-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={userLoading || selectedUserIds.length === 0}
        >
          Send SMS
          {selectedUserIds.length > 0 && (
            <span className="ms-1 badge bg-white text-success">
              {selectedUserIds.length}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

export default Sms;