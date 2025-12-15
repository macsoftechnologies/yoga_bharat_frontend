import React, { useState, useEffect } from "react";
import "./form.css";

function HealthPreferenceForm({ onClose, initialData, isEdit, onSubmit }) {
  const [name, setName] = useState(""); // Name of the client or participant
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [injuries, setInjuries] = useState("");
  const [allergies, setAllergies] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [goals, setGoals] = useState("");

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setName(initialData.name || "");
      setAge(initialData.age || "");
      setGender(initialData.gender || "");
      setInjuries(initialData.injuries || "");
      setAllergies(initialData.allergies || "");
      setHealthConditions(initialData.healthConditions || "");
      setGoals(initialData.goals || "");
    }
  }, [initialData, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, age, gender, injuries, allergies, healthConditions, goals };
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

        {/* Age */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter Age"
            min="1"
          />
        </div>
      </div>

      <div className="row">
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

        {/* Goals */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Goals</label>
          <input
            type="text"
            className="form-control"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="E.g., Flexibility, Stress Relief"
          />
        </div>
      </div>

      {/* Injuries, Allergies, Health Conditions */}
      <div className="mb-3">
        <label className="form-label">Injuries</label>
        <textarea
          className="form-control"
          value={injuries}
          onChange={(e) => setInjuries(e.target.value)}
          rows="2"
          placeholder="Specify any injuries"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Allergies</label>
        <textarea
          className="form-control"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          rows="2"
          placeholder="Specify any allergies"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Health Conditions</label>
        <textarea
          className="form-control"
          value={healthConditions}
          onChange={(e) => setHealthConditions(e.target.value)}
          rows="2"
          placeholder="Specify any health conditions"
        />
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Health Preference" : "Save Health Preference"}
        </button>
      </div>
    </form>
  );
}

export default HealthPreferenceForm;
