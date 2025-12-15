import React, { useState, useEffect } from "react";
import "./form.css";

function CallbackRequestForm({ onClose, initialData, isEdit, onSubmit }) {
  const [clientName, setClientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [yogaType, setYogaType] = useState("");
  const [notes, setNotes] = useState("");

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setClientName(initialData.clientName || "");
      setMobileNumber(initialData.mobileNumber || "");
      setPreferredTime(initialData.preferredTime || "");
      setYogaType(initialData.yogaType || "");
      setNotes(initialData.notes || "");
    }
  }, [initialData, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { clientName, mobileNumber, preferredTime, yogaType, notes };
    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* Row 1 */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Client Name</label>
          <input
            type="text"
            className="form-control"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter Client Name"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            type="tel"
            className="form-control"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter Mobile Number"
            required
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Preferred Time</label>
          <input
            type="time"
            className="form-control"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Type</label>
          <select
            className="form-select"
            value={yogaType}
            onChange={(e) => setYogaType(e.target.value)}
            required
          >
            <option value="">Select Yoga Type</option>
            <option value="Hatha">Hatha</option>
            <option value="Vinyasa">Vinyasa</option>
            <option value="Ashtanga">Ashtanga</option>
            <option value="Meditation">Meditation</option>
          </select>
        </div>
      </div>

      {/* Row 3 */}
      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Additional notes or requests..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Request" : "Save Request"}
        </button>
      </div>
    </form>
  );
}

export default CallbackRequestForm;
