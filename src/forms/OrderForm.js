import React, { useState, useEffect } from "react";
import "./form.css";

function OrderForm({ onClose, initialData, isEdit, onSubmit }) {
  const [orderNumber, setOrderNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setOrderNumber(initialData.orderNumber || "");
      setCustomer(initialData.customer || "");
      setAmount(initialData.amount ? initialData.amount.replace("$", "") : "");
      setStatus(initialData.status || "Pending");
    }
  }, [initialData, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      orderNumber,
      customer,
      amount: `$${amount}`,
      status,
    };

    if (onSubmit) onSubmit(payload);

    if (isEdit) {
      console.log("Edited Order:", payload);
    } else {
      console.log("Added Order:", payload);
    }

    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* Row 1 */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Order Number</label>
          <input
            type="text"
            className="form-control"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Enter Customer Name"
            required
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Amount ($)</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update Order" : "Save Order"}
        </button>
      </div>
    </form>
  );
}

export default OrderForm;
