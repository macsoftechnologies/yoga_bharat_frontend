// src/forms/TransactionForm.js
import React, { useState, useEffect } from "react";
import "../forms/form.css";

function TransactionForm({ onClose, initialData, isEdit, onSubmit }) {
  const [transactionId, setTransactionId] = useState("");
  const [clientName, setClientName] = useState("");
  const [yogaSession, setYogaSession] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (isEdit && initialData) {
      setTransactionId(initialData.transactionId || "");
      setClientName(initialData.clientName || "");
      setYogaSession(initialData.yogaSession || "");
      setAmount(initialData.amount ? initialData.amount.replace("$", "") : "");
      setDate(initialData.date || "");
      setStatus(initialData.status || "Pending");
    }
  }, [isEdit, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      transactionId,
      clientName,
      yogaSession,
      amount: `$${amount}`,
      date,
      status,
    };
    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Transaction ID</label>
          <input type="text" className="form-control" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter transaction ID" required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Client Name</label>
          <input type="text" className="form-control" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Enter client name" required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Yoga Session</label>
          <select className="form-select" value={yogaSession} onChange={(e) => setYogaSession(e.target.value)} required>
            <option value="">Select Session</option>
            <option value="Hatha Yoga">Hatha Yoga</option>
            <option value="Vinyasa Yoga">Vinyasa Yoga</option>
            <option value="Ashtanga Yoga">Ashtanga Yoga</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Amount ($)</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-success">{isEdit ? "Update" : "Save"}</button>
      </div>
    </form>
  );
}

export default TransactionForm;
