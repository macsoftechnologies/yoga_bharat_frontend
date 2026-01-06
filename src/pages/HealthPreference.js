import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import HealthPreferenceForm from "../forms/HealthPreferenceForm";
import Swal from "sweetalert2";
import { HealthPreferenceById, getHealthPreferences, deleteHealthPreference } from "../services/authService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function HealthPreference() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Fetch data
  const fetchData = async (page) => {
  try {
    const res = await getHealthPreferences(page, 10);
    console.log("HealthPreferences response:", res);

    let listData = [];
    let pages = 1;
    if (res && Array.isArray(res.data)) {
      listData = res.data;
      pages = res.totalPages || 1;
    }
    else if (Array.isArray(res)) {
      listData = res;
    }

    const transformed = listData.map((item) => ({
      prefId: item.prefId,
      name: item.preference_name,
      icon: item.preference_icon,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    setList(transformed);
    setTotalPages(pages);

  } catch (error) {
    console.error("Fetch error:", error);
    setList([]);
    setTotalPages(1);
  }
  };

  // View
  const handleView = async (prefId) => {
    try {
      const res = await HealthPreferenceById(prefId);
      setSelectedItem({
        name: res.data.preference_name,
        icon: res.data.preference_icon,
      });
      setViewOpen(true);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to fetch details",
        "error"
      );
    }
  };

  // Edit
  const handleEdit = async (prefId) => {
    try {
      const res = await HealthPreferenceById(prefId);
      setSelectedItem({
        prefId: res.data.prefId,
        name: res.data.preference_name,
        icon: res.data.preference_icon,
      });
      setEditOpen(true);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to fetch edit details",
        "error"
      );
    }
  };

  // Delete
  const deleteItem = async (prefId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#35a542", 
      cancelButtonColor: "#ff7a00",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteHealthPreference(prefId);
      Swal.fire({
        title: "Deleted!",
        text: res.message || "Record deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000, 
        timerProgressBar: true,
        color: "#ffffff", 
        background: "#ff7a00",
      });
      await fetchData();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  // After Add/Update
  const handleSubmit = async () => {
    await fetchData();
    setSelectedItem(null);
    setOpen(false);
    setEditOpen(false);
  };

  // Table columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Icon", accessor: "icon" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = list.map((item) => ({
    ...item,
    icon: item.icon ? (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.icon}`}
        alt="Preference Icon"
        width="40"
        height="40"
        style={{ objectFit: "cover", borderRadius: "15px" }}
      />
    ) : "N/A",
    actions: (
      <div className="actions">
        <button
          className="icon-btn view"
          title="View"
          onClick={() => handleView(item.prefId)}
        >
          <FaEye />
        </button>

        <button
          className="icon-btn edit"
          title="Edit"
          onClick={() => handleEdit(item.prefId)}
        >
          <FaEdit />
        </button>

        <button
          className="icon-btn delete"
          title="Delete"
          onClick={() => deleteItem(item.prefId)}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>HEALTH PREFERENCE LIST</h2>
        <Button text="+ Add Health Preference" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Add Health Preference" size="lg">
        <HealthPreferenceForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Health Preference" size="lg">
        <HealthPreferenceForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Health Preference Details" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>Name:</b> {selectedItem.name}</p>
            <p>
              <b>Icon:</b>{" "}
              {selectedItem.icon ? (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/${selectedItem.icon}`}
                  alt="icon"
                  width="250"
                />
              ) : "N/A"}
            </p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default HealthPreference;
