import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addHealthPreference, updateHealthPreference } from "../services/authService";
import "./form.css";

function HealthPreferenceForm({ onClose, isEdit, initialData, onSubmit }) {
  const [preferenceName, setPreferenceName] = useState("");
  const [preferenceIcon, setPreferenceIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && initialData) {
      setPreferenceName(initialData.name || "");
      setPreferenceIcon(null);

      // ✅ Show existing icon preview (same as LawForm pattern)
      const base = process.env.REACT_APP_API_BASE_URL || "";
      const iconField =
        initialData.preference_icon ||
        initialData.icon ||
        initialData.preferenceIcon ||
        null;

      setIconPreview(iconField ? `${base}/${iconField}` : null);
    }
  }, [isEdit, initialData]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreferenceIcon(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!preferenceName) {
      Swal.fire("Validation Error", "Preference name is required", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("preference_name", preferenceName);
    if (preferenceIcon) formData.append("preference_icon", preferenceIcon);

    try {
      setLoading(true);

      let response;
      if (isEdit && initialData?.prefId) {
        formData.append("prefId", initialData.prefId);
        response = await updateHealthPreference(formData);
      } else {
        response = await addHealthPreference(formData);
      }

      Swal.fire({
        title: isEdit ? "Updated!" : "Added!",
        text: response.message || (isEdit ? "Updated successfully" : "Added successfully"),
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        color: "#ffffff",
        background: "#35a542",
      });

      onSubmit();
      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Preference Name</label>
        <input
          type="text"
          className="form-control"
          value={preferenceName}
          onChange={(e) => setPreferenceName(e.target.value)}
          placeholder="Enter Preference Name"
          required
        />
      </div>

      <div className="mb-3">
        <label>Preference Icon</label>

        {/* ✅ Show current icon when editing (same as LawForm) */}
        {isEdit && iconPreview && !preferenceIcon && (
          <div className="mb-2 text-center">
            <img
              src={iconPreview}
              alt="Current Icon"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #35a542",
              }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <small className="text-success d-block mt-1">
              📷 Current icon (choose file to replace)
            </small>
          </div>
        )}

        <input
          type="file"
          className="form-control"
          onChange={handleIconChange}
          required={!isEdit}
        />

        {/* ✅ Preview of newly selected icon */}
        {preferenceIcon && iconPreview && (
          <div className="mt-2 text-center">
            <img
              src={iconPreview}
              alt="New Icon"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #ffc107",
              }}
            />
            <small className="text-warning d-block mt-1">✅ New icon selected</small>
          </div>
        )}
      </div>

      <div className="text-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default HealthPreferenceForm;