import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../forms/form.css";
import {
  addPushNotification,
  getClients,
  getTrainers,
} from "../services/authService";

function Sms() {
  const handleSubmit = async (
    data,
    resetForm,
    setSubmitting
  ) => {
    try {
      const res = await addPushNotification(data);

      Swal.fire({
        title: "Sent!",
        text:
          res.message ||
          "Push Notification sent successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#35a542",
        color: "#ffffff",
      });

      resetForm();
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to send notification",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "15px",
        }}
      >
        <div
          className="card-header bg-white border-0"
          style={{
            padding: "20px 25px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              color: "#ff7a00",
            }}
          >
            PUSH NOTIFICATIONS
          </h2>
        </div>

        <div className="card-body">
          <SmsForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

function SmsForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  const [userList, setUserList] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [userLoading, setUserLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const filteredList = userList.filter((user) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const nameMatch = user.name
      ?.toLowerCase()
      .includes(term);
    const phoneMatch = user.mobileNumber
      ?.toString()
      .includes(term);
    return nameMatch || phoneMatch;
  });

  useEffect(() => {
    if (!role) {
      setUserList([]);
      setSelectedUserIds([]);
      setSearchTerm("");
      return;
    }

    setSearchTerm("");
    fetchAllUsers(role);
  }, [role]);

  const fetchAllUsers = async (
    selectedRole
  ) => {
    setUserLoading(true);
    setUserList([]);
    setSelectedUserIds([]);

    try {
      let allUsers = [];
      let page = 1;
      const limit = 10;

      while (true) {
        const res =
          selectedRole === "client"
            ? await getClients(page, limit)
            : await getTrainers(page, limit);

        const records = Array.isArray(res.data)
          ? res.data
          : [];

        const totalPages =
          res.totalPages || 1;

        if (records.length === 0) break;

        allUsers = [
          ...allUsers,
          ...records,
        ];

        if (page >= totalPages) break;

        page++;
      }

      setUserList(allUsers);
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to load users",
        "error"
      );
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
      const visibleIds = filteredList.map((u) => u.userId);
      setSelectedUserIds((prev) => [
        ...new Set([...prev, ...visibleIds]),
      ]);
    } else {
      const visibleIds = new Set(
        filteredList.map((u) => u.userId)
      );
      setSelectedUserIds((prev) =>
        prev.filter((id) => !visibleIds.has(id))
      );
    }
  };

  const allSelected =
    filteredList.length > 0 &&
    filteredList.every((u) =>
      selectedUserIds.includes(u.userId)
    );

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setRole("");
    setUserList([]);
    setSelectedUserIds([]);
    setSearchTerm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      Swal.fire(
        "Validation",
        "Please select a role",
        "warning"
      );
      return;
    }

    if (
      selectedUserIds.length === 0
    ) {
      Swal.fire(
        "Validation",
        "Please select at least one user",
        "warning"
      );
      return;
    }

    if (!title.trim()) {
      Swal.fire(
        "Validation",
        "Please enter title",
        "warning"
      );
      return;
    }

    if (!message.trim()) {
      Swal.fire(
        "Validation",
        "Please enter message",
        "warning"
      );
      return;
    }

    setSubmitting(true);

    onSubmit(
      {
        userIds: selectedUserIds,
        title,
        message,
      },
      resetForm,
      setSubmitting
    );
  };

  return (
    <form
      className="custom-form"
      onSubmit={handleSubmit}
    >
      {/* ROLE */}

      <div className="mb-4">
        <label className="form-label fw-bold">
          Select Role
        </label>

        <select
          className="form-select"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="">
            -- Select Role --
          </option>

          <option value="client">
            Client
          </option>

          <option value="trainer">
            Trainer
          </option>
        </select>
      </div>

      {/* USERS */}

      {role && (
        <div className="mb-4">
          <label className="form-label fw-bold">
            Select{" "}
            {role === "client"
              ? "Clients"
              : "Trainers"}

            {userList.length > 0 && (
              <span
                className="ms-2"
                style={{
                  color: "#ff7a00",
                }}
              >
                (
                {selectedUserIds.length}
                /{userList.length}
                {searchTerm.trim() &&
                  filteredList.length !==
                  userList.length && (
                    <span
                      style={{
                        color: "#888",
                        fontWeight: "normal",
                        fontSize: "0.85em",
                      }}
                    >
                      {" "}— {filteredList.length} shown
                    </span>
                  )}
                )
              </span>
            )}
          </label>

          {userLoading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-warning"></div>
            </div>
          ) : (
            <div
              style={{
                border:
                  "1px solid #ddd",
                borderRadius: "10px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {userList.length > 0 && (
                <div
                  style={{
                    padding: "10px 12px",
                    background: "#f8f9fa",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  {/* Left: Select All checkbox */}
                  <div className="form-check" style={{ margin: 0 }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                    <label className="form-check-label fw-bold">
                      Select All
                    </label>
                  </div>

                  {/* Right: Search input */}
                  <div style={{ position: "relative", minWidth: "200px", maxWidth: "280px", flex: 1 }}>
                    {/* Search icon — SVG, left center */}
                    <span
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "38%",
                        transform: "translateY(-50%)",
                        display: "block",
                        lineHeight: 0,
                        pointerEvents: "none",
                        color: "#888",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ display: "block" }}
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{
                        paddingLeft: "32px",
                        paddingRight: searchTerm ? "34px" : "10px",
                      }}
                      placeholder="Search by name or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Clear button — highlighted circular × */}
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        title="Clear search"
                        style={{
                          position: "absolute",
                          right: "7px",
                          top: "38%",
                          transform: "translateY(-50%)",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "rgb(255 122 0)",
                          border: "none",
                          cursor: "pointer",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: "bold",
                          lineHeight: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          boxShadow: "0 1px 3px rgba(220,53,69,0.4)",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#b02a37")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#dc3545")}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              )}

              {filteredList.length === 0 &&
                !userLoading &&
                userList.length > 0 && (
                  <div
                    className="text-center text-muted p-4"
                    style={{ fontSize: "0.9em" }}
                  >
                    No results found for &ldquo;{searchTerm}&rdquo;
                  </div>
                )}

              {filteredList.map((user) => {
                const checked =
                  selectedUserIds.includes(
                    user.userId
                  );

                return (
                  <div
                    key={user.userId}
                    onClick={() =>
                      handleCheckbox(
                        user.userId
                      )
                    }
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      borderBottom:
                        "1px solid #eee",
                      background:
                        checked
                          ? "#fff4e8"
                          : "#fff",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        checked={checked}
                        readOnly
                      />

                      <div
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          background:
                            role === "trainer"
                              ? "#ff7a00"
                              : "#0dcaf0",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <div className="fw-bold">
                          {user.name}
                        </div>

                        <small className="text-muted">
                          {user.mobileNumber}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TITLE */}

      <div className="mb-4">
        <label className="form-label fw-bold">
          Title
        </label>

        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Enter notification title"
        />
      </div>

      {/* MESSAGE */}

      <div className="mb-4">
        <label className="form-label fw-bold">
          Message
        </label>

        <textarea
          rows={5}
          className="form-control"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Enter notification message"
        />
      </div>

      {/* BUTTON */}

      <div className="text-end">
        <button
          type="submit"
          className="btn btn-success px-4"
          disabled={
            submitting ||
            userLoading
          }
        >
          {submitting
            ? "Sending..."
            : "Send Notifications"}

          {selectedUserIds.length >
            0 && (
              <span className="badge bg-light text-success ms-2">
                {
                  selectedUserIds.length
                }
              </span>
            )}
        </button>
      </div>
    </form>
  );
}

export default Sms;