import React, { useState, useEffect } from "react";
import "./form.css";

function NotificationsForm({ onClose, initialData, isEdit, onSubmit }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("Unread");

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || "");
      setMessage(initialData.message || "");
      setRecipient(initialData.recipient || "");
      setStatus(initialData.status || "Unread");
    }
  }, [initialData, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { title, message, recipient, status };
    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="row">
        {/* Title */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Notification Title"
            required
          />
        </div>

        {/* Recipient */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Recipient</label>
          <input
            type="text"
            className="form-control"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Recipient Name"
            required
          />
        </div>
      </div>

      {/* Message */}
      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            placeholder="Enter Notification Message"
            required
          />
        </div>
      </div>

      {/* Status */}
      <div className="col-md-6 mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Notification" : "Save Notification"}
        </button>
      </div>
    </form>
  );
}

export default NotificationsForm;
