import React, { useState, useEffect } from "react";
import "./form.css";

function ClientForm({ onClose, initialData, isEdit, onSubmit }) {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [healthPreferences, setHealthPreferences] = useState("");

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setName(initialData.name || "");
      setMobileNumber(initialData.mobileNumber || "");
      setEmail(initialData.email || "");
      setGender(initialData.gender || "");
      setAge(initialData.age || "");
      setHealthPreferences(initialData.healthPreferences || "");
    }
  }, [isEdit, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      mobileNumber,
      email,
      gender,
      age,
      healthPreferences,
    };

    if (onSubmit) onSubmit(payload); // Pass data back to parent (Client.jsx)
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="row">
        {/* Name */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>

        {/* Mobile Number */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            type="tel"
            className="form-control"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number"
            required
          />
        </div>
      </div>

      <div className="row">
        {/* Email */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        {/* Gender */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="row">
        {/* Age */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            min="1"
          />
        </div>

        {/* Health Preferences */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Health Preferences</label>
          <textarea
            className="form-control"
            value={healthPreferences}
            onChange={(e) => setHealthPreferences(e.target.value)}
            rows="3"
            placeholder="Any injuries, allergies, health conditions..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Client" : "Save Client"}
        </button>
      </div>
    </form>
  );
}

export default ClientForm;
