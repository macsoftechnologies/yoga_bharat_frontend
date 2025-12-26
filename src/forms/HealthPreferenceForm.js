import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addHealthPreference, updateHealthPreference } from "../services/authService";
import "./form.css";

function HealthPreferenceForm({ onClose, isEdit, initialData, onSubmit }) {
  const [preferenceName, setPreferenceName] = useState("");
  const [preferenceIcon, setPreferenceIcon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill form when editing
    useEffect(() => {
    if (isEdit && initialData) {
      setPreferenceName(initialData.name || "");
      setPreferenceIcon(null); // optional
    }
  }, [isEdit, initialData]);

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

      // Use correct key: prefId
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
        timer: 6000,          // 8 seconds
        timerProgressBar: true,
        color: "#ffffff", 
        background: "#35a542",
      });


      onSubmit(); // Refresh table
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
        <input
          type="file"
          className="form-control"
          onChange={(e) => setPreferenceIcon(e.target.files[0])}
          required={!isEdit}
        />
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
