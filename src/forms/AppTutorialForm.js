import React, { useState, useEffect } from "react";
import "./form.css";

function AppTutorialForm({ onClose, initialData, isEdit, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState("Draft");

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "Draft");
      // Video file cannot be prefilled, user needs to re-upload
    }
  }, [initialData, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { title, description, videoFile, status };
    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Tutorial Title"
            required
          />
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
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Enter Description"
            required
          />
        </div>
      </div>

      {/* Video Upload */}
      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="form-label">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            className="form-control"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required={!isEdit} // Required if adding, optional on edit
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Tutorial" : "Save Tutorial"}
        </button>
      </div>
    </form>
  );
}

export default AppTutorialForm;
