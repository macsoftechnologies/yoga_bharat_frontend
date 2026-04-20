import React, { useEffect, useState, useRef, useCallback } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  getTrainers,
  approveTrainer,
  rejectTrainer,
  disableTrainer,
  getCertificatesByUser,
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  FaFilter, FaFileCsv, FaFileExcel,
  FaChevronDown, FaSortAmountDown, FaSortAmountUp,
} from "react-icons/fa";
import * as XLSX from "xlsx";

function Trainer() {
  const navigate = useNavigate();

  const [trainers,        setTrainers]        = useState([]);
  const [viewOpen,        setViewOpen]        = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [certificates,    setCertificates]    = useState([]);
  const [currentPage,     setCurrentPage]     = useState(1);
  const [totalPages,      setTotalPages]      = useState(1);
  const [totalCount,      setTotalCount]      = useState(0);
  const [limit,           setLimit]           = useState(10);
  const [loading,         setLoading]         = useState(false);
  const [exporting,       setExporting]       = useState(false);

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

  const [appliedFilters, setAppliedFilters] = useState({
    name:         "",
    mobileNumber: "",
    gender:       "",
    fromDate:     "",
    toDate:       "",
  });

  // ── Core fetch (useCallback, no state deps — all values passed as args) ────
  const fetchData = useCallback(async (page, lim, activeFilters, activeSortOrder) => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilters.name)         params.name         = activeFilters.name;
      if (activeFilters.mobileNumber) params.mobileNumber = activeFilters.mobileNumber;
      if (activeFilters.gender)       params.gender       = activeFilters.gender;
      if (activeFilters.fromDate)     params.fromDate     = activeFilters.fromDate;
      if (activeFilters.toDate)       params.toDate       = activeFilters.toDate;
      // Backend expects "asc" or "des" (NOT "desc")
      if (activeSortOrder === "asc")  params.sortOrder    = "asc";
      if (activeSortOrder === "desc") params.sortOrder    = "des";

      const res = await getTrainers(page, lim, params);

      if (Array.isArray(res)) {
        setTrainers(res);
        setTotalPages(1);
        setTotalCount(res.length);
      } else if (res && Array.isArray(res.data)) {
        setTrainers(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || res.data.length);
      } else {
        setTrainers([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch {
      setTrainers([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []); // stable — no closure deps

  // ── useEffect: fires whenever page/limit/appliedFilters/sortOrder changes ──
  useEffect(() => {
    fetchData(currentPage, limit, appliedFilters, sortOrder);
  }, [currentPage, limit, appliedFilters, sortOrder, fetchData]);

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
    setAppliedFilters({ ...filters }); // triggers useEffect
  };

  const handleClearFilters = () => {
    const cleared = { name: "", mobileNumber: "", gender: "", fromDate: "", toDate: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);   // triggers useEffect
    setSortOrder("");              // triggers useEffect
    setCurrentPage(1);
  };

  // ── Limit change ───────────────────────────────────────────────────────────
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  // ── Export helpers ─────────────────────────────────────────────────────────
  const fetchAllTrainersForExport = async () => {
    try {
      const params = {};
      if (appliedFilters.name)         params.name         = appliedFilters.name;
      if (appliedFilters.mobileNumber) params.mobileNumber = appliedFilters.mobileNumber;
      if (appliedFilters.gender)       params.gender       = appliedFilters.gender;
      if (appliedFilters.fromDate)     params.fromDate     = appliedFilters.fromDate;
      if (appliedFilters.toDate)       params.toDate       = appliedFilters.toDate;
      if (sortOrder === "asc")         params.sortOrder    = "asc";
      if (sortOrder === "desc")        params.sortOrder    = "des";
      params.isExport                                      = true;

      const res = await getTrainers(null, null,{ ...params});
      if (Array.isArray(res))       return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch (err) {
      console.error("Export fetch error:", err);
      return [];
    }
  };

  const buildTrainerExportRows = (data) =>
    data.map((item, index) => ({
      "S.No":         index + 1,
      "Name":         item.name         || "-",
      "Mobile":       item.mobileNumber || "-",
      "Email":        item.email        || "-",
      "Gender":       item.gender       || "-",
      "Age":          item.age          || "-",
      "eKYC Status":  item.ekyc_status  || "-",
      "Status":       item.status       || "-",
      "Is Disabled":  item.isDisabled   ? "Yes" : "No",
      "Created Date": item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day:   "2-digit",
                          month: "2-digit",
                          year:  "numeric",
                        })
                      : "-",
    }));

  const exportCSV = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllTrainersForExport();
      const rows    = buildTrainerExportRows(allData);
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
      link.download = `trainer_list_${new Date().toISOString().slice(0, 10)}.csv`;
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
      const allData = await fetchAllTrainersForExport();
      const rows    = buildTrainerExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook  = XLSX.utils.book_new();
      const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key]).length)) + 2,
      }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Trainers");
      XLSX.writeFile(workbook, `trainer_list_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ── Modal ──────────────────────────────────────────────────────────────────
  const openModal = async (item) => {
    setSelectedTrainer(item);
    setViewOpen(true);
    try {
      const res = await getCertificatesByUser(item.userId);
      setCertificates(res.data || []);
    } catch {
      setCertificates([]);
    }
  };

  const getEkycStyle = (status) => {
    if (status === "approved") return { background: "#28a745", color: "#fff" };
    if (status === "rejected") return { background: "#fd7e14", color: "#fff" };
    return { background: "#dc3545", color: "#fff" };
  };

  // ── Approve / Reject / Toggle ──────────────────────────────────────────────
  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "Approve Trainer?",
      text: "Are you sure you want to approve this trainer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await approveTrainer(selectedTrainer.userId);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Trainer Approved", showConfirmButton: false, timer: 3000 });
      setTrainers((prev) =>
        prev.map((t) => t.userId === selectedTrainer.userId ? { ...t, ekyc_status: "approved" } : t)
      );
      setViewOpen(false);
      setSelectedTrainer(null);
    } catch {
      Swal.fire("Error", "Approval failed", "error");
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Reject Trainer?",
      text: "Are you sure you want to reject this trainer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await rejectTrainer(selectedTrainer.userId);
      Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Trainer Rejected", showConfirmButton: false, timer: 6000, timerProgressBar: true, background: "#d33", color: "#ffffff" });
      setTrainers((prev) =>
        prev.map((t) => t.userId === selectedTrainer.userId ? { ...t, ekyc_status: "rejected" } : t)
      );
      setViewOpen(false);
      setSelectedTrainer(null);
    } catch {
      Swal.fire("Error", "Rejection failed", "error");
    }
  };

  const handleToggleDisable = async (item, e) => {
    e.stopPropagation();
    const isCurrentlyDisabled = item.isDisabled === true || item.isDisabled === "true";
    const newValue    = !isCurrentlyDisabled;
    const actionText  = isCurrentlyDisabled ? "Enable" : "Disable";
    const actionColor = isCurrentlyDisabled ? "#28a745" : "#d33";

    const result = await Swal.fire({
      title: `${actionText} Trainer?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this trainer?`,
      icon: isCurrentlyDisabled ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: actionColor,
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await disableTrainer(item.userId, newValue);
      Swal.fire({
        toast: true, position: "top-end",
        icon: isCurrentlyDisabled ? "success" : "warning",
        title: `Trainer ${actionText}d`,
        showConfirmButton: false, timer: 3000, timerProgressBar: true,
        background: isCurrentlyDisabled ? "#35a542" : "#d33", color: "#ffffff",
      });
      setTrainers((prev) =>
        prev.map((t) => t.userId === item.userId ? { ...t, isDisabled: newValue } : t)
      );
    } catch {
      Swal.fire("Error", `${actionText} failed`, "error");
    }
  };

  const goToProfile = (userId, trainerData) => navigate(`/trainer/${userId}`, { state: { trainer: trainerData } });


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
    { header: "S.No",         accessor: "sno" },
    { header: "Name",         accessor: "name" },
    { header: "Mobile",       accessor: "mobileNumber" },
    { header: "Email",        accessor: "email" },
    { header: "Gender",       accessor: "gender" },
    { header: "Age",          accessor: "age" },
    { header: CreatedDateHeader, accessor: "createdDate" },   // ← sortable
    { header: "eKYC",         accessor: "ekyc" },
    { header: "Action",       accessor: "action" },
  ];

  const tableData = trainers.map((item, index) => ({
  _rowonClick: () => goToProfile(item.userId, item),
    sno:          index + 1 + (currentPage - 1) * limit,
    name:         item.name,
    mobileNumber: item.mobileNumber,
    email:        item.email,
    gender:       item.gender,
    age:          item.age,
    createdDate:  item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
          day:   "2-digit",
          month: "2-digit",
          year:  "numeric",
        })
      : "-",

    ekyc: (
      <span
        onClick={(e) => { e.stopPropagation(); if (item.ekyc_status === "pending") openModal(item); }}
        style={{
          padding: "4px 10px", borderRadius: "6px",
          cursor: item.ekyc_status === "pending" ? "pointer" : "default",
          ...getEkycStyle(item.ekyc_status),
        }}
      >
        {item.ekyc_status}
      </span>
    ),

    action: (
      <button
        onClick={(e) => handleToggleDisable(item, e)}
        style={{
          padding: "4px 12px", borderRadius: "6px", border: "none",
          cursor: "pointer", fontWeight: 600, fontSize: "13px",
          background: (item.isDisabled === true || item.isDisabled === "true") ? "#dc3545" : "#28a745",
          color: "#fff",
        }}
      >
        {(item.isDisabled === true || item.isDisabled === "true") ? "Disabled" : "Enabled"}
      </button>
    ),
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
          TRAINER LIST
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

      {/* ── Row 2: Hint + record count ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "16px", color: "#ff7a00",background: "#000000", borderRadius:"15px",padding: "7px", marginTop: "15px", fontStyle: "italic" }}>
          💡 Click on any row to view profile →
        </span>
        <span style={{ fontSize: "14px", color: "#333" }}>
          Showing{" "}
          <strong style={{ color: "#ff7a00", fontWeight: "700" }}>{trainers.length}</strong>
          {totalCount > trainers.length && (
            <> of <strong style={{ color: "#333", fontWeight: "600" }}>{totalCount}</strong></>
          )}{" "}
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
            title="Export all filtered trainers as CSV"
            style={btnCSV(exporting)}
          >
            CSV <FaFileCsv style={{ fontSize: "16px" }} />
          </button>

          <button
            onClick={exportExcel}
            disabled={exporting}
            title="Export all filtered trainers as Excel"
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

      {/* ── Modal ── */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Trainer Details" size="xl">
        {selectedTrainer && (
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <p><b>Name:</b>   {selectedTrainer.name}</p>
                <p><b>Mobile:</b> {selectedTrainer.mobileNumber}</p>
                <p><b>Email:</b>  {selectedTrainer.email}</p>
                <p><b>Gender:</b> {selectedTrainer.gender}</p>
                <p><b>Age:</b>    {selectedTrainer.age}</p>
              </div>

              <div className="col-md-4">
                <p><b>Profile Picture:</b></p>
                {selectedTrainer.profile_pic ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedTrainer.profile_pic}`}
                    alt="Profile"
                    width="150"
                  />
                ) : "N/A"}
              </div>

              <div className="col-md-4">
                <h5>Professional Details</h5>
                {selectedTrainer.professional_details?.length > 0
                  ? selectedTrainer.professional_details.map((y) => (
                      <p key={y._id}><b>Yoga:</b> {y.yoga_name}</p>
                    ))
                  : "N/A"}
              </div>

              <hr />

              <div className="col-12 mt-3">
                <h5>Certificates</h5>
                {certificates.length > 0 ? (
                  <div className="row">
                    {certificates.map((c) => (
                      <div className="col-md-6 mb-3" key={c._id}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: "16px",
                          padding: "14px 16px", background: "#eafaf2",
                          borderRadius: "16px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        }}>
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${c.certificate}`}
                            alt="Certificate"
                            style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "12px", background: "#fff" }}
                          />
                          <div>
                            <h6 style={{ margin: 0, fontWeight: "700" }}>{c.headline || "Hatha Yoga"}</h6>
                            <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#666" }}>
                              {c.description || "Lorem ipsum dolor sit amet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>N/A</p>}
              </div>

              <hr />

              <div className="col-md-4">
                <h5>Payment Details</h5>
                <p><b>Recipient:</b>      {selectedTrainer.recipient_name}</p>
                <p><b>Account No:</b>     {selectedTrainer.account_no}</p>
                <p><b>Account Branch:</b> {selectedTrainer.account_branch}</p>
                <p><b>Branch Address:</b> {selectedTrainer.branch_address}</p>
                <p><b>IFSC code:</b>      {selectedTrainer.ifsc_code}</p>
              </div>

              <div className="col-md-4">
                <h5>Journey Images</h5>
                {selectedTrainer.journey_images?.length > 0
                  ? selectedTrainer.journey_images.map((img, i) => (
                      <img
                        key={i}
                        src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                        alt="Journey"
                        width="100" height="100"
                        className="me-2 mb-2"
                      />
                    ))
                  : "N/A"}
              </div>

              <div className="col-md-4">
                <h5>Yoga Video</h5>
                {selectedTrainer.yoga_video ? (
                  <video
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedTrainer.yoga_video}`}
                    width="100%" height="200" controls playsInline
                    style={{ borderRadius: "8px", marginTop: "5px" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : "N/A"}
              </div>
            </div>

            <div className="text-end mt-3">
              {selectedTrainer.ekyc_status === "pending" && (
                <>
                  <button className="btn btn-success me-2" onClick={handleApprove}>Approve</button>
                  <button className="btn btn-danger  me-2" onClick={handleReject}>Reject</button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Trainer;