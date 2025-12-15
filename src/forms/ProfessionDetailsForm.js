import React, { useState, useEffect } from "react";
import "./form.css";

function ProfessionDetailsForm({ onClose, initialData, isEdit, onSubmit }) {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [status, setStatus] = useState("Active");

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setName(initialData.name || "");
      setProfession(initialData.profession || "");
      setExperience(initialData.experience || "");
      setSkills(initialData.skills || "");
      setStatus(initialData.status || "Active");
    }
  }, [initialData, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, profession, experience, skills, status };
    if (onSubmit) onSubmit(payload);
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
            placeholder="Enter Name"
            required
          />
        </div>

        {/* Profession */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Profession</label>
          <input
            type="text"
            className="form-control"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Enter Profession"
            required
          />
        </div>
      </div>

      <div className="row">
        {/* Experience */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Experience (Years)</label>
          <input
            type="number"
            className="form-control"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter Experience"
            min="0"
          />
        </div>

        {/* Skills */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Skills</label>
          <input
            type="text"
            className="form-control"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter Skills"
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
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Profession" : "Save Profession"}
        </button>
      </div>
    </form>
  );
}

export default ProfessionDetailsForm;
