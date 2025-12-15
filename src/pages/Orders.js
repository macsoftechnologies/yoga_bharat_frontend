import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import OrderForm from "../forms/OrderForm"; // create a form similar to YogaForm

function Orders() {
  const [open, setOpen] = useState(false);        // Add Modal
  const [editOpen, setEditOpen] = useState(false); // Edit Modal
  const [viewOpen, setViewOpen] = useState(false); // View Modal

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersList, setOrdersList] = useState([]);

  // Sample Data
  useEffect(() => {
    const sampleData = [
      { id: 1, orderNumber: "ORD001", customer: "Ramesh Kumar", amount: "$50", status: "Pending" },
      { id: 2, orderNumber: "ORD002", customer: "Priya Sharma", amount: "$120", status: "Completed" },
      { id: 3, orderNumber: "ORD003", customer: "Alex Johnson", amount: "$75", status: "Pending" },
    ];
    setOrdersList(sampleData);
  }, []);

  // VIEW
  const handleView = (item) => {
    setSelectedOrder(item);
    setViewOpen(true);
  };

  // EDIT
  const handleEdit = (item) => {
    setSelectedOrder(item);
    setEditOpen(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Delete this order?")) return;
    setOrdersList(ordersList.filter((o) => o.id !== id));
  };

  const columns = [
    { header: "Order Number", accessor: "orderNumber" },
    { header: "Customer", accessor: "customer" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = ordersList.map((item) => ({
    ...item,
    actions: (
      <div className="actions">
        <button className="view" onClick={() => handleView(item)}>View</button>
        <button className="edit" onClick={() => handleEdit(item)}>Edit</button>
        <button className="delete" onClick={() => handleDelete(item.id)}>Delete</button>
      </div>
    ),
  }));

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between mb-3">
        <h2>ORDERS LIST</h2>
        <Button text="+ Add Order" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* Table */}
      <Table columns={columns} data={tableData} rowsPerPage={5} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Order" size="lg">
        <OrderForm onClose={() => setOpen(false)} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Order" size="lg">
        <OrderForm onClose={() => setEditOpen(false)} initialData={selectedOrder} isEdit />
      </Modal>

      {/* VIEW MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Order Details" size="md">
        {selectedOrder && (
          <div style={{ padding: "10px" }}>
            <p><b>Order Number:</b> {selectedOrder.orderNumber}</p>
            <p><b>Customer:</b> {selectedOrder.customer}</p>
            <p><b>Amount:</b> {selectedOrder.amount}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Orders;
