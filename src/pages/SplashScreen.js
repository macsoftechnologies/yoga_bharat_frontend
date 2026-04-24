import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import "../forms/form.css";
import {
  addSplashScreen,
  getSplashScreens,
  getSplashScreenById,
  updateSplashScreen,
  deleteSplashScreen,
} from "../services/authService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function SplashScreenPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [splashList, setSplashList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSplashScreens = async (page, activeLimit) => {
    setLoading(true);
    try {
      const res = await getSplashScreens(page, activeLimit);
      if (res && Array.isArray(res.data)) {
        setSplashList(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      } else {
        setSplashList([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to fetch splash screens", "error");
      setSplashList([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSplashScreens(currentPage, limit);
  }, [currentPage, limit]);

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setCurrentPage(1);
    fetchSplashScreens(1, newLimit);
  };

  const handleView = async (splashscreenId) => {
    try {
      const res = await getSplashScreenById(splashscreenId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch {
      Swal.fire("Error", "Failed to fetch details", "error");
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDelete = async (splashscreenId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This splash screen will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff7a00",
      cancelButtonColor: "#28a745",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteSplashScreen(splashscreenId);
      Swal.fire({
        title: "Deleted!",
        text: res.message || "Splash screen deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#ff7a00",
        color: "#ffffff",
      });
      fetchSplashScreens(currentPage, limit);
    } catch {
      Swal.fire("Error", "Failed to delete splash screen", "error");
    }
  };

  // handleSubmit now receives a FormData object directly from the form
  const handleSubmit = async (formData) => {
    try {
      let res;
      if (selectedItem && editOpen) {
        res = await updateSplashScreen(formData);
        Swal.fire({
          title: "Updated!",
          text: res.message || "Splash screen updated successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: "#35a542",
          color: "#ffffff",
        });
      } else {
        res = await addSplashScreen(formData);
        Swal.fire({
          title: "Added!",
          text: res.message || "Splash screen added successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: "#35a542",
          color: "#ffffff",
        });
      }
    } catch {
      Swal.fire("Error", "Failed to save splash screen", "error");
    } finally {
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
      fetchSplashScreens(currentPage, limit);
    }
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Screen Type", accessor: "screen_type" },
    { header: "Screen Image", accessor: "screen_image" },
    { header: "Screen No", accessor: "screen_no" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = splashList.map((item, index) => ({
    srNo: (currentPage - 1) * limit + index + 1,
    ...item,
    screen_image: item.screen_image ? (
      <img
        src={process.env.REACT_APP_API_BASE_URL + "/" + item.screen_image}
        alt="splash"
        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
      />
    ) : (
      "-"
    ),
    actions: (
      <div className="actions">
        <button className="icon-btn view" onClick={() => handleView(item.splashscreenId)}>
          <FaEye />
        </button>
        <button className="icon-btn edit" onClick={() => handleEdit(item)}>
          <FaEdit />
        </button>
        <button className="icon-btn delete" onClick={() => handleDelete(item.splashscreenId)}>
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>SPLASH SCREENS</h2>
        <Button text="+ Add Splash Screen" color="orange" onClick={() => setOpen(true)} />
      </div>

      <div className="d-flex align-items-center justify-content-between mb-2 p-2">
        <div className="d-flex align-items-center gap-2">
          <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>
            Records per page:
          </label>
          <select
            className="form-select form-select-sm"
            style={{ border: "2px solid #ff7a00", padding: "2px", cursor: "pointer", width: "75px" }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <span style={{ fontSize: "16px" }}>
          Showing <strong style={{ color: "#ff7a00" }}>{splashList.length}</strong>{" "}
          {totalCount > splashList.length && (
            <>
              of <strong>{totalCount}</strong>
            </>
          )}{" "}
          records
        </span>
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Splash Screen" size="md">
        <SplashScreenForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Splash Screen" size="md">
        <SplashScreenForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Splash Screen" size="md">
        {selectedItem && (
          <div style={{ padding: 10 }}>
            <p>
              <b>Screen Image:</b>
            </p>
            {selectedItem.screen_image ? (
              <img
                src={selectedItem.screen_image}
                alt="Splash Screen"
                style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 8, marginBottom: 12 }}
              />
            ) : (
              <p>No image available</p>
            )}
            <p><b>Screen Type:</b> {selectedItem.screen_type}</p>
            <p><b>Screen No:</b> {selectedItem.screen_no}</p>
            <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SplashScreenForm({ onClose, initialData, isEdit, onSubmit }) {
  const [screenType, setScreenType] = useState(initialData?.screen_type || "");
  const [screenNo, setScreenNo] = useState(initialData?.screen_no || "");
  const [screenImage, setScreenImage] = useState(null);        // File object
  const [imagePreview, setImagePreview] = useState(initialData?.screen_image || null);

  useEffect(() => {
    if (isEdit && initialData) {
      setScreenType(initialData.screen_type || "");
      setScreenNo(initialData.screen_no || "");
      setScreenImage(null);
      setImagePreview(initialData.screen_image || null);
    }
  }, [initialData, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (isEdit) {
      formData.append("splashscreenId", initialData.splashscreenId);
    }
    formData.append("screen_type", screenType);
    formData.append("screen_no", screenNo);
    if (screenImage) {
      formData.append("screen_image", screenImage);
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Screen Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImageChange}
          // Required only when adding; on edit, existing image is retained if no new file picked
          required={!isEdit}
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 6, border: "1px solid #ddd" }}
            />
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Screen Type</label>
        <select
          className="form-select"
          value={screenType}
          onChange={(e) => setScreenType(e.target.value)}
          disabled={isEdit}
          required
        >
          <option value="">Select Screen Type</option>
          <option value="client">Client</option>
          <option value="trainer">Trainer</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Screen No</label>
        <select
          className="form-select"
          value={screenNo}
          onChange={(e) => setScreenNo(e.target.value)}
          disabled={isEdit}
          required
        >
          <option value="">Select Screen No</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div className="text-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default SplashScreenPage;