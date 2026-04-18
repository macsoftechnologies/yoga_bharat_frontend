import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { addYoga, updateYoga, getCategoryList } from "../services/authService";
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

// ✅ Helper: extract flat categoryId string and category_name from nested or flat object
const extractCategory = (rawCategoryId) => {
  if (!rawCategoryId) return { id: "", name: "" };
  if (typeof rawCategoryId === "object") {
    return {
      id: rawCategoryId.categoryId || "",
      name: rawCategoryId.category_name || "",
    };
  }
  return { id: rawCategoryId, name: "" };
};

function YogaForm({ onClose, initialData, isEdit, onSubmit }) {
  const [yogaName, setYogaName] = useState("");
  const [clientPrice, setClientPrice] = useState("");
  const [trainerPrice, setTrainerPrice] = useState("");
  const [yogaDesc, setYogaDesc] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("mins");
  const [benefits, setBenefits] = useState("");
  const [sessionIncludes, setSessionIncludes] = useState("");
  const [yogaImage, setYogaImage] = useState(null);
  const [yogaIcon, setYogaIcon] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Category state
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const imageInputRef = useRef();
  const iconInputRef = useRef();

  // ✅ Fetch all categories on mount
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await getCategoryList(1, 100);
        let data = [];
        if (res && Array.isArray(res.data)) {
          data = res.data;
        } else if (Array.isArray(res)) {
          data = res;
        }
        // Deduplicate by categoryId
        const unique = [];
        const seen = new Set();
        for (const cat of data) {
          if (!seen.has(cat.categoryId)) {
            seen.add(cat.categoryId);
            unique.push(cat);
          }
        }
        setCategoryList(unique);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchAllCategories();
  }, []);

  /* ===== PREFILL FOR EDIT ===== */
  useEffect(() => {
    if (isEdit && initialData) {
      setYogaName(initialData.yoga_name || "");
      setClientPrice(initialData.client_price || "");
      setTrainerPrice(initialData.trainer_price || "");
      setYogaDesc(initialData.yoga_desc || "");
      setBenefits(initialData.benefits || "");
      setSessionIncludes(initialData.session_includes || "");

      if (initialData.duration) {
        const parts = initialData.duration.split(" ");
        setDurationValue(parts[0] || "");
        setDurationUnit(parts[1] || "mins");
      }

      // ✅ Handle categoryId as nested object OR plain string
      const { id, name } = extractCategory(initialData.categoryId);
      setCategoryId(id);
      setCategoryName(name); // set immediately from nested object

      const base = process.env.REACT_APP_API_BASE_URL || "";
      const imgField = initialData.yoga_image || initialData.image || initialData.yogaImage || null;
      const iconField = initialData.yoga_icon || initialData.icon || initialData.yogaIcon || null;

      setImagePreview(imgField ? `${base}/${imgField}` : null);
      setIconPreview(iconField ? `${base}/${iconField}` : null);
      setYogaImage(null);
      setYogaIcon(null);
    }
  }, [initialData, isEdit]);

  // ✅ Safety net: resolve category name from list if not set from nested object
  useEffect(() => {
    if (isEdit && categoryId && categoryList.length > 0 && !categoryName) {
      const matched = categoryList.find(
        (cat) => String(cat.categoryId).trim() === String(categoryId).trim()
      );
      if (matched) setCategoryName(matched.category_name);
    }
  }, [categoryList, categoryId, isEdit, categoryName]);

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
    if (!categoryId) { Swal.fire("Validation Error", "Please select a category", "warning"); return; }

    const formData = new FormData();
    if (isEdit) formData.append("yogaId", initialData.yogaId);
    formData.append("yoga_name", yogaName);
    formData.append("client_price", clientPrice);
    formData.append("trainer_price", trainerPrice);
    formData.append("yoga_desc", yogaDesc);
    formData.append("duration", `${durationValue} ${durationUnit}`);
    formData.append("categoryId", categoryId);
    formData.append("benefits", benefits);
    formData.append("session_includes", sessionIncludes);
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

      <div className="row">
        {/* Yoga Name */}
        <div className="col-md-6 mb-3">
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

        {/* Category */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Category</label>
          {isEdit ? (
            // ✅ Edit: show resolved category_name as disabled input
            <input
              type="text"
              className="form-control"
              value={categoryName}
              disabled
              style={{ background: "#f5f5f5", cursor: "not-allowed", opacity: 1 }}
            />
          ) : (
            // Add: show dropdown
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categoryList.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Learner Price</label>
          <input
            type="number"
            className="form-control"
            value={clientPrice}
            onChange={(e) => setClientPrice(e.target.value)}
            placeholder="Enter learner price (e.g. 500)"
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
            placeholder="Enter trainer price (e.g. 400)"
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
            placeholder="Enter duration (e.g. 30)"
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
          rows={3}
          value={yogaDesc}
          onChange={(e) => setYogaDesc(e.target.value)}
          placeholder="Enter yoga description"
          required
        />
      </div>

      {/* ✅ NEW: Benefits */}
      <div className="mb-3">
        <label className="form-label">Benefits</label>
        <textarea
          className="form-control"
          rows={3}
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder="Enter benefits (e.g. Improves flexibility, Reduces stress)"
        />
      </div>

      {/* ✅ NEW: Session Includes */}
      <div className="mb-3">
        <label className="form-label">Session Includes</label>
        <textarea
          className="form-control"
          rows={3}
          value={sessionIncludes}
          onChange={(e) => setSessionIncludes(e.target.value)}
          placeholder="Enter what session includes (e.g. Warm-up, Breathing exercises)"
        />
      </div>

      <div className="row">
        {/* YOGA IMAGE */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Image</label>

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

        {/* YOGA ICON */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Icon</label>

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