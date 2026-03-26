import React, { useState, useEffect, useRef, useCallback } from "react";
import Table from "../components/Table";
import { getClients } from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  FaFilter, FaFileCsv, FaFileExcel,
  FaChevronDown, FaSortAmountDown, FaSortAmountUp,
} from "react-icons/fa";
import * as XLSX from "xlsx";

function Client() {
  const navigate = useNavigate();

  const [clients,     setClients]     = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalCount,  setTotalCount]  = useState(0);
  const [limit,       setLimit]       = useState(10);
  const [loading,     setLoading]     = useState(false);
  const [exporting,   setExporting]   = useState(false);

  // ── Sort state ─────────────────────────────────────────────────────────────
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

  // ── Filters ────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    name:         "",
    mobileNumber: "",
    gender:       "",
    fromDate:     "",
    toDate:       "",
  });

  // appliedFilters drives the actual API call — only updates on "Filter" click
  const [appliedFilters, setAppliedFilters] = useState({
    name:         "",
    mobileNumber: "",
    gender:       "",
    fromDate:     "",
    toDate:       "",
  });

  // ── Core fetch (useCallback, no state deps — all values passed as args) ────
  //    This completely avoids stale closure on sortOrder / appliedFilters
  const fetchClients = useCallback(async (page, lim, activeFilters, activeSortOrder) => {
    setLoading(true);
    try {
      // Build a clean params object — backend uses GET query string
      const params = {};
      if (activeFilters.name)         params.name         = activeFilters.name;
      if (activeFilters.mobileNumber) params.mobileNumber = activeFilters.mobileNumber;
      if (activeFilters.gender)       params.gender       = activeFilters.gender;
      if (activeFilters.fromDate)     params.fromDate     = activeFilters.fromDate;
      if (activeFilters.toDate)       params.toDate       = activeFilters.toDate;
      // Backend expects "asc" or "des" (NOT "desc")
      if (activeSortOrder === "asc")  params.sortOrder    = "asc";
      if (activeSortOrder === "desc") params.sortOrder    = "des";

      const res = await getClients(page, lim, params);

      if (Array.isArray(res)) {
        setClients(res);
        setTotalPages(1);
        setTotalCount(res.length);
      } else if (res && Array.isArray(res.data)) {
        setClients(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || res.data.length);
      } else {
        setClients([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("fetchClients error:", err);
      setClients([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []); // stable — no closure deps

  // ── useEffect: fires whenever page/limit/appliedFilters/sortOrder changes ──
  useEffect(() => {
    fetchClients(currentPage, limit, appliedFilters, sortOrder);
  }, [currentPage, limit, appliedFilters, sortOrder, fetchClients]);

  // ── Sort handler ───────────────────────────────────────────────────────────
  const handleSort = (order) => {
    setSortOrder(order);          // → triggers useEffect with latest sortOrder
    setSortDropdownOpen(false);
    setCurrentPage(1);
  };

  // ── Filter handlers ────────────────────────────────────────────────────────
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters({ ...filters }); // → triggers useEffect
  };

  const handleClearFilters = () => {
    const cleared = { name: "", mobileNumber: "", gender: "", fromDate: "", toDate: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);   // → triggers useEffect
    setSortOrder("");              // → triggers useEffect
    setCurrentPage(1);
  };

  // ── Limit change ───────────────────────────────────────────────────────────
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  // ── Export helpers ─────────────────────────────────────────────────────────
  const fetchAllClientsForExport = async () => {
    try {
      const params = {};
      if (appliedFilters.name)         params.name         = appliedFilters.name;
      if (appliedFilters.mobileNumber) params.mobileNumber = appliedFilters.mobileNumber;
      if (appliedFilters.gender)       params.gender       = appliedFilters.gender;
      if (appliedFilters.fromDate)     params.fromDate     = appliedFilters.fromDate;
      if (appliedFilters.toDate)       params.toDate       = appliedFilters.toDate;
      if (sortOrder === "asc")         params.sortOrder    = "asc";
      if (sortOrder === "desc")        params.sortOrder    = "des";

      const res = await getClients(1, 10000, params);
      if (Array.isArray(res))       return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch (err) {
      console.error("Export fetch error:", err);
      return [];
    }
  };

  const buildClientExportRows = (data) =>
    data.map((item, index) => ({
      "S.No":               index + 1,
      "Name":               item.name         || "-",
      "Email":              item.email        || "-",
      "Mobile":             item.mobileNumber || "-",
      "Gender":             item.gender       || "-",
      "Age":                item.age          || "-",
      "Role":               item.role         || "-",
      "Health Preference":  item.health_preference?.length > 0
                              ? item.health_preference.map((p) => p.preference_name).join(", ")
                              : "-",
      "Created Date":       item.createdAt? new Date(item.createdAt).toLocaleDateString("en-IN", {
                                day:   "2-digit",
                                month: "2-digit",
                                year:  "numeric",
                              })
                            : "-",

                              
    }));

  const exportCSV = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllClientsForExport();
      const rows    = buildClientExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const headers  = Object.keys(rows[0]);
      const csvLines = [
        headers.join(","),
        ...rows.map((row) =>
          headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(",")
        ),
      ];

      const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `client_list_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportExcel = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllClientsForExport();
      const rows    = buildClientExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook  = XLSX.utils.book_new();
      const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key]).length)) + 2,
      }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
      XLSX.writeFile(workbook, `client_list_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const goToProfile = (userId) => navigate(`/client/${userId}`);

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

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    { header: "S.No",              accessor: "srNo" },
    { header: "Name",              accessor: "name" },
    { header: "Email",             accessor: "email" },
    { header: "Mobile",            accessor: "mobileNumber" },
    { header: "Gender",            accessor: "gender" },
    { header: "Age",               accessor: "age" },
    { header: "Role",              accessor: "role" },
    { header: CreatedDateHeader,   accessor: "createdDate" },   
    { header: "Health Preference", accessor: "healthPrefNames" },
  ];

  const tableData = clients.map((item, index) => ({
    _rowonClick: () => goToProfile(item.userId),

    srNo:         (currentPage - 1) * limit + index + 1,
    name:         item.name,
    email:        item.email,
    mobileNumber: item.mobileNumber,
    gender:       item.gender,
    age:          item.age,
    role:         item.role,
    createdDate:  item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
          day:   "2-digit",
          month: "2-digit",
          year:  "numeric",
        })
      : "-",
    healthPrefNames:
      item.health_preference?.length > 0
        ? item.health_preference.map((p) => p.preference_name).join(", ")
        : "N/A",
    healthPrefIcons:
      item.health_preference?.length > 0
        ? item.health_preference.map((pref) => (
            <img
              key={pref._id}
              src={`${process.env.REACT_APP_API_BASE_URL}/${pref.preference_icon}`}
              alt={pref.preference_name}
              width="50"
              className="me-1"
            />
          ))
        : "N/A",
  }));

  // ── Shared button styles ───────────────────────────────────────────────────
  const btnFilter = {
    background: "linear-gradient(135deg, #000000, #fcd34d)",
    color: "#fff", border: "none",
    padding: "8px 16px", borderRadius: "4px",
    display: "flex", alignItems: "center", gap: "6px",
    cursor: "pointer",
  };
  const btnClear = {
    background: "#7d6c6c", color: "#fff",
    border: "none", padding: "8px 16px", borderRadius: "4px",
    cursor: "pointer",
  };
  const btnCSV = (disabled) => ({
    background: disabled ? "#aaa" : "linear-gradient(135deg, #16a34a, #4ade80)",
    color: "#fff", border: "none",
    padding: "8px 16px", borderRadius: "4px",
    display: "flex", alignItems: "center", gap: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  });
  const btnExcel = (disabled) => ({
    background: disabled ? "#aaa" : "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    color: "#fff", border: "none",
    padding: "8px 16px", borderRadius: "4px",
    display: "flex", alignItems: "center", gap: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── Export overlay ── */}
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

      {/* ── Row 1: Title + Records per page ── */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
          CLIENT LIST
        </h2>
        <div className="d-flex align-items-center gap-2">
          <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>
            Records per page:
          </label>
          <select
            className="form-select form-select-sm"
            style={{ border: "2px solid #ff7a00", padding: "2px", cursor: "pointer", width: "75px" }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* ── Row 2: Hint + record count ── */}
      <div
        className="d-flex align-items-center justify-content-between mb-3"
        style={{ fontSize: "16px", marginTop: "20px", color: "#000" }}
      >
        <span style={{ color: "#ff7a00", fontSize: "16px", fontStyle: "italic" }}>
          💡 Click on any row to view profile →
        </span>
        <span>
          Showing{" "}
          <strong style={{ color: "#ff7a00" }}>{clients.length}</strong>{" "}
          {totalCount > clients.length ? (
            <>of <strong>{totalCount}</strong></>
          ) : null}{" "}
          records
        </span>
      </div>

      {/* ── Filter Card ── */}
      <div className="card p-3 mb-3 shadow-sm">
        <h5 className="mb-3">Filters</h5>
        <div className="row">

          <div className="col-md-4 mb-2">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-2">
            <label>Mobile Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by mobile"
              value={filters.mobileNumber}
              onChange={(e) => handleFilterChange("mobileNumber", e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-2">
            <label>Gender</label>
            <select
              className="form-select"
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <label>From Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-2">
            <label>To Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
          </div>
        </div>

        <div className="text-end mt-3 d-flex justify-content-end gap-3 flex-wrap">
          <button onClick={handleApplyFilters} style={btnFilter}>
            <FaFilter />
            <span>Filter</span>
          </button>

          <button onClick={handleClearFilters} style={btnClear}>
            Clear
          </button>

          <button
            onClick={exportCSV}
            disabled={exporting}
            title="Export all filtered clients as CSV"
            style={btnCSV(exporting)}
          >
            CSV <FaFileCsv style={{ fontSize: "16px" }} />
          </button>

          <button
            onClick={exportExcel}
            disabled={exporting}
            title="Export all filtered clients as Excel"
            style={btnExcel(exporting)}
          >
            Excel <FaFileExcel style={{ fontSize: "16px" }} />
          </button>
        </div>
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
  );
}

export default Client;