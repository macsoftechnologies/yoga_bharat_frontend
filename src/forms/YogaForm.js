import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { addYoga, updateYoga } from "../services/authService";
import "./form.css";

// ✅ Compress image before upload to fix 413 error
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
          },
          "image/jpeg",
          quality
        );
      };
    };
  });
};

function YogaForm({ onClose, initialData, isEdit, onSubmit }) {
  const [yogaName, setYogaName] = useState("");
  const [clientPrice, setClientPrice] = useState("");
  const [trainerPrice, setTrainerPrice] = useState("");
  const [yogaDesc, setYogaDesc] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("mins");
  const [yogaImage, setYogaImage] = useState(null);
  const [yogaIcon, setYogaIcon] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef();
  const iconInputRef = useRef();

  /* ===== PREFILL FOR EDIT ===== */
  useEffect(() => {
    if (isEdit && initialData) {
      console.log("=== EDIT initialData ===", JSON.stringify(initialData, null, 2));

      setYogaName(initialData.yoga_name || "");
      setClientPrice(initialData.client_price || "");
      setTrainerPrice(initialData.trainer_price || "");
      setYogaDesc(initialData.yoga_desc || "");

      if (initialData.duration) {
        const parts = initialData.duration.split(" ");
        setDurationValue(parts[0] || "");
        setDurationUnit(parts[1] || "mins");
      }

      // ✅ Prefix with base URL so image renders correctly (same as LawForm)
      const base = process.env.REACT_APP_API_BASE_URL || "";
      const imgField = initialData.yoga_image || initialData.image || initialData.yogaImage || null;
      const iconField = initialData.yoga_icon || initialData.icon || initialData.yogaIcon || null;

      setImagePreview(imgField ? `${base}/${imgField}` : null);
      setIconPreview(iconField ? `${base}/${iconField}` : null);
      setYogaImage(null);
      setYogaIcon(null);
    }
  }, [initialData, isEdit]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setYogaImage(await compressImage(file));
  };

  const handleIconChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIconPreview(URL.createObjectURL(file));
    setYogaIcon(await compressImage(file, 200, 0.8));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!yogaName) { Swal.fire("Validation Error", "Yoga Name is required", "warning"); return; }
    if (!durationValue) { Swal.fire("Validation Error", "Duration is required", "warning"); return; }

    const formData = new FormData();
    if (isEdit) formData.append("yogaId", initialData.yogaId);
    formData.append("yoga_name", yogaName);
    formData.append("client_price", clientPrice);
    formData.append("trainer_price", trainerPrice);
    formData.append("yoga_desc", yogaDesc);
    formData.append("duration", `${durationValue} ${durationUnit}`);
    if (yogaImage) formData.append("yoga_image", yogaImage);
    if (yogaIcon) formData.append("yoga_icon", yogaIcon);

    try {
      setLoading(true);
      const response = isEdit ? await updateYoga(formData) : await addYoga(formData);
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
      onSubmit();
      onClose();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
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
        {/* ===== YOGA IMAGE ===== */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Image</label>

          {/* ✅ Show current image ABOVE the file input when editing (same as LawForm) */}
          {isEdit && imagePreview && !yogaImage && (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt="Current Yoga"
                style={{
                  width: "100%",
                  height: "130px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #35a542",
                }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <small className="text-success d-block mt-1">📷 Current image (choose file to replace)</small>
            </div>
          )}

          <input
            type="file"
            className="form-control"
            ref={imageInputRef}
            accept="image/*"
            onChange={handleImageChange}
            required={!isEdit}
          />

          {/* Preview of newly selected image */}
          {yogaImage && imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="New Yoga"
                style={{
                  width: "100%",
                  height: "130px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #ffc107",
                }}
              />
              <small className="text-warning d-block mt-1">✅ New image selected</small>
            </div>
          )}
        </div>

        {/* ===== YOGA ICON ===== */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Icon</label>

          {/* ✅ Show current icon ABOVE the file input when editing (same as LawForm) */}
          {isEdit && iconPreview && !yogaIcon && (
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
              <small className="text-success d-block mt-1">📷 Current icon (choose file to replace)</small>
            </div>
          )}

          <input
            type="file"
            className="form-control"
            ref={iconInputRef}
            accept="image/*"
            onChange={handleIconChange}
            required={!isEdit}
          />

          {/* Preview of newly selected icon */}
          {yogaIcon && iconPreview && (
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
      </div>

      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
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