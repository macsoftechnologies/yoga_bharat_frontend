import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import "../forms/form.css";
import { addPushNotification, getClients, getTrainers } from "../services/authService";

function Sms() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data) => {
    try {
      const res = await addPushNotification(data);
      Swal.fire({
        title: "Sent!",
        text: res.message || "Push Notification  sent successfully",
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
    } catch {
      Swal.fire("Error", "Failed to send SMS", "error");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>PUSH NOTIFICATIONS</h2>
        <Button text="+ Send Notifications" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* Send Notification Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Send Push Notifications" size="md">
        <SmsForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}

// ─── SMS Form ────────────────────────────────────────────────────────────────
function SmsForm({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
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

        const records  = Array.isArray(res.data) ? res.data : [];
        const totalPgs = res.totalPages || 1;

        if (records.length === 0) break;

        allUsers = [...allUsers, ...records];

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
    if (!title.trim()) {
      Swal.fire("Validation", "Please enter a title", "warning");
      return;
    }
    if (!message.trim()) {
      Swal.fire("Validation", "Please enter a message", "warning");
      return;
    }

    onSubmit({ userIds: selectedUserIds, title, message });
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
                            background: role === "trainer" ? "#ff7a00" : "#0dcaf0",
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

      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter notification title"
          required
        />
      </div>

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
          Send Notifications
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