import React, { useState, useEffect } from "react";
import "./form.css";

function YogaForm({ onClose, initialData, isEdit }) {
  // ---- Individual state for each field ----
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // ---- When edit mode → pre-fill form ----
  useEffect(() => {
    if (isEdit && initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || "");
      setDuration(initialData.duration ? initialData.duration.replace(" min", "") : "");
      setDifficulty(initialData.difficulty || "");
    }
  }, [initialData, isEdit]);

  // ---- Submit Handler ----
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      category,
      duration,
      difficulty,
    };

    if (isEdit) {
      console.log("Edited Yoga:", payload);
    } else {
      console.log("Added Yoga:", payload);
    }

    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* Row 1 */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Yoga Name"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Hatha">Hatha</option>
            <option value="Vinyasa">Vinyasa</option>
            <option value="Ashtanga">Ashtanga</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Duration (min)</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Yoga" : "Save Yoga"}
        </button>
      </div>
    </form>
  );
}

export default YogaForm;
