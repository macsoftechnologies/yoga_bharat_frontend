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

  useEffect(() => {
    fetchTutorials(currentPage);
  }, [currentPage]);

  const fetchTutorials = async (page) => {
    try {
      const res = await getAppTutorials(page, 10);
      console.log("Tutorials response:", res);

      let data = [];
      let pages = 1;

      // Case 1: paginated response
      if (res && Array.isArray(res.data)) {
        data = res.data;
        pages = res.totalPages || 1;
      }
      // Case 2: array response
      else if (Array.isArray(res)) {
        data = res;
      }

      // 🔑 map backend user_type → frontend usertype
      const mappedData = data.map((item) => ({
        ...item,
        usertype: item.usertype || item.user_type || "",
      }));

      setTutorialsList(mappedData);
      setTotalPages(pages);
    } catch (err) {
      console.error(err);
      setTutorialsList([]);
      setTotalPages(1);
      Swal.fire("Error", "Failed to fetch tutorials", "error");
    }
  };

  const handleView = async (appId) => {
    try {
      console.log("....apptutorial", appId);
      const res = await getAppTutorialById(appId.appId);
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

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
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

    setTutorialsList((prev) =>
      prev.filter((item) => item.appId !== appId)
    );

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
  } catch (err) {
    console.error(err);
    Swal.fire(
      "Error",
      err.response?.data?.message || "Delete failed",
      "error"
    );
  }
};



  const handleSubmit = async (formData) => {
    try {
      if (selectedItem && editOpen) {
        formData.append("appId", selectedItem.appId);
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

      fetchTutorials();
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const columns = [
    { header: "User Type", accessor: "usertype" },
    { header: "Tutorial Image", accessor: "app_image" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = tutorialsList.map((item) => ({
    ...item,
    app_image: item.app_image ? (
      <video
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.app_image}`}
        width="200"
        height="150"
        controls
        playsInline
        style={{ borderRadius: "8px", marginTop: "10px" }}
      >
        Your browser does not support the video tag.
      </video>
    ) : (
      // <video
      //   src={process.env.REACT_APP_API_BASE_URL + "/" + item.app_image}
      //   alt={item.usertype}
      //   width="60"
      //   height="60"

      // />
      "No Image"
    ),
    actions: (
      <div className="actions">
        <button
          className="icon-btn view"
          title="View"
          onClick={() => handleView(item)}
        >
          <FaEye />
        </button>

        <button
          className="icon-btn edit"
          title="Edit"
          onClick={() => handleEdit(item)}
        >
          <FaEdit />
        </button>

        <button
          className="icon-btn delete"
          title="Delete"
          onClick={() => handleDelete(item.appId)}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>APP TUTORIALS</h2>
        <Button
          text="+ Add Tutorial"
          color="orange"
          onClick={() => setOpen(true)}
        />
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Tutorial"
        size="lg"
      >
        <AppTutorialForm
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Tutorial"
        size="lg"
      >
        <AppTutorialForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="View Tutorial"
        size="lg"
      >
        {selectedItem && (
        <div className="container-fluid p-2">
  <div className="row align-items-start">
    
    {/* LEFT SIDE – TEXT (col-md-6) */}
    <div className="col-md-4">
      <p>
        <b>User Type:</b> {selectedItem.usertype}
      </p>
    </div>

    {/* RIGHT SIDE – VIDEO (col-md-6) */}
    <div className="col-md-8">
      <p>
        <b>Tutorial Image:</b>
      </p>

      {selectedItem.app_image ? (
        <video
          src={`${process.env.REACT_APP_API_BASE_URL}/${selectedItem.app_image}`}
          width="100%"
          height="300"
          controls
          playsInline
          style={{ borderRadius: "8px", marginTop: "5px" }}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>No Image</p>
      )}
    </div>

  </div>

  {/* CLOSE BUTTON */}
  <div className="text-end mt-3">
    <button
      className="btn btn-secondary"
      onClick={() => setViewOpen(false)}
    >
      Close
    </button>
  </div>
</div>

        )}
      </Modal>
    </div>
  );
}

/* FORM */

function AppTutorialForm({ onClose, initialData, isEdit, onSubmit }) {
  const [usertype, setUsertype] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!isEdit) {
      formData.append("usertype", usertype);
    }
    if (imageFile) {
      formData.append("app_image", imageFile);
    } else if (initialData?.app_image && isEdit) {
      formData.append("app_image", initialData.app_image);
    }

    onSubmit(formData);
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* ADD ONLY */}
      {!isEdit && (
        <div className="mb-3">
          <label className="form-label">User Type</label>
          <select
            className="form-control"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            <option value="client">Client</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Tutorial Image</label>
        <input
          type="file"
          className="form-control"
          accept="*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      <div className="text-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
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
