import React, { useEffect, useState, useCallback, useRef } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { getBookings } from "../services/authService";
import {
  FaEye, FaFilter, FaFileCsv, FaFileExcel,
  FaChevronDown, FaSortAmountDown, FaSortAmountUp,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import "./Dashboard.css";

// ─── helper: build the filter payload sent to the API ───────────────────────
function buildPayload({ filters, searchText, searchType, sortOrder, isExport = false }) {
  const payload = {
    isExport,
    sortOrder: sortOrder === "asc" ? "asc" : sortOrder === "desc" ? "des" : "",
    bookingType: filters.bookingType || "",
    status: filters.status || "",
    fromDate: filters.fromDate || "",
    toDate: filters.toDate || "",
    yogaName: filters.yogaName || "",
    clientName: "",
    trainerName: "",
    clientId: "",
    accepted_trainerId: "",
    yogaId: "",
    bookingId: "",
    time: "",
    scheduledDate: "",
  };

  // put the search text into the right field
  if (searchText.trim() !== "" && searchType) {
    payload[searchType] = searchText.trim();
  }

  return payload;
}

function Orders() {
  const [ordersList, setOrdersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [yogaOptions, setYogaOptions] = useState([]);

  const [filters, setFilters] = useState({
    bookingType: "",
    status: "",
    fromDate: "",
    toDate: "",
    yogaName: "",
  });

  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

  // ── sort state ───────────────────────────────────────────────────────────
  const [sortOrder, setSortOrder] = useState("");   // "" | "asc" | "desc"
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  // close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target))
        setSortDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── fetch unique yoga names for filter dropdown ──────────────────────────
  useEffect(() => {
    const fetchAllYogaNames = async () => {
      try {
        const res = await getBookings(1, 10, {});
        if (res && Array.isArray(res.data)) {
          const names = res.data
            .map((item) =>
              Array.isArray(item.yogaId)
                ? item.yogaId?.[0]?.yoga_name
                : item.yogaId?.yoga_name
            )
            .filter(Boolean);
          setYogaOptions([...new Set(names)]);
        }
      } catch (err) {
        console.error("Error fetching yoga names:", err);
      }
    };
    fetchAllYogaNames();
  }, []);

  // ── fetch (paginated, normal view) ───────────────────────────────────────
  const fetchOrders = useCallback(
    async (
      page = 1,
      overrideFilters,
      overrideSearchText,
      overrideSearchType,
      overrideLimit,
      overrideSortOrder,
    ) => {
      try {
        setLoading(true);

        const activeFilters = overrideFilters !== undefined ? overrideFilters : filters;
        const activeSearchText = overrideSearchText !== undefined ? overrideSearchText : searchText;
        const activeSearchType = overrideSearchType !== undefined ? overrideSearchType : searchType;
        const activeLimit = overrideLimit !== undefined ? overrideLimit : limit;
        const activeSortOrder = overrideSortOrder !== undefined ? overrideSortOrder : sortOrder;

        const payload = buildPayload({
          filters: activeFilters,
          searchText: activeSearchText,
          searchType: activeSearchType,
          sortOrder: activeSortOrder,
          isExport: false,
        });

        const res = await getBookings(page, activeLimit, payload);

        if (res && Array.isArray(res.data)) {
          setOrdersList(res.data);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.totalCount || 0);
        } else {
          setOrdersList([]);
          setTotalPages(1);
          setTotalCount(0);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setOrdersList([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchText, searchType, limit, sortOrder],
  );

  const fetchOrdersRef = useRef();
  fetchOrdersRef.current = fetchOrders;

  useEffect(() => {
    fetchOrdersRef.current(currentPage);
  }, [currentPage]);

  // ── sort handler – triggers API re-fetch with new sortOrder ──────────────
  const handleSort = (order) => {
    setSortOrder(order);
    setSortDropdownOpen(false);
    setCurrentPage(1);
    fetchOrders(1, undefined, undefined, undefined, undefined, order);
  };

  // ── fetch ALL filtered records for export (isExport: true) ──────────────
  const fetchAllForExport = async () => {
    const payload = buildPayload({
      filters,
      searchText,
      searchType,
      sortOrder,
      isExport: true,
    });

    // use page=1 limit=1; the server returns everything when isExport=true
    const res = await getBookings(1, limit, payload);
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  // ── helper: map raw API record → export row ──────────────────────────────
  const buildExportRows = (data) =>
    data.map((item, index) => ({
      "S.No": index + 1,
      "Created Date": item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "-",
      "Scheduled Date": item.scheduledDate
        ? new Date(item.scheduledDate).toLocaleDateString()
        : "-",
      "Booking Type": item.bookingType || "-",
      "Client Name": item.clientId?.name || "-",
      "Trainer Name": item.accepted_trainerId?.name || "-",
      "Yoga Name": (Array.isArray(item.yogaId)
        ? item.yogaId?.[0]?.yoga_name
        : item.yogaId?.yoga_name) || "-",
      "Language": (Array.isArray(item.languageId)
        ? item.languageId?.[0]?.language_name
        : item.languageId?.language_name) || "-",
      "Client Price": `₹${(Array.isArray(item.yogaId)
        ? item.yogaId?.[0]?.client_price
        : item.yogaId?.client_price) || 0}`,
      "Trainer Price": `₹${(Array.isArray(item.yogaId)
        ? item.yogaId?.[0]?.trainer_price
        : item.yogaId?.trainer_price) || 0}`,
      "Time": item.time || "-",
      "Started At": item.startedAt
        ? new Date(item.startedAt).toLocaleString()
        : "-",
      "Ended At": item.endedAt
        ? new Date(item.endedAt).toLocaleString()
        : "-",
      "Session Duration": item.session_duration || "-",
      "Status": item.status
        ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
        : "-",
    }));

  // ── CSV Export ───────────────────────────────────────────────────────────
  const exportCSV = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllForExport();
      const rows = buildExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const headers = Object.keys(rows[0]);
      const csvLines = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((h) => `"${String(row[h]).replace(/"/g, '""')}"`)
            .join(","),
        ),
      ];

      const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ── Excel Export ─────────────────────────────────────────────────────────
  const exportExcel = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllForExport();
      const rows = buildExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();

      const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key]).length)) + 2,
      }));
      worksheet["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      XLSX.writeFile(
        workbook,
        `orders_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ── UI handlers ──────────────────────────────────────────────────────────
  const handleView = (item) => { setSelectedOrder(item); setViewOpen(true); };

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchOrders(1, filters, searchText, searchType, limit, sortOrder);
  };

  const handleClearFilters = () => {
    const cleared = { bookingType: "", status: "", fromDate: "", toDate: "", yogaName: "" };
    setFilters(cleared);
    setSearchText("");
    setSearchType("");
    setSortOrder("");
    setCurrentPage(1);
    fetchOrders(1, cleared, "", "", limit, "");
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setCurrentPage(1);
    fetchOrders(1, filters, searchText, searchType, newLimit, sortOrder);
  };

  // ── Created Date column header with sort dropdown ────────────────────────
  const CreatedDateHeader = (
    <div ref={sortDropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: "5px",
          cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
        }}
        onClick={() => setSortDropdownOpen((prev) => !prev)}
      >
        <span>Created Date</span>
        {sortOrder === "asc" && <FaSortAmountDown style={{ fontSize: "12px", color: "#ff7a00" }} />}
        {sortOrder === "desc" && <FaSortAmountUp style={{ fontSize: "12px", color: "#ff7a00" }} />}
        {!sortOrder && <FaChevronDown style={{ fontSize: "10px", color: "#888" }} />}
      </div>

      {sortDropdownOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          zIndex: 999, background: "#fff", border: "1px solid #dee2e6",
          borderRadius: "6px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          minWidth: "175px", overflow: "hidden",
        }}>
          {[
            { label: "Sort Ascending", value: "asc", Icon: FaSortAmountDown },
            { label: "Sort Descending", value: "desc", Icon: FaSortAmountUp },
          ].map(({ label, value, Icon }, i) => (
            <React.Fragment key={value}>
              {i > 0 && <div style={{ borderTop: "1px solid #f0f0f0" }} />}
              <div
                onClick={() => handleSort(value)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 16px", cursor: "pointer", fontSize: "14px",
                  color: sortOrder === value ? "#ff7a00" : "#333",
                  background: sortOrder === value ? "#fff5eb" : "#fff",
                  fontWeight: sortOrder === value ? "600" : "400",
                  borderLeft: sortOrder === value ? "3px solid #ff7a00" : "3px solid transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (sortOrder !== value) e.currentTarget.style.background = "#f8f9fa"; }}
                onMouseLeave={(e) => { if (sortOrder !== value) e.currentTarget.style.background = "#fff"; }}
              >
                <Icon style={{ fontSize: "14px" }} />
                {label}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );

  // ── Table columns ────────────────────────────────────────────────────────
  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Scheduled Date", accessor: "scheduledDate" },
    { header: "Time", accessor: "time" },
    { header: "Booking Type", accessor: "bookingType" },
    { header: "Client Name", accessor: "clientName" },
    { header: "Trainer Name", accessor: "trainerName" },
    { header: "Yoga Name", accessor: "yogaName" },
    { header: "Language", accessor: "language" },
    { header: "Client Price", accessor: "clientPrice" },
    { header: "Trainer Price", accessor: "trainerPrice" },
    { header: CreatedDateHeader, accessor: "createdAt" },
    { header: "Started At", accessor: "startedAt" },
    { header: "Ended At", accessor: "endedAt" },
    { header: "Session Duration", accessor: "sessionDuration" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = ordersList.map((item, index) => ({
    srNo: (currentPage - 1) * limit + index + 1,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "-",
    bookingType: item.bookingType || "-",
    clientName: item.clientId?.name || "-",
    trainerName: item.accepted_trainerId?.name || "-",
    yogaName: (Array.isArray(item.yogaId)
      ? item.yogaId?.[0]?.yoga_name
      : item.yogaId?.yoga_name) || "-",
    language: (Array.isArray(item.languageId)
      ? item.languageId?.[0]?.language_name
      : item.languageId?.language_name) || "-",
    clientPrice: `₹${(Array.isArray(item.yogaId)
      ? item.yogaId?.[0]?.client_price
      : item.yogaId?.client_price) || 0}`,
    trainerPrice: `₹${(Array.isArray(item.yogaId)
      ? item.yogaId?.[0]?.trainer_price
      : item.yogaId?.trainer_price) || 0}`,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "-",
    time: item.time || "-",
    startedAt: item.startedAt
      ? new Date(item.startedAt).toLocaleString("en-IN")
      : "-",
    endedAt: item.endedAt
      ? new Date(item.endedAt).toLocaleString("en-IN")
      : "-",
    sessionDuration: item.session_duration || "-",
    status: (
      <span className={`status-badge ${item.status === "ongoing" ? "status-ongoing" :
          item.status === "accepted" ? "status-accepted" :
            item.status === "opened" ? "status-opened" :
              item.status === "completed" ? "status-completed" :
                item.status === "cancelled" ? "status-cancelled" : ""
        }`}>
        {item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "-"}
      </span>
    ),
    actions: (
      <button className="icon-btn view" onClick={() => handleView(item)} title="View">
        <FaEye />
      </button>
    ),
  }));

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* export loading overlay */}
      {exporting && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", borderRadius: "10px", padding: "28px 40px",
            textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            <div className="spinner-border text-warning mb-3" role="status" />
            <p style={{ margin: 0, fontWeight: 600, color: "#333" }}>
              Preparing export… please wait
            </p>
          </div>
        </div>
      )}

      {/* ── Title + Search ── */}
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
            <option value="">Select Name</option>
            <option value="clientName">Client Name</option>
            <option value="trainerName">Trainer Name</option>
            <option value="yogaName">Yoga Name</option>
          </select>
        </div>

        <div className="col-md-4">
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", top: "50%", left: "12px",
              transform: "translateY(-50%)", color: "#6c757d", fontSize: "14px",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="form-control"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ height: "42px", paddingLeft: "35px" }}
            />
          </div>
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="card p-3 mb-3">
        <h5 className="mb-3">Filters</h5>

        <div className="row">
          <div className="col-md-4">
            <label>Booking Type</label>
            <select
              className="form-select"
              value={filters.bookingType}
              onChange={(e) => handleFilterChange("bookingType", e.target.value)}
            >
              <option value="">All</option>
              <option value="instant">Instant</option>
              <option value="scheduled">Scheduled</option>
              <option value="package">Package</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All</option>
              <option value="ongoing" style={{ background: "#F3E8FF", color: "#6B21A8", fontWeight: "600" }}>🟣 On Going</option>
              <option value="accepted">Accepted</option>
              <option value="opened">Opened</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>From Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
          </div>

          <div className="col-md-4 mt-3">
            <label>To Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
          </div>

          {/* ── Yoga Name filter — now populated from API ── */}
          <div className="col-md-4 mt-3">
            <label>Yoga Name</label>
            <select
              className="form-select"
              value={filters.yogaName}
              onChange={(e) => handleFilterChange("yogaName", e.target.value)}
            >
              <option value="">All</option>
              {yogaOptions.map((name, i) => (
                <option key={i} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="text-end mt-5 mb-3 d-flex justify-content-end gap-4 flex-wrap">
          <button
            onClick={handleApplyFilters}
            style={{
              background: "linear-gradient(135deg, #000000, #fcd34d)",
              color: "#fff", border: "none",
              padding: "8px 16px", borderRadius: "4px",
            }}
          >
            <FaFilter />
            <span style={{ marginLeft: "6px" }}>Filter</span>
          </button>

          <button
            onClick={handleClearFilters}
            style={{
              background: "#7d6c6c", color: "#fff",
              border: "none", padding: "8px 16px", borderRadius: "4px",
            }}
          >
            Clear
          </button>

          {/* CSV – uses API isExport:true */}
          <button
            onClick={exportCSV}
            disabled={exporting}
            title="Export all filtered records as CSV"
            style={{
              background: exporting
                ? "#aaa"
                : "linear-gradient(135deg, #16a34a, #4ade80)",
              color: "#fff", border: "none",
              padding: "8px 16px", borderRadius: "4px",
              display: "flex", alignItems: "center", gap: "6px",
              cursor: exporting ? "not-allowed" : "pointer",
            }}
          >
            CSV <FaFileCsv style={{ fontSize: "16px" }} />
          </button>

          {/* Excel – uses API isExport:true */}
          <button
            onClick={exportExcel}
            disabled={exporting}
            title="Export all filtered records as Excel"
            style={{
              background: exporting
                ? "#aaa"
                : "linear-gradient(135deg, #1d4ed8, #60a5fa)",
              color: "#fff", border: "none",
              padding: "8px 16px", borderRadius: "4px",
              display: "flex", alignItems: "center", gap: "6px",
              cursor: exporting ? "not-allowed" : "pointer",
            }}
          >
            Excel <FaFileExcel style={{ fontSize: "16px" }} />
          </button>
        </div>
      </div>

      {/* ── Records per page + count ── */}
      <div className="d-flex align-items-center justify-content-between mb-2 p-2">
        <div className="d-flex align-items-center gap-2">
          <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>
            Records per page:
          </label>
          <select
            className="form-select form-select-sm"
            style={{
              border: "2px solid #ff7a00", padding: "2px",
              cursor: "pointer", width: "75px",
            }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <span style={{ fontSize: "16px", color: "#000" }}>
          Showing{" "}
          <strong style={{ color: "#ff7a00" }}>{ordersList.length}</strong>
          {totalCount > ordersList.length
            ? <> of <strong>{totalCount}</strong></>
            : null}{" "}
          records
        </span>
      </div>

      {/* ── Table ── */}
      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      {/* ── View Modal ── */}
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
                <p><b>Booking Type:</b> {selectedOrder.bookingType}</p>
                <p><b>Status:</b>       {selectedOrder.status}</p>
                <p><b>Date:</b>         {selectedOrder.scheduledDate ? new Date(selectedOrder.scheduledDate).toLocaleDateString() : "-"}</p>
                <p><b>Time:</b>         {selectedOrder.time}</p>
                <p><b>Client:</b>       {selectedOrder.clientId?.name}</p>
              </div>
              <div className="col-md-6">
                <p><b>Trainer:</b>       {selectedOrder.accepted_trainerId?.name}</p>
                <p><b>Yoga:</b>          {Array.isArray(selectedOrder.yogaId) ? selectedOrder.yogaId?.[0]?.yoga_name : selectedOrder.yogaId?.yoga_name}</p>
                <p><b>Language:</b>      {Array.isArray(selectedOrder.languageId) ? selectedOrder.languageId?.[0]?.language_name : selectedOrder.languageId?.language_name}</p>
                <p><b>Client Price:</b>  ₹{Array.isArray(selectedOrder.yogaId) ? selectedOrder.yogaId?.[0]?.client_price : selectedOrder.yogaId?.client_price}</p>
                <p><b>Trainer Price:</b> ₹{Array.isArray(selectedOrder.yogaId) ? selectedOrder.yogaId?.[0]?.trainer_price : selectedOrder.yogaId?.trainer_price}</p>
                <p><b>CreatedAt:</b>     {selectedOrder.createdAt}</p>
              </div>
            </div>
            <div className="text-end mt-3">
              <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>
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