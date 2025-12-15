import React, { useState, useEffect } from "react";
import "./form.css";

function SplashScreenForm({ onClose, initialData, isEdit, onSubmit }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setImage(initialData.image || null);
      setPreview(initialData.imagePreview || null);
    }
  }, [initialData, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { title, subtitle, image, imagePreview: preview };
    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          required
        />
      </div>

      {/* Subtitle */}
      <div className="mb-3">
        <label className="form-label">Subtitle</label>
        <input
          type="text"
          className="form-control"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Enter Subtitle"
        />
      </div>

      {/* Image */}
      <div className="mb-3">
        <label className="form-label">Upload Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-3">
          <label className="form-label">Preview:</label>
          <div>
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "300px", maxHeight: "200px", borderRadius: "5px" }}
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Splash Screen" : "Save Splash Screen"}
        </button>
      </div>
    </form>
  );
}

export default SplashScreenForm;
