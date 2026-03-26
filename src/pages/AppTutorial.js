import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  addAppTutorial,
  getAppTutorials,
  getAppTutorialById,
  updateAppTutorial,
  deleteAppTutorial,
} from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function AppTutorial() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tutorialsList, setTutorialsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10); // ✅ Records per page
  const [loading, setLoading] = useState(false);

  // ✅ Fetch tutorials when page or limit changes
  useEffect(() => {
    fetchTutorials(currentPage, limit);
  }, [currentPage, limit]);

  // ✅ Fetch tutorials function
  const fetchTutorials = async (page, limitValue) => {
    setLoading(true);
    try {
      const res = await getAppTutorials(page, limitValue);

      let data = [];
      let pages = 1;
      let total = 0;

      if (res && Array.isArray(res.data)) {
        data = res.data;
        pages = res.totalPages || 1;
        total = res.totalCount || res.count || data.length;
      } else if (Array.isArray(res)) {
        data = res;
        total = data.length;
      }

      const mappedData = data.map((item) => ({
        ...item,
        usertype: item.usertype || item.user_type || "",
      }));

      setTutorialsList(mappedData);
      setTotalPages(pages);
      setTotalCount(total);
    } catch (err) {
      console.error(err);
      setTutorialsList([]);
      setTotalPages(1);
      setTotalCount(0);
      Swal.fire("Error", "Failed to fetch tutorials", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle changing records per page
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleView = async (item) => {
    try {
      const res = await getAppTutorialById(item.appId);
      setSelectedItem({
        ...res.data,
        usertype: res.data.usertype || res.data.user_type || "",
      });
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch tutorial details", "error");
    }
  };

  const handleEdit = async (item) => {
    try {
      const res = await getAppTutorialById(item.appId);
      setSelectedItem({
        ...res.data,
        usertype: res.data.usertype || res.data.user_type || "",
      });
      setEditOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch tutorial details", "error");
    }
  };

  const handleDelete = async (appId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This tutorial will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#35a542",
      cancelButtonColor: "#ff7a00",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteAppTutorial(appId);
      setTutorialsList((prev) => prev.filter((item) => item.appId !== appId));
      Swal.fire({
        title: "Deleted!",
        text: "Tutorial deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff7a00",
        color: "#ffffff",
      });
      fetchTutorials(currentPage, limit);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedItem && editOpen) {
        await updateAppTutorial(formData);
        Swal.fire({
          title: "Updated!",
          text: "Tutorial updated successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#28a745",
          color: "#ffffff",
        });
      } else {
        await addAppTutorial(formData);
        Swal.fire({
          title: "Added!",
          text: "Tutorial added successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#28a745",
          color: "#ffffff",
        });
      }

      fetchTutorials(currentPage, limit);
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "User Type", accessor: "usertype" },
    { header: "Description", accessor: "description" },
    { header: "Tutorial Video", accessor: "app_image" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = tutorialsList.map((item, index) => ({
    srNo: (currentPage - 1) * limit + index + 1,
    ...item,
    description: (
      <span
        title={item.description || "-"}
        style={{
          display: "block",
          maxWidth: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
        }}
      >
        {item.description || "-"}
      </span>
    ),
    app_image: item.app_image ? (
      <video
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.app_image}`}
        width="160"
        height="90"
        controls
        playsInline
        style={{ borderRadius: "8px" }}
      >
        Your browser does not support the video tag.
      </video>
    ) : (
      "No Video"
    ),
    actions: (
      <div className="actions">
        <button className="icon-btn view" title="View" onClick={() => handleView(item)}>
          <FaEye />
        </button>
        <button className="icon-btn edit" title="Edit" onClick={() => handleEdit(item)}>
          <FaEdit />
        </button>
        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(item.appId)}>
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>APP TUTORIALS</h2>
        <Button text="+ Add Tutorial" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* ✅ Records per page + count display */}
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
          Showing <strong style={{ color: "#ff7a00" }}>{tutorialsList.length}</strong>{" "}
          {totalCount > tutorialsList.length && <>of <strong>{totalCount}</strong></>} records
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

      <Modal open={open} onClose={() => setOpen(false)} title="Add Tutorial" size="md">
        <AppTutorialForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Tutorial" size="md">
        {selectedItem && (
          <AppTutorialForm
            key={selectedItem.appId}
            onClose={() => setEditOpen(false)}
            initialData={selectedItem}
            isEdit
            onSubmit={handleSubmit}
          />
        )}
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Tutorial" size="lg">
        {selectedItem && (
          <div className="container-fluid p-2">
            <div className="row align-items-start">
              <div className="col-12">
                <p><b>User Type:</b> {selectedItem.usertype}</p>
                <p><b>Description:</b> {selectedItem.description || "No Description"}</p>
                <p><b>Tutorial Video:</b></p>
                {selectedItem.app_image ? (
                  <video
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedItem.app_image}`}
                    width="100%"
                    height="350"
                    controls
                    playsInline
                    style={{ borderRadius: "8px", marginTop: "5px" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>No Video</p>
                )}
              </div>
            </div>
            <div className="text-end mt-3">
              <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AppTutorialForm({ onClose, initialData, isEdit, onSubmit }) {
  const [usertype, setUsertype] = useState(initialData?.usertype || initialData?.user_type || "");
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState(initialData?.description || "");
  const [previewUrl, setPreviewUrl] = useState(
    initialData?.app_image ? `${process.env.REACT_APP_API_BASE_URL}/${initialData.app_image}` : null
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (isEdit && initialData?.appId) {
      formData.append("appId", initialData.appId);
    }

    formData.append("usertype", usertype);
    formData.append("description", description);

    if (imageFile) {
      formData.append("app_image", imageFile);
    } else if (isEdit && initialData?.app_image) {
      formData.append("app_image", initialData.app_image);
    }

    onSubmit(formData);
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {!isEdit ? (
        <div className="mb-3">
          <label className="form-label">User Type</label>
          <select
            className="form-select"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            <option value="client">Client</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>
      ) : (
        <div className="mb-3">
          <label className="form-label">User Type</label>
          <input className="form-control" value={usertype} readOnly style={{ backgroundColor: "#e9ecef" }} />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Enter tutorial description"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Tutorial Video</label>
        <input type="file" className="form-control" accept="video/*" onChange={handleFileChange} />
        {previewUrl && (
          <div className="mt-2">
            <small className="text-muted d-block mb-1">
              {imageFile ? "New Video Preview:" : "Current Video:"}
            </small>
            <video key={previewUrl} src={previewUrl} width="100%" height="180" controls playsInline style={{ borderRadius: "8px" }}>
              Your browser does not support the video tag.
            </video>
          </div>
        )}
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

export default AppTutorial;