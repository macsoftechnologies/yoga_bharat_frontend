import React, { useEffect, useState, useCallback } from "react";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";
import {
  getTrainers,
  getPaymentCycles,
} from "../services/authService";
import { FaFilter, FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

/* ─── Status badge colours ──────────────────────────────────────────────── */
const STATUS_STYLES = {
  pending_review: { background: "#fd7e14", color: "#fff" },
  approved:       { background: "#28a745", color: "#fff" },
  rejected:       { background: "#dc3545", color: "#fff" },
  paid:           { background: "#0d6efd", color: "#fff" },
  failed:         { background: "#6c757d", color: "#fff" },
};

const getStatusStyle = (s = "") =>
  STATUS_STYLES[s.toLowerCase()] ?? { background: "#aaa", color: "#fff" };

/* ─── Shared button styles ───────────────────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════════════════════ */

function PaymentCycle() {
  const navigate = useNavigate();

  /* ── Data states ─────────────────────────────────────────────────────── */
  const [cycles,      setCycles]      = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalCount,  setTotalCount]  = useState(0);
  const [limit,       setLimit]       = useState(10);
  const [loading,     setLoading]     = useState(false);
  const [exporting,   setExporting]   = useState(false);

  /* ── Trainer dropdown ────────────────────────────────────────────────── */
  const [trainerOptions, setTrainerOptions] = useState([]);

  /* ── Filter states ───────────────────────────────────────────────────── */
  const emptyFilters = { trainerId: "", status: "" };
  const [filters,        setFilters]        = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

  /* ── Load all trainers once for dropdown ─────────────────────────────── */
  useEffect(() => {
    getTrainers(1, 10, {})
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setTrainerOptions(list.map((t) => ({ userId: t.userId, name: t.name })));
      })
      .catch(() => setTrainerOptions([]));
  }, []);

  /* ── Core fetch ──────────────────────────────────────────────────────── */
  const fetchData = useCallback(async (page, lim, activeFilters) => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilters.trainerId) params.trainerId = activeFilters.trainerId;
      if (activeFilters.status)    params.status    = activeFilters.status;

      const res = await getPaymentCycles(page, lim, params);

      if (Array.isArray(res)) {
        setCycles(res);
        setTotalPages(1);
        setTotalCount(res.length);
      } else if (res && Array.isArray(res.data)) {
        setCycles(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || res.data.length);
      } else {
        setCycles([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch {
      setCycles([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, limit, appliedFilters);
  }, [currentPage, limit, appliedFilters, fetchData]);

  /* ── Filter handlers ─────────────────────────────────────────────────── */
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  /* ── Helpers ─────────────────────────────────────────────────────────── */
const fmtDate = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  // Use UTC values to avoid timezone shift
  const day   = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year  = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

  /* ── Row click → profile ─────────────────────────────────────────────── */
  // const goToProfile = (cycleId) => navigate(`/paymentcycle/${cycleId}`);
  const goToProfile = (cycleId, cycleData) => navigate(`/paymentcycle/${cycleId}`, { state: { cycle: cycleData } });

  /* ── Export ──────────────────────────────────────────────────────────── */
  const fetchAllForExport = async () => {
    try {
      const params = {};
      if (appliedFilters.trainerId) params.trainerId = appliedFilters.trainerId;
      if (appliedFilters.status)    params.status    = appliedFilters.status;
      params.isExport = true;
      const res = await getPaymentCycles(1, 10, { ...params });
      if (Array.isArray(res))       return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch (err) {
      console.error("Export fetch error:", err);
      return [];
    }
  };

  const buildExportRows = (data) =>
    data.map((item, i) => ({
      "S.No":           i + 1,
      "Trainer Name":   item.trainerName    || "-",
      "Trainer Email":  item.trainerEmail   || "-",
      "Trainer Mobile": item.trainerMobile  || "-",
      "Account No":     item.account_no     || "-",
      "IFSC Code":      item.ifsc_code      || "-",
      "Account Branch": item.account_branch || "-",
      "Branch Address": item.branch_address || "-",
      "Recipient Name": item.recipient_name || "-",
      "Cycle Start":    fmtDate(item.cycleStart),
      "Cycle End":      fmtDate(item.cycleEnd),
      "Total Earnings": item.totalEarnings  ?? "-",
      "Total Sessions": item.totalSessions  ?? "-",
      "Status":         item.status         || "-",
      "Admin Note":     item.adminNote      || "-",
      "Approved By":    item.approvedBy     || "-",
      "Approved At":    fmtDate(item.approvedAt),
      "Paid At":        fmtDate(item.paidAt),
      "Failure Reason": item.failureReason  || "-",
      "Created Date":   fmtDate(item.createdAt),
    }));

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
          headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(",")
        ),
      ];
      const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `payment_cycles_${new Date().toISOString().slice(0, 10)}.csv`;
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
      const allData = await fetchAllForExport();
      const rows    = buildExportRows(allData);
      if (!rows.length) return alert("No data to export.");
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook  = XLSX.utils.book_new();
      const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key]).length)) + 2,
      }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentCycles");
      XLSX.writeFile(workbook, `payment_cycles_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  /* ── Table columns ───────────────────────────────────────────────────── */
  const columns = [
    { header: "S.No",           accessor: "sno" },
    { header: "Trainer Name",   accessor: "trainerName" },
    { header: "Trainer Mobile", accessor: "trainerMobile" },
    { header: "Cycle Start",    accessor: "cycleStart" },
    { header: "Cycle End",      accessor: "cycleEnd" },
    { header: "Total Earnings", accessor: "totalEarnings" },
    { header: "Total Sessions", accessor: "totalSessions" },
    { header: "Created Date",   accessor: "createdDate" },
    { header: "Status",         accessor: "status" },
  ];

  const tableData = cycles.map((item, index) => ({
    _rowonClick: () => goToProfile(item.cycleId || item._id, item),
    sno:           index + 1 + (currentPage - 1) * limit,
    trainerName:   item.trainerName   || "-",
    trainerMobile: item.trainerMobile || "-",
    cycleStart:    fmtDate(item.cycleStart),
    cycleEnd:      fmtDate(item.cycleEnd),
    totalEarnings: item.totalEarnings != null ? `₹${item.totalEarnings}` : "-",
    totalSessions: item.totalSessions ?? "-",
    createdDate:   fmtDate(item.createdAt),
    status: (
      <span style={{
        padding: "4px 10px", borderRadius: "6px",
        fontSize: "12px", fontWeight: 600,
        ...getStatusStyle(item.status),
      }}>
        {item.status || "-"}
      </span>
    ),
  }));

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div>

      {/* Export overlay */}
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

      {/* Row 1: Title + Records per page */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
          PAYMENT CYCLES
        </h2>
        <div className="d-flex align-items-center gap-2">
          <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>Records per page:</label>
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

      {/* Row 2: Hint + record count */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "16px", color: "#ff7a00", marginTop: "15px", fontStyle: "italic" }}>
          💡 Click on any row to view details →
        </span>
        <span style={{ fontSize: "14px", color: "#333" }}>
          Showing{" "}
          <strong style={{ color: "#ff7a00", fontWeight: "700" }}>{cycles.length}</strong>
          {totalCount > cycles.length && (
            <> of <strong style={{ color: "#333", fontWeight: "600" }}>{totalCount}</strong></>
          )}{" "}
          records
        </span>
      </div>

      {/* Filter Card */}
      <div className="card p-3 mb-3 shadow-sm">
        <h5 className="mb-3">Filters</h5>
        <div className="row">

          {/* Trainer Name dropdown */}
          <div className="col-md-4 mb-2">
            <label>Trainer Name</label>
            <select
              className="form-select"
              value={filters.trainerId}
              onChange={(e) => handleFilterChange("trainerId", e.target.value)}
            >
              <option value="">All Trainers</option>
              {trainerOptions.map((t) => (
                <option key={t.userId} value={t.userId}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="col-md-4 mb-2">
            <label>Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
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
            title="Export all filtered payment cycles as CSV"
            style={btnCSV(exporting)}
          >
            CSV <FaFileCsv style={{ fontSize: "16px" }} />
          </button>

          <button
            onClick={exportExcel}
            disabled={exporting}
            title="Export all filtered payment cycles as Excel"
            style={btnExcel(exporting)}
          >
            Excel <FaFileExcel style={{ fontSize: "16px" }} />
          </button>
        </div>
      </div>

      {/* Table */}
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

export default PaymentCycle;