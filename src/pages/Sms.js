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

  const [userLoading, setUserLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (!role) {
      setUserList([]);
      setSelectedUserIds([]);
      return;
    }

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
      setSelectedUserIds(
        userList.map((u) => u.userId)
      );
    } else {
      setSelectedUserIds([]);
    }
  };

  const allSelected =
    userList.length > 0 &&
    selectedUserIds.length ===
      userList.length;

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setRole("");
    setUserList([]);
    setSelectedUserIds([]);
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
                {
                  selectedUserIds.length
                }
                /{userList.length}
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
                    padding: "12px",
                    background:
                      "#f8f9fa",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    borderBottom:
                      "1px solid #ddd",
                  }}
                >
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={
                        allSelected
                      }
                      onChange={
                        handleSelectAll
                      }
                    />

                    <label className="form-check-label fw-bold">
                      Select All
                    </label>
                  </div>
                </div>
              )}

              {userList.map((user) => {
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
                      cursor:
                        "pointer",
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
                        checked={
                          checked
                        }
                        readOnly
                      />

                      <div
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius:
                            "50%",
                          background:
                            role ===
                            "trainer"
                              ? "#ff7a00"
                              : "#0dcaf0",
                          color: "#fff",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontWeight:
                            "bold",
                          marginRight:
                            "10px",
                        }}
                      >
                        {user.name
                          ?.charAt(
                            0
                          )
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <div className="fw-bold">
                          {user.name}
                        </div>

                        <small className="text-muted">
                          {
                            user.mobileNumber
                          }
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