import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { getClients, getBookings } from "../services/authService";
import {
  FaFilter, FaFileCsv, FaFileExcel,
  FaChevronDown, FaSortAmountDown, FaSortAmountUp,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import "./Dashboard.css";

// ─── helper: build the filter payload sent to the API ───────────────────────
function buildPayload({ clientId, filters, sortOrder, isExport = false }) {
  return {
    isExport,
    sortOrder: sortOrder === "asc" ? "asc" : sortOrder === "desc" ? "des" : "",
    clientId:           clientId   || "",
    bookingType:        filters.bookingType || "",
    status:             filters.status      || "",
    fromDate:           filters.fromDate    || "",
    toDate:             filters.toDate      || "",
    yogaName:           filters.yogaName    || "",
    accepted_trainerId: "",
    yogaId:             "",
    bookingId:          "",
    time:               "",
    scheduledDate:      "",
    clientName:         "",
    trainerName:        "",
  };
}

function ClientProfile() {
  const { userId } = useParams();
  const navigate   = useNavigate();

  const [client,       setClient]       = useState(null);
  const [ordersList,   setOrdersList]   = useState([]);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);
  const [limit,        setLimit]        = useState(10);
  const [loading,      setLoading]      = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [yogaOptions,  setYogaOptions]  = useState([]);

  const [filters, setFilters] = useState({
    bookingType: "",
    status:      "",
    fromDate:    "",
    toDate:      "",
    yogaName:    "",
  });

  // ── sort state ───────────────────────────────────────────────────────────
  const [sortOrder,        setSortOrder]        = useState("");   // "" | "asc" | "desc"
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

  // ── fetch client info ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res         = await getClients(1, 10);
        const clientArray = Array.isArray(res.data) ? res.data : [];
        const selected    = clientArray.find((c) => c.userId === userId);
        setClient(selected || null);
      } catch (err) {
        console.error("Error fetching client:", err);
        setClient(null);
      }
    };
    fetchClient();
  }, [userId]);

  // ── fetch unique yoga names for filter dropdown ──────────────────────────
  useEffect(() => {
    const fetchAllYogaNames = async () => {
      if (!client?.userId) return;
      try {
        const res = await getBookings(1, 10, { clientId: client.userId });
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
  }, [client]);

  // ── paginated bookings fetch ─────────────────────────────────────────────
  const fetchBookings = useCallback(
    async (page = 1, overrideFilters, overrideLimit, overrideSortOrder) => {
      if (!client?.userId) return;
      try {
        setLoading(true);

        const activeFilters   = overrideFilters   !== undefined ? overrideFilters   : filters;
        const activeLimit     = overrideLimit     !== undefined ? overrideLimit     : limit;
        const activeSortOrder = overrideSortOrder !== undefined ? overrideSortOrder : sortOrder;

        const payload = buildPayload({
          clientId:  client.userId,
          filters:   activeFilters,
          sortOrder: activeSortOrder,
          isExport:  false,
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
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setOrdersList([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [client, filters, limit, sortOrder]
  );

  const fetchBookingsRef = useRef();
  fetchBookingsRef.current = fetchBookings;

  useEffect(() => {
    if (client?.userId) fetchBookingsRef.current(currentPage);
  }, [currentPage, client]);

  // ── sort handler → re-fetch from API ────────────────────────────────────
  const handleSort = (order) => {
    setSortOrder(order);
    setSortDropdownOpen(false);
    setCurrentPage(1);
    fetchBookings(1, undefined, undefined, order);
  };

  // ── fetch ALL filtered records for export (isExport: true) ───────────────
  const fetchAllForExport = async () => {
    if (!client?.userId) return [];
    const payload = buildPayload({
      clientId:  client.userId,
      filters,
      sortOrder,
      isExport:  true,
    });
    const res = await getBookings(1, limit, payload);
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  // ── helper: map raw API record → export row ───────────────────────────────
  const buildExportRows = (data) =>
    data.map((item, index) => ({
      "S.No": index + 1,
      "Created Date": item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
          day:   "2-digit",
          month: "2-digit",
          year:  "numeric",
        })
      : "-",
      "Scheduled Date": item.scheduledDate
                        ? new Date(item.scheduledDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-",
      "Booking Type": item.bookingType || "-",
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
      "Time":   item.time || "-",
      "Status": item.status
        ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
        : "-",
    }));

  // ── CSV Export ────────────────────────────────────────────────────────────
  const exportCSV = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllForExport();
      const rows    = buildExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const headers  = Object.keys(rows[0]);
      const csvLines = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((h) => `"${String(row[h]).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ];

      const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `client_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ── Excel Export ──────────────────────────────────────────────────────────
  const exportExcel = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllForExport();
      const rows    = buildExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook  = XLSX.utils.book_new();

      const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key]).length)) + 2,
      }));
      worksheet["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
      XLSX.writeFile(
        workbook,
        `client_bookings_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ── UI handlers ───────────────────────────────────────────────────────────
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchBookings(1, filters, limit, sortOrder);
  };

  const handleClearFilters = () => {
    const cleared = { bookingType: "", status: "", fromDate: "", toDate: "", yogaName: "" };
    setFilters(cleared);
    setSortOrder("");
    setCurrentPage(1);
    fetchBookings(1, cleared, limit, "");
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setCurrentPage(1);
    fetchBookings(1, filters, newLimit, sortOrder);
  };

  // ── Created Date column header with sort dropdown ─────────────────────────
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
        {sortOrder === "asc"  && <FaSortAmountDown style={{ fontSize: "12px", color: "#ff7a00" }} />}
        {sortOrder === "desc" && <FaSortAmountUp   style={{ fontSize: "12px", color: "#ff7a00" }} />}
        {!sortOrder           && <FaChevronDown    style={{ fontSize: "10px", color: "#888" }} />}
      </div>

      {sortDropdownOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          zIndex: 999, background: "#fff", border: "1px solid #dee2e6",
          borderRadius: "6px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          minWidth: "175px", overflow: "hidden",
        }}>
          {[
            { label: "Sort Ascending",  value: "asc",  Icon: FaSortAmountDown },
            { label: "Sort Descending", value: "desc", Icon: FaSortAmountUp   },
          ].map(({ label, value, Icon }, i) => (
            <React.Fragment key={value}>
              {i > 0 && <div style={{ borderTop: "1px solid #f0f0f0" }} />}
              <div
                onClick={() => handleSort(value)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 16px", cursor: "pointer", fontSize: "14px",
                  color:      sortOrder === value ? "#ff7a00" : "#333",
                  background: sortOrder === value ? "#fff5eb" : "#fff",
                  fontWeight: sortOrder === value ? "600"     : "400",
                  borderLeft: sortOrder === value
                    ? "3px solid #ff7a00"
                    : "3px solid transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (sortOrder !== value) e.currentTarget.style.background = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  if (sortOrder !== value) e.currentTarget.style.background = "#fff";
                }}
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

  // ── loading state ─────────────────────────────────────────────────────────
  if (!client) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <div className="table-spinner" />
      </div>
    );
  }

  // ── Table columns 
  const columns = [
    { header: "S.No",            accessor: "srNo" },  
    { header: "ScheduledDate",   accessor: "scheduledDate" },
    { header: "Time",            accessor: "time" },
    { header: "Booking Type",    accessor: "bookingType" },
    { header: "Trainer Name",    accessor: "trainerName" },
    { header: "Yoga Name",       accessor: "yogaName" },
    { header: "Language",        accessor: "language" },
    { header: "Client Price",    accessor: "clientPrice" },
    { header: CreatedDateHeader, accessor: "createdAt" }, 
    { header: "Status",          accessor: "status" },
  ];

  const tableData = ordersList.map((item, index) => ({
    srNo: (currentPage - 1) * limit + index + 1,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
          day:   "2-digit",
          month: "2-digit",
          year:  "numeric",
        })
      : "-",
    bookingType:   item.bookingType || "-",
    trainerName:   item.accepted_trainerId?.name || "-",
    yogaName: (Array.isArray(item.yogaId)
      ? item.yogaId?.[0]?.yoga_name
      : item.yogaId?.yoga_name) || "-",
    language: (Array.isArray(item.languageId)
      ? item.languageId?.[0]?.language_name
      : item.languageId?.language_name) || "-",
    clientPrice: `₹${(Array.isArray(item.yogaId)
      ? item.yogaId?.[0]?.client_price
      : item.yogaId?.client_price) || 0}`,
    scheduledDate: item.scheduledDate
  ? new Date(item.scheduledDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  : "-",

time: item.time || "-",

    
    status: (
      <span className={`status-badge ${
        item.status === "ongoing"   ? "status-ongoing"   :
        item.status === "accepted"  ? "status-accepted"  :
        item.status === "opened"    ? "status-opened"    :
        item.status === "completed" ? "status-completed" :
        item.status === "cancelled" ? "status-cancelled" : ""
      }`}>
        {item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "-"}
      </span>
    ),
  }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container mt-3">

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

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>CLIENT PROFILE</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/client")}>
          ← Back
        </button>
      </div>

      {/* ── Client Info Card ── */}
      <div className="card p-3 shadow-sm mb-4">
        <h4 className="mb-3">{client.name}</h4>
        <div className="row">
          <div className="col-md-6">
            <p><b>Email:</b>  {client.email}</p>
            <p><b>Mobile:</b> {client.mobileNumber}</p>
            <p><b>Age:</b>    {client.age}</p>
          </div>
          <div className="col-md-6">
            <p><b>Gender:</b>     {client.gender}</p>
            <p><b>Status:</b>     {client.status}</p>
            <p><b>Created At:</b> {new Date(client.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ── Bookings Section ── */}
      <div className="card p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Bookings List</h3>
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
                <option value="ongoing" style={{ background: "#F3E8FF", color: "#6B21A8", fontWeight: "600" }}>
                  🟣 On Going
                </option>
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
          <div className="text-end mt-3 d-flex justify-content-end gap-3 flex-wrap">
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
        <div className="d-flex align-items-center justify-content-between mb-2">
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
      </div>
    </div>
  );
}

export default ClientProfile;