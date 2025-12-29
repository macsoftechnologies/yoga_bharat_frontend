import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { getBookings } from "../services/authService";
import { FaEye } from "react-icons/fa";

function Orders() {
  const [ordersList, setOrdersList] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ================= FETCH BOOKINGS ================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getBookings({
      status: "",
      clientId: "",
      accepted_trainerId: "",
      yogaId: "",
      bookingId: "",
    });
    setOrdersList(data);
  };

  /* ================= VIEW ================= */
  const handleView = (item) => {
    setSelectedOrder(item);
    setViewOpen(true);
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { header: "Booking Type", accessor: "bookingType" },
    { header: "Client Name", accessor: "clientName" },
    { header: "Trainer Name", accessor: "trainerName" },
    { header: "Yoga Name", accessor: "yogaName" },
    { header: "Language", accessor: "language" },
    { header: "Client Price", accessor: "clientPrice" },
    { header: "Trainer Price", accessor: "trainerPrice" },
    { header: "Date", accessor: "scheduledDate" },
    { header: "Time", accessor: "time" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  /* ================= TABLE DATA MAP ================= */
  const tableData = ordersList.map((item) => ({
    bookingType: item.bookingType,
    clientName: item.clientId?.[0]?.name || "-",
    trainerName: item.accepted_trainerId?.[0]?.name || "-",
    yogaName: item.yogaId?.[0]?.yoga_name || "-",
    language: item.languageId?.[0]?.language_name || "-",
    clientPrice: `₹${item.yogaId?.[0]?.client_price || 0}`,
    trainerPrice: `₹${item.yogaId?.[0]?.trainer_price || 0}`,
    scheduledDate: new Date(item.scheduledDate).toLocaleDateString(),
    time: item.time,
    status: item.status,
    actions: (
      <button
        className="icon-btn view"
        onClick={() => handleView(item)}
        title="View"
      >
        <FaEye />
      </button>
    ),
  }));

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">
        <h2>BOOKINGS LIST</h2>
        {/* <Button text="Refresh" color="green" onClick={fetchOrders} /> */}
      </div>

      {/* TABLE */}
      <Table columns={columns} data={tableData} rowsPerPage={10} />

      {/* VIEW MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Booking Details" size="lg">
        {selectedOrder && (
          <div className="container-fluid">
            <div className="row">
              
              {/* LEFT COLUMN */}
              <div className="col-md-6">
                <p><b>Booking Type:</b> {selectedOrder.bookingType}</p>
                <p><b>Status:</b> {selectedOrder.status}</p>
                <p><b>Date:</b> {new Date(selectedOrder.scheduledDate).toLocaleDateString()}</p>
                <p><b>Time:</b> {selectedOrder.time}</p>
                <p><b>Client:</b> {selectedOrder.clientId?.[0]?.name}</p>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-md-6">
                <p><b>Trainer:</b> {selectedOrder.accepted_trainerId?.[0]?.name}</p>
                <p><b>Yoga:</b> {selectedOrder.yogaId?.[0]?.yoga_name}</p>
                <p><b>Language:</b> {selectedOrder.languageId?.[0]?.language_name}</p>
                <p><b>Client Price:</b> ₹{selectedOrder.yogaId?.[0]?.client_price}</p>
                <p><b>Trainer Price:</b> ₹{selectedOrder.yogaId?.[0]?.trainer_price}</p>
              </div>

            </div>

            <div className="text-end mt-3">
              <button
                className="btn btn-secondary"
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

export default Orders;
