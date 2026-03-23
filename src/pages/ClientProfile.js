import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { getClients, getBookings } from "../services/authService";

function ClientProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ─── Fetch Client ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await getClients(1, 100); // fetch enough to find by userId

        /*
         * FIXED: getClients now returns the full API object (res.data = object),
         * not a bare array. So res.find() was crashing with "res.find is not a function".
         *
         * OLD (broken):
         *   const selected = res.find(c => c.userId === userId);
         *   ↑ res is an object { data: [...], totalPages: 2 }
         *     objects don't have .find() → CRASH
         *
         * NEW (fixed):
         *   const selected = res.data.find(c => c.userId === userId);
         *   ↑ res.data is the array → .find() works correctly
         */
        const clientArray = Array.isArray(res.data) ? res.data : [];
        const selected = clientArray.find((c) => c.userId === userId);
        setClient(selected || null);
      } catch (err) {
        console.error("Error fetching client:", err);
        setClient(null);
      }
    };

    fetchClient();
  }, [userId]);

  // ─── Fetch Bookings ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!client?.userId) return;

    const fetchBookings = async () => {
      try {
        const payload = { clientId: client.userId };
        const res = await getBookings(currentPage, 10, payload);

        if (res && Array.isArray(res.data)) {
          setOrdersList(res.data);
          setTotalPages(res.totalPages || 1);
        } else {
          setOrdersList([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setOrdersList([]);
        setTotalPages(1);
      }
    };

    fetchBookings();
  }, [currentPage, client]);

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (!client) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <div className="table-spinner"></div>
      </div>
    );
  }

  // ─── Table Columns ──────────────────────────────────────────────────────────
  const columns = [
    { header: "S.No",         accessor: "srNo" },
    { header: "Booking Type", accessor: "bookingType" },
    { header: "Trainer Name", accessor: "trainerName" },
    { header: "Yoga Name",    accessor: "yogaName" },
    { header: "Language",     accessor: "language" },
    { header: "Client Price", accessor: "clientPrice" },
    { header: "Date",         accessor: "scheduledDate" },
    { header: "Time",         accessor: "time" },
    { header: "Status",       accessor: "status" },
  ];

  // ─── Table Data ─────────────────────────────────────────────────────────────
  const tableData = ordersList.map((item, index) => ({
    srNo:         (currentPage - 1) * 10 + index + 1,
    bookingType:  item.bookingType || "-",
    trainerName:  item.accepted_trainerId?.name || "-",
    yogaName:     item.yogaId?.[0]?.yoga_name || "-",
    language:     item.languageId?.[0]?.language_name || "-",
    clientPrice:  `₹${item.yogaId?.[0]?.client_price || 0}`,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString()
      : "-",
    time:   item.time || "-",
    status: item.status || "-",
  }));

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>CLIENT BOOKINGS</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/client")}
        >
          ← Back
        </button>
      </div>

      {/* Client Info Card */}
      <div className="card p-3 shadow-sm mb-4">
        <h4>{client.name}</h4>
        <p><b>Email:</b> {client.email}</p>
        <p><b>Mobile:</b> {client.mobileNumber}</p>
      </div>

      {/* Bookings Table */}
      <div className="card p-3 shadow-sm">
        <h3 className="mb-3">Bookings List</h3>
        <Table
          columns={columns}
          data={tableData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default ClientProfile;