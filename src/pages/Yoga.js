import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import YogaForm from "../forms/YogaForm";
import { getYogaList, yogaById, deleteYoga } from "../services/authService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function Yoga() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [yogaList, setYogaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // ─── Fetch Yoga List ────────────────────────────────────────────────────────
  const fetchData = async (page) => {
    setLoading(true);
    try {
      // getYogaList now returns res.data (full API object):
      // { statusCode, totalCount, totalPages, currentPage, data: [...] }
      const res = await getYogaList(page, 10);

      const yogaData = Array.isArray(res.data) ? res.data : [];
      const total    = res.totalPages || 1;

      setYogaList(
        yogaData.map((item) => ({
          yogaId:        item.yogaId,
          yoga_name:     item.yoga_name,
          client_price:  item.client_price,
          trainer_price: item.trainer_price,
          yoga_desc:     item.yoga_desc,
          yoga_image:    item.yoga_image,
          yoga_icon:     item.yoga_icon,
          duration:      item.duration,
        }))
      );

      setTotalPages(total);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch Yoga list",
        "error"
      );
      setYogaList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ─── View ───────────────────────────────────────────────────────────────────
  const handleView = async (yogaId) => {
    try {
      const res = await yogaById(yogaId);
      const yoga = res.data;
      setSelectedYoga({
        yogaId:        yoga.yogaId,
        yoga_name:     yoga.yoga_name,
        client_price:  yoga.client_price,
        trainer_price: yoga.trainer_price,
        yoga_desc:     yoga.yoga_desc,
        yoga_image:    yoga.yoga_image,
        yoga_icon:     yoga.yoga_icon,
        duration:      yoga.duration,
      });
      setViewOpen(true);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch Yoga details",
        "error"
      );
    }
  };

  // ─── Edit ───────────────────────────────────────────────────────────────────
  const handleEdit = async (yogaId) => {
    try {
      const res = await yogaById(yogaId);
      const yoga = res.data;
      setSelectedYoga({
        yogaId:        yoga.yogaId,
        yoga_name:     yoga.yoga_name,
        client_price:  yoga.client_price,
        trainer_price: yoga.trainer_price,
        yoga_desc:     yoga.yoga_desc,
        yoga_image:    yoga.yoga_image,
        yoga_icon:     yoga.yoga_icon,
        duration:      yoga.duration,
      });
      setEditOpen(true);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch Yoga details",
        "error"
      );
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────
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
      fetchData(currentPage);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  // ─── After add/update ───────────────────────────────────────────────────────
  const handleSubmit = () => {
    fetchData(currentPage);
    setSelectedYoga(null);
    setOpen(false);
    setEditOpen(false);
  };

  // ─── Table Columns ──────────────────────────────────────────────────────────
  const columns = [
    { header: "S.No",          accessor: "srNo" },
    { header: "Yoga Name",     accessor: "yoga_name" },
    { header: "Client Price",  accessor: "client_price" },
    { header: "Trainer Price", accessor: "trainer_price" },
    { header: "Description",   accessor: "yoga_desc" },
    { header: "Image",         accessor: "yoga_image" },
    { header: "Icon",          accessor: "yoga_icon" },
    { header: "Duration",      accessor: "duration" },
    { header: "Actions",       accessor: "actions" },
  ];

  // ─── Table Data ─────────────────────────────────────────────────────────────
  const tableData = yogaList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
    ...item,

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
        style={{
          width: "42px",
          height: "42px",
          objectFit: "cover",
          borderRadius: "6px",
          display: "block",
        }}
      />
    ) : (
      "N/A"
    ),

    yoga_icon: item.yoga_icon ? (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.yoga_icon}`}
        alt="Icon"
        style={{
          width: "38px",
          height: "38px",
          objectFit: "cover",
          borderRadius: "8px",
          display: "block",
        }}
      />
    ) : (
      "N/A"
    ),

    actions: (
      <div className="actions">
        <button
          className="icon-btn view"
          title="View"
          onClick={() => handleView(item.yogaId)}
        >
          <FaEye />
        </button>
        <button
          className="icon-btn edit"
          title="Edit"
          onClick={() => handleEdit(item.yogaId)}
        >
          <FaEdit />
        </button>
        <button
          className="icon-btn delete"
          title="Delete"
          onClick={() => handleDelete(item.yogaId)}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between mb-3">
        <h2>YOGA LIST</h2>
        <Button text="+ Add Yoga" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Yoga" size="lg">
        <YogaForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Yoga"
        size="lg"
      >
        <YogaForm
          onClose={() => setEditOpen(false)}
          initialData={selectedYoga}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Yoga Details"
        size="lg"
      >
        {selectedYoga && (
          <div className="container" style={{ padding: "10px" }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><b>Yoga Name:</b> {selectedYoga.yoga_name}</p>
              </div>
              <div className="col-md-6">
                <p><b>Client Price:</b> {selectedYoga.client_price}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <p><b>Trainer Price:</b> {selectedYoga.trainer_price}</p>
              </div>
              <div className="col-md-6">
                <p><b>Duration:</b> {selectedYoga.duration}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <p><b>Description:</b> {selectedYoga.yoga_desc}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 text-center mb-3">
                <b>Image:</b><br />
                {selectedYoga.yoga_image ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedYoga.yoga_image}`}
                    alt="Yoga"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginTop: "8px",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>

              <div className="col-md-6 text-center mb-3">
                <b>Icon:</b><br />
                {selectedYoga.yoga_icon ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedYoga.yoga_icon}`}
                    alt="Icon"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginTop: "8px",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            <div className="text-end">
              <button
                className="btn btn-secondary mt-2"
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

export default Yoga;