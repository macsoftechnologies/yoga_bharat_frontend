import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import YogaForm from "../forms/YogaForm";


function Yoga() {
  const [open, setOpen] = useState(false);        // Add Modal
  const [editOpen, setEditOpen] = useState(false); // Edit Modal
  const [viewOpen, setViewOpen] = useState(false); // ⭐ NEW View Modal

  const [selectedYoga, setSelectedYoga] = useState(null);
  const [yogaList, setYogaList] = useState([]);

  // Fetch sample data
  const fetchYogaList = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/users");
    const formatted = res.data.map((user) => ({
      id: user.id,
      name: user.name,
      category: "Hatha",
      duration: "30 min",
      difficulty: "Beginner",
    }));

    setYogaList(formatted);
  };

  useEffect(() => {
    fetchYogaList();
  }, []);

  // VIEW → open modal
  const handleView = (item) => {
    setSelectedYoga(item);
    setViewOpen(true);
  };

  // EDIT → open modal
  const handleEdit = (item) => {
    setSelectedYoga(item);
    setEditOpen(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    setYogaList(yogaList.filter((y) => y.id !== id));
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Duration", accessor: "duration" },
    { header: "Difficulty", accessor: "difficulty" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = yogaList.map((item) => ({
    ...item,
    actions: (
      <div className="actions">
        <button className="view" onClick={() => handleView(item)}>
          View
        </button>
        <button className="edit" onClick={() => handleEdit(item)}>
          Edit
        </button>
        <button className="delete" onClick={() => handleDelete(item.id)}>
          Delete
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
      <Table columns={columns} data={tableData} rowsPerPage={5} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Yoga" size="lg">
        <YogaForm onClose={() => setOpen(false)} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Yoga" size="lg">
        <YogaForm onClose={() => setEditOpen(false)} initialData={selectedYoga} isEdit={true}/>
      </Modal>

      {/* VIEW MODAL*/}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Yoga Details" size="md">

        {selectedYoga && (
          <div style={{ padding: "10px" }}>
            <p><b>Name:</b> {selectedYoga.name}</p>
            <p><b>Category:</b> {selectedYoga.category}</p>
            <p><b>Duration:</b> {selectedYoga.duration}</p>
            <p><b>Difficulty:</b> {selectedYoga.difficulty}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}

      </Modal>

    </div>
  );
}

export default Yoga;
