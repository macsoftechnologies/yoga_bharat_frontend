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

useEffect(() => {
  const fetchClient = async () => {
    const res = await getClients(1, 10);

    const selected = res.find(
      (c) => c.userId === userId
    );

    setClient(selected || null);
  };

  fetchClient();
}, [userId]);


  useEffect(() => {
    if (!client?.userId) return;

    const fetchBookings = async () => {
      const payload = {
        clientId: client.userId,
      };

      const res = await getBookings(currentPage, 10, payload);

      if (res && Array.isArray(res.data)) {
        setOrdersList(res.data);
        setTotalPages(res.totalPages || 1);
      } else {
        setOrdersList([]);
        setTotalPages(1);
      }
    };

    fetchBookings();
  }, [currentPage, client]);

  if (!client) return <div className="p-3">Loading...</div>;

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Booking Type", accessor: "bookingType" },
    { header: "Trainer Name", accessor: "trainerName" },
    { header: "Yoga Name", accessor: "yogaName" },
    { header: "Language", accessor: "language" },
    { header: "Client Price", accessor: "clientPrice" },
    { header: "Date", accessor: "scheduledDate" },
    { header: "Time", accessor: "time" },
    { header: "Status", accessor: "status" },
  ];

  const tableData = ordersList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
    bookingType: item.bookingType || "-",

    trainerName: item.accepted_trainerId?.name || "-",

    yogaName: item.yogaId?.[0]?.yoga_name || "-",
    language: item.languageId?.[0]?.language_name || "-",
    clientPrice: `₹${item.yogaId?.[0]?.client_price || 0}`,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString()
      : "-",
    time: item.time || "-",
    status: item.status || "-",
  }));

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

      <div className="card p-3 shadow-sm mb-4">
        <h4>{client.name}</h4>
        <p>
          <b>Email:</b> {client.email}
        </p>
        <p>
          <b>Mobile:</b> {client.mobileNumber}
        </p>
      </div>

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
