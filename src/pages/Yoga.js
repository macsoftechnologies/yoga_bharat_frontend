import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import YogaForm from "../forms/YogaForm";
import { getYogaList, yogaById, deleteYoga } from "../services/authService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

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

const parseNumberedPoints = (text) => {
  if (!text) return [];
  const parts = text.split(/(?=\d+\.)/).map((s) => s.trim()).filter(Boolean);
  return parts;
};

function Yoga() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [yogaList, setYogaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const fetchData = async (page, activeLimit) => {
    setLoading(true);
    try {
      const res = await getYogaList(page, activeLimit);
      const yogaData = Array.isArray(res.data) ? res.data : [];

      setYogaList(
        yogaData.map((item) => {
          const { id: catId, name: catName } = extractCategory(item.categoryId);
          return {
            yogaId: item.yogaId,
            yoga_name: item.yoga_name,
            client_price: item.client_price,
            trainer_price: item.trainer_price,
            yoga_desc: item.yoga_desc,
            yoga_image: item.yoga_image,
            yoga_icon: item.yoga_icon,
            duration: item.duration,
            benefits: item.benefits || "",
            session_includes: item.session_includes || "",
            categoryId: item.categoryId,
            _categoryId: catId,
            _categoryName: catName,
          };
        })
      );

      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || 0);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch Yoga list",
        "error"
      );
      setYogaList([]);
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

  const handleView = async (yogaId) => {
    try {
      const res = await yogaById(yogaId);
      const yoga = Array.isArray(res.data) ? res.data[0] : res.data;
      const { id: catId, name: catName } = extractCategory(yoga.categoryId);
      setSelectedYoga({
        yogaId: yoga.yogaId,
        yoga_name: yoga.yoga_name,
        client_price: yoga.client_price,
        trainer_price: yoga.trainer_price,
        yoga_desc: yoga.yoga_desc,
        yoga_image: yoga.yoga_image,
        yoga_icon: yoga.yoga_icon,
        duration: yoga.duration,
        benefits: yoga.benefits || "",
        session_includes: yoga.session_includes || "",
        categoryId: yoga.categoryId,
        _categoryId: catId,
        _categoryName: catName,
      });
      setViewOpen(true);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to fetch Yoga details", "error");
    }
  };

  const handleEdit = async (yogaId) => {
    try {
      const res = await yogaById(yogaId);
      const yoga = Array.isArray(res.data) ? res.data[0] : res.data;
      const { id: catId, name: catName } = extractCategory(yoga.categoryId);
      setSelectedYoga({
        yogaId: yoga.yogaId,
        yoga_name: yoga.yoga_name,
        client_price: yoga.client_price,
        trainer_price: yoga.trainer_price,
        yoga_desc: yoga.yoga_desc,
        yoga_image: yoga.yoga_image,
        yoga_icon: yoga.yoga_icon,
        duration: yoga.duration,
        benefits: yoga.benefits || "",
        session_includes: yoga.session_includes || "",
        categoryId: catId,
        category_name: catName,
      });
      setEditOpen(true);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to fetch Yoga details", "error");
    }
  };

  const handleDelete = async (yogaId) => {
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
      const res = await deleteYoga(yogaId);
      Swal.fire({
        title: "Deleted!",
        text: res.message || "Yoga deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        color: "#ffffff",
        background: "#ff7a00",
      });
      fetchData(currentPage, limit);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleSubmit = () => {
    fetchData(currentPage, limit);
    setSelectedYoga(null);
    setOpen(false);
    setEditOpen(false);
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Yoga Name", accessor: "yoga_name" },
    { header: "Category", accessor: "_categoryName" },
    { header: "Client Price", accessor: "client_price" },
    { header: "Trainer Price", accessor: "trainer_price" },
    { header: "Description", accessor: "yoga_desc" },
    { header: "Image", accessor: "yoga_image" },
    { header: "Icon", accessor: "yoga_icon" },
    { header: "Duration", accessor: "duration" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = yogaList.map((item, index) => ({
    srNo: (currentPage - 1) * limit + index + 1,
    ...item,

    _categoryName: (
      <span
        style={{
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #bbf7d0",
          borderRadius: "6px",
          padding: "2px 10px",
          fontSize: "13px",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {item._categoryName || "-"}
      </span>
    ),

    yoga_desc: (
      <span
        title={item.yoga_desc}
        style={{
          display: "block",
          maxWidth: "180px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
        }}
      >
        {item.yoga_desc}
      </span>
    ),

    yoga_image: item.yoga_image ? (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.yoga_image}`}
        alt="Yoga"
        style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px", display: "block" }}
      />
    ) : "N/A",

    yoga_icon: item.yoga_icon ? (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.yoga_icon}`}
        alt="Icon"
        style={{ width: "38px", height: "38px", objectFit: "cover", borderRadius: "8px", display: "block" }}
      />
    ) : "N/A",

    actions: (
      <div className="actions">
        <button className="icon-btn view" title="View" onClick={() => handleView(item.yogaId)}>
          <FaEye />
        </button>
        <button className="icon-btn edit" title="Edit" onClick={() => handleEdit(item.yogaId)}>
          <FaEdit />
        </button>
        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(item.yogaId)}>
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>YOGA LIST</h2>
        <Button text="+ Add Yoga" color="orange" onClick={() => setOpen(true)} />
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

        <span style={{ fontSize: "16px", color: "#000" }}>
          Showing <strong style={{ color: "#ff7a00" }}>{yogaList.length}</strong>{" "}
          {totalCount > yogaList.length ? (<>of <strong>{totalCount}</strong></>) : null}{" "}
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

      <Modal open={open} onClose={() => setOpen(false)} title="Add Yoga" size="lg">
        <YogaForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Yoga" size="lg">
        <YogaForm
          onClose={() => setEditOpen(false)}
          initialData={selectedYoga}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Yoga Details" size="lg">
        {selectedYoga && (
          <div className="container" style={{ padding: "10px" }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><b>Yoga Name:</b> {selectedYoga.yoga_name}</p>
              </div>
              <div className="col-md-6">
                <p><b>Duration:</b> {selectedYoga.duration}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <p>
                  <b>Category:</b>{" "}
                  <span
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {selectedYoga._categoryName || "-"}
                  </span>
                </p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <p><b>Learner Price:</b> {selectedYoga.client_price}</p>
              </div>
              <div className="col-md-6">
                <p><b>Trainer Price:</b> {selectedYoga.trainer_price}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <p><b>Description:</b> {selectedYoga.yoga_desc}</p>
              </div>
            </div>

            {selectedYoga.benefits && (
              <div className="row mb-3">
                <div className="col-md-12">
                  <b>Benefits:</b>
                  <ol style={{ marginTop: "6px", paddingLeft: "20px" }}>
                    {parseNumberedPoints(selectedYoga.benefits).map((point, i) => (
                      <li key={i} style={{ marginBottom: "4px", fontSize: "14px" }}>
                        {point.replace(/^\d+\./, "").trim()}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {selectedYoga.session_includes && (
              <div className="row mb-3">
                <div className="col-md-12">
                  <b>Session Includes:</b>
                  <ol style={{ marginTop: "6px", paddingLeft: "20px" }}>
                    {parseNumberedPoints(selectedYoga.session_includes).map((point, i) => (
                      <li key={i} style={{ marginBottom: "4px", fontSize: "14px" }}>
                        {point.replace(/^\d+\./, "").trim()}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-6 text-center mb-3">
                <b>Image:</b><br />
                {selectedYoga.yoga_image ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedYoga.yoga_image}`}
                    alt="Yoga"
                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px", marginTop: "8px" }}
                  />
                ) : "N/A"}
              </div>

              <div className="col-md-6 text-center mb-3">
                <b>Icon:</b><br />
                {selectedYoga.yoga_icon ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedYoga.yoga_icon}`}
                    alt="Icon"
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "12px", marginTop: "8px" }}
                  />
                ) : "N/A"}
              </div>
            </div>

            <div className="text-end">
              <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Yoga;