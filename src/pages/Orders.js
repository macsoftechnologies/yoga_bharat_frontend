import React, { useEffect, useState, useCallback } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { getBookings } from "../services/authService";
import { FaEye, FaFilter } from "react-icons/fa";

function Orders() {
  const [ordersList, setOrdersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [filters, setFilters] = useState({
    bookingType: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const filterPayload = {
          ...filters,
        };

        if (searchText.trim() !== "") {
          filterPayload[searchType] = searchText;
        }

        const res = await getBookings(page, 10, filterPayload);

        if (res && Array.isArray(res.data)) {
          setOrdersList(res.data);
          setTotalPages(res.totalPages || 1);
        } else {
          setOrdersList([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setOrdersList([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchText, searchType]
  );

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  /* ================= VIEW ================= */

  const handleView = (item) => {
    setSelectedOrder(item);
    setViewOpen(true);
  };

  /* ================= FILTER CHANGE ================= */

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchOrders(1);
  };

  /* ================= CLEAR FILTERS ================= */

  const handleClearFilters = () => {
    setFilters({
      bookingType: "",
      status: "",
      fromDate: "",
      toDate: "",
    });

    setSearchText("");
    setSearchType("");
    setCurrentPage(1);

    setTimeout(() => {
      fetchOrders(1);
    }, 0);
  };

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    { header: "S.No", accessor: "srNo" },
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

  const tableData = ordersList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
    bookingType: item.bookingType || "-",
    clientName: item.clientId?.name || "-",
    trainerName: item.accepted_trainerId?.name || "-",
    yogaName: item.yogaId?.yoga_name || "-",
    language: item.languageId?.language_name || "-",
    clientPrice: `₹${item.yogaId?.client_price || 0}`,
    trainerPrice: `₹${item.yogaId?.trainer_price || 0}`,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString()
      : "-",
    time: item.time || "-",
    status: item.status || "-",
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

  /* ================= UI ================= */

  return (
    <div>
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <h2 className="mb-0">BOOKINGS LIST</h2>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ height: "42px", marginBottom: "14px" }}
          >
            <option value="">All Names</option>
            <option value="clientName">Client Name</option>
            <option value="trainerName">Trainer Name</option>
            <option value="yogaName">Yoga Name</option>
          </select>
        </div>

        <div className="col-md-4">
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                color: "#6c757d",
                fontSize: "14px",
              }}
            >
              🔍
            </span>

            <input
              type="text"
              placeholder="Enter Your Name"
              className="form-control"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                height: "42px",
                paddingLeft: "35px",
              }}
            />
          </div>
        </div>
      </div>

      {/* ================= FILTER CARD ================= */}

      <div className="card p-3 mb-3">
        <h5 className="mb-3">Filters</h5>

        <div className="row">
          <div className="col-md-3">
            <label>Booking Type</label>
            <select
              className="form-select"
              value={filters.bookingType}
              onChange={(e) =>
                handleFilterChange("bookingType", e.target.value)
              }
            >
              <option value="">All</option>
              <option value="instant">Instant</option>
              <option value="package">Package</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All</option>
              <option value="accepted">Accepted</option>
              <option value="opened">Opened</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>From Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label>To Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
          </div>
        </div>

        <div className="text-end mt-3">
          <button
            onClick={handleApplyFilters}
            style={{
              background: "linear-gradient(135deg, #000000, #fcd34d)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              marginRight: "10px",
            }}
          >
            <FaFilter />
            <span style={{ marginLeft: "6px" }}>Filter</span>
          </button>

          <button
            onClick={handleClearFilters}
            style={{
              background: "#7d6c6c",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <b>Booking Type:</b> {selectedOrder.bookingType}
                </p>
                <p>
                  <b>Status:</b> {selectedOrder.status}
                </p>
                <p>
                  <b>Date:</b>{" "}
                  {selectedOrder.scheduledDate
                    ? new Date(selectedOrder.scheduledDate).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  <b>Time:</b> {selectedOrder.time}
                </p>
                <p>
                  <b>Client:</b> {selectedOrder.clientId?.name}
                </p>
              </div>

              <div className="col-md-6">
                <p>
                  <b>Trainer:</b> {selectedOrder.accepted_trainerId?.name}
                </p>
                <p>
                  <b>Yoga:</b> {selectedOrder.yogaId?.yoga_name}
                </p>
                <p>
                  <b>Language:</b> {selectedOrder.languageId?.language_name}
                </p>
                <p>
                  <b>Client Price:</b> ₹{selectedOrder.yogaId?.client_price}
                </p>
                <p>
                  <b>Trainer Price:</b> ₹{selectedOrder.yogaId?.trainer_price}
                </p>
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