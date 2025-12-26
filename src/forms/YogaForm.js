import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addYoga, updateYoga } from "../services/authService";
import "./form.css";

function YogaForm({ onClose, initialData, isEdit, onSubmit }) {
  const [yogaName, setYogaName] = useState("");
  const [clientPrice, setClientPrice] = useState("");
  const [trainerPrice, setTrainerPrice] = useState("");
  const [yogaDesc, setYogaDesc] = useState("");

  // Duration (single backend field)
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("mins");

  const [yogaImage, setYogaImage] = useState(null);
  const [yogaIcon, setYogaIcon] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== PREFILL FOR EDIT ===== */
  useEffect(() => {
    if (isEdit && initialData) {
      setYogaName(initialData.yoga_name || "");
      setClientPrice(initialData.client_price || "");
      setTrainerPrice(initialData.trainer_price || "");
      setYogaDesc(initialData.yoga_desc || "");

      // Split "30 mins"
      if (initialData.duration) {
        const [value, unit] = initialData.duration.split(" ");
        setDurationValue(value || "");
        setDurationUnit(unit || "mins");
      }

      setYogaImage(null);
      setYogaIcon(null);
    }
  }, [initialData, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!yogaName) {
      Swal.fire("Validation Error", "Yoga Name is required", "warning");
      return;
    }

    if (!durationValue) {
      Swal.fire("Validation Error", "Duration is required", "warning");
      return;
    }

    // ✅ SINGLE duration field
    const duration = `${durationValue} ${durationUnit}`;

    const formData = new FormData();
    if (isEdit) formData.append("yogaId", initialData.yogaId);

    formData.append("yoga_name", yogaName);
    formData.append("client_price", clientPrice);
    formData.append("trainer_price", trainerPrice);
    formData.append("yoga_desc", yogaDesc);
    formData.append("duration", duration); // ✅ only one value

    if (yogaImage) formData.append("yoga_image", yogaImage);
    if (yogaIcon) formData.append("yoga_icon", yogaIcon);

    try {
      setLoading(true);
      const response = isEdit
        ? await updateYoga(formData)
        : await addYoga(formData);

      Swal.fire({
        title: isEdit ? "Updated!" : "Added!",
        text: response.message || "Success",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        color: "#ffffff",
        background: "#35a542",
      });

      onSubmit(); // refresh list
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
        <label className="form-label">Yoga Name</label>
        <input
          type="text"
          className="form-control"
          value={yogaName}
          onChange={(e) => setYogaName(e.target.value)}
          placeholder="Enter Yoga Name"
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Client Price</label>
          <input
            type="number"
            className="form-control"
            value={clientPrice}
            onChange={(e) => setClientPrice(e.target.value)}
            placeholder="500"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Trainer Price</label>
          <input
            type="number"
            className="form-control"
            value={trainerPrice}
            onChange={(e) => setTrainerPrice(e.target.value)}
            placeholder="400"
            required
          />
        </div>
      </div>

      {/* ===== DURATION (SINGLE BACKEND FIELD) ===== */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Duration</label>
          <input
            type="number"
            className="form-control"
            value={durationValue}
            onChange={(e) => setDurationValue(e.target.value)}
            placeholder="30"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Unit</label>
          <select
            className="form-select"
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value)}
          >
            <option value="mins">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={yogaDesc}
          onChange={(e) => setYogaDesc(e.target.value)}
          placeholder="Yoga description"
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setYogaImage(e.target.files[0])}
            required={!isEdit}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Icon</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setYogaIcon(e.target.files[0])}
            required={!isEdit}
          />
        </div>
      </div>

      <div className="text-end mt-3">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Yoga" : "Save Yoga"}
        </button>
      </div>
    </form>
  );
}

export default YogaForm;
