import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import YogaForm from "../forms/YogaForm";
import { getYogaList, yogaById, deleteYoga } from "../services/authService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function Yoga() {
  const [open, setOpen] = useState(false);       // Add Modal
  const [editOpen, setEditOpen] = useState(false); // Edit Modal
  const [viewOpen, setViewOpen] = useState(false); // View Modal
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [yogaList, setYogaList] = useState([]);

  // Fetch Yoga list
  const fetchData = async () => {
    try {
      const data = await getYogaList();
      setYogaList(
        data.map((item) => ({
          yogaId: item.yogaId,
          yoga_name: item.yoga_name,
          client_price: item.client_price,
          trainer_price: item.trainer_price,
          yoga_desc: item.yoga_desc,
          yoga_image: item.yoga_image,
          yoga_icon: item.yoga_icon,
          duration:item.duration,
        }))
      );
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch Yoga list",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // VIEW
  const handleView = async (yogaId) => {
    try {
      const res = await yogaById(yogaId);
      const yoga = res.data;

      setSelectedYoga({
        yogaId: yoga.yogaId,
        yoga_name: yoga.yoga_name,
        client_price: yoga.client_price,
        trainer_price: yoga.trainer_price,
        yoga_desc: yoga.yoga_desc,
        yoga_image: yoga.yoga_image,
        yoga_icon: yoga.yoga_icon,
        duration:yoga.duration,
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

  // EDIT
  const handleEdit = async (yogaId) => {
    try {
      const res = await yogaById(yogaId);
      const yoga = res.data;

      setSelectedYoga({
        yogaId: yoga.yogaId,
        yoga_name: yoga.yoga_name,
        client_price: yoga.client_price,
        trainer_price: yoga.trainer_price,
        yoga_desc: yoga.yoga_desc,
        yoga_image: yoga.yoga_image,
        yoga_icon: yoga.yoga_icon,
        duration:yoga.duration,
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

  // DELETE
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
      fetchData(); // refresh list
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  // After add/update
  const handleSubmit = () => {
    fetchData();
    setSelectedYoga(null);
    setOpen(false);
    setEditOpen(false);
  };

  // Table columns
  const columns = [
    { header: "Yoga Name", accessor: "yoga_name" },
    { header: "Client Price", accessor: "client_price" },
    { header: "Trainer Price", accessor: "trainer_price" },
    { header: "Description", accessor: "yoga_desc" },
    { header: "Image", accessor: "yoga_image" },
    { header: "Icon", accessor: "yoga_icon" },
    { header: "Duration", accessor: "duration" },
    { header: "Actions", accessor: "actions" },
  ];

  // Table data
  const tableData = yogaList.map((item) => ({
    ...item,
    yoga_image: item.yoga_image ? (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.yoga_image}`}
        alt="Yoga"
        width="60"
        height="60"
      />
    ) : "N/A",
    yoga_icon: item.yoga_icon ? (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/${item.yoga_icon}`}
        alt="Icon"
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

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between mb-3">
        <h2>YOGA LIST</h2>
        <Button text="+ Add Yoga" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* Table */}
      <Table columns={columns} data={tableData} rowsPerPage={10} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Yoga" size="lg">
        <YogaForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Yoga" size="lg">
        <YogaForm
          onClose={() => setEditOpen(false)}
          initialData={selectedYoga}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW MODAL */}
     <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Yoga Details" size="lg">
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
                  className="img-fluid"
                />
              ) : "N/A"}
            </div>

            <div className="col-md-6 text-center mb-3">
              <b>Icon:</b><br />
              {selectedYoga.yoga_icon ? (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/${selectedYoga.yoga_icon}`}
                  alt="Icon"
                  className="img-fluid"
                />
              ) : "N/A"}
            </div>
          </div>

          <div className="text-end">
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </Modal>


    </div>
  );
}

export default Yoga;
