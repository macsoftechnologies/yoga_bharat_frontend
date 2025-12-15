// src/pages/Transactions.js
import React, { useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import TransactionForm from "../forms/TransactionForm";

function Transactions() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      transactionId: "TXN001",
      clientName: "Ramesh Kumar",
      yogaSession: "Hatha Yoga",
      amount: "$50",
      date: "2025-12-15",
      status: "Pending",
    },
    {
      id: 2,
      transactionId: "TXN002",
      clientName: "Priya Sharma",
      yogaSession: "Vinyasa Yoga",
      amount: "$75",
      date: "2025-12-14",
      status: "Completed",
    },
  ]);

  // VIEW
  const handleView = (item) => {
    setSelectedTransaction(item);
    setViewOpen(true);
  };

  // EDIT
  const handleEdit = (item) => {
    setSelectedTransaction(item);
    setEditOpen(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const columns = [
    { header: "Transaction ID", accessor: "transactionId" },
    { header: "Client Name", accessor: "clientName" },
    { header: "Yoga Session", accessor: "yogaSession" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  const data = transactions.map((item) => ({
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
      <div className="d-flex justify-content-between mb-3">
        <h2>Transactions</h2>
        <Button text="+ Add Transaction" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={data} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Transaction" size="lg">
        <TransactionForm onClose={() => setOpen(false)} onSubmit={(payload) => setTransactions([...transactions, { id: transactions.length + 1, ...payload }])} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Transaction" size="lg">
        <TransactionForm
          onClose={() => setEditOpen(false)}
          initialData={selectedTransaction}
          isEdit
          onSubmit={(payload) => setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, ...payload } : t))}
        />
      </Modal>

      {/* VIEW MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Transaction Details">
        {selectedTransaction && (
          <div>
            <p><b>Transaction ID:</b> {selectedTransaction.transactionId}</p>
            <p><b>Client Name:</b> {selectedTransaction.clientName}</p>
            <p><b>Yoga Session:</b> {selectedTransaction.yogaSession}</p>
            <p><b>Amount:</b> {selectedTransaction.amount}</p>
            <p><b>Date:</b> {selectedTransaction.date}</p>
            <p><b>Status:</b> {selectedTransaction.status}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Transactions;
