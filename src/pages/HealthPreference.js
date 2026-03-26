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
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const fetchData = async (page, activeLimit) => {
    setLoading(true);
    try {
      const res = await getHealthPreferences(page, activeLimit);
      console.log("HealthPreferences response:", res);

      let listData = [];
      let pages = 1;
      let total = 0;

      if (res && Array.isArray(res.data)) {
        listData = res.data;
        pages = res.totalPages || 1;
        total = res.totalCount || 0;
      } else if (Array.isArray(res)) {
        listData = res;
        total = res.length;
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
      setTotalCount(total);
    } catch (error) {
      console.error("Fetch error:", error);
      setList([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setCurrentPage(1);
    fetchData(1, newLimit);
  };

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
      await fetchData(currentPage, limit);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  const handleSubmit = async () => {
    await fetchData(currentPage, limit);
    setSelectedItem(null);
    setOpen(false);
    setEditOpen(false);
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Name", accessor: "name" },
    { header: "Icon", accessor: "icon" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = list.map((item, index) => ({
    srNo: (currentPage - 1) * limit + index + 1,
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
        <button className="icon-btn view" onClick={() => handleView(item.prefId)}>
          <FaEye />
        </button>
        <button className="icon-btn edit" onClick={() => handleEdit(item.prefId)}>
          <FaEdit />
        </button>
        <button className="icon-btn delete" onClick={() => deleteItem(item.prefId)}>
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
          Showing <strong style={{ color: "#ff7a00" }}>{list.length}</strong>{" "}
          {totalCount > list.length && <>of <strong>{totalCount}</strong></>} records
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

      <Modal open={open} onClose={() => setOpen(false)} title="Add Health Preference" size="md">
        <HealthPreferenceForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Health Preference" size="md">
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