import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Table from "../components/Table";
import Swal from "sweetalert2";
import {
  getPaymentCycleById,
  approvePaymentCycle,
  rejectPaymentCycle,
  markPaymentCyclePaid,
  reinitiatePaymentCycle,  // ✅ imported from authService — no direct api import needed
} from "../services/authService";

/* ─── Status badge colours ──────────────────────────────────────────────── */
const STATUS_STYLES = {
  pending_review: { background: "#fd7e14", color: "#fff" },
  approved:       { background: "#28a745", color: "#fff" },
  rejected:       { background: "#dc3545", color: "#fff" },
  paid:           { background: "#0d6efd", color: "#fff" },
  failed:         { background: "#b02a37", color: "#fff", border: "2px solid #ff4d4d" },
};

const getStatusStyle = (s = "") =>
  STATUS_STYLES[s.toLowerCase()] ?? { background: "#aaa", color: "#fff" };

/* ─── Date formatters ───────────────────────────────────────────────────── */
const parseDateSafe = (v) => {
  if (!v) return null;
  if (typeof v === "string" && /T|Z/.test(v)) return new Date(v);
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(v);
};

const fmtDate = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  // Use UTC values to avoid timezone shift
  const day   = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year  = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const fmtDateTime = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  // Use UTC values to avoid timezone shift
  const day   = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year  = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const toInputDate = (d) => {
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

/* ─── Swal toast helpers ────────────────────────────────────────────────── */
const toastSuccess = (text) =>
  Swal.fire({
    title: "Success!", text, icon: "success",
    position: "top-end", toast: true, showConfirmButton: false,
    timer: 6000, timerProgressBar: true,
    background: "#35a542", color: "#ffffff",
  });

const toastError = (text) =>
  Swal.fire({
    title: "Error!", text, icon: "error",
    position: "top-end", toast: true, showConfirmButton: false,
    timer: 6000, timerProgressBar: true,
    background: "#dc3545", color: "#ffffff",
  });

/* ─── Modal Overlay wrapper ─────────────────────────────────────────────── */
const Modal = ({ title, onClose, children, maxWidth = "460px" }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      background: "#fff", borderRadius: "12px", padding: "28px 32px",
      width: "100%", maxWidth, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "20px",
      }}>
        <h5 style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>{title}</h5>
        <button onClick={onClose} style={{
          background: "none", border: "none", fontSize: "20px",
          cursor: "pointer", color: "#666", lineHeight: 1,
        }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */

function PaymentCycleProfile() {
  const { cycleId } = useParams();
  const navigate    = useNavigate();
  const location    = useLocation();

  const [cycle,    setCycle]    = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [loading,  setLoading]  = useState(false);

  /* ── Modal states ────────────────────────────────────────────────────── */
  const [showApproveModal,    setShowApproveModal]    = useState(false);
  const [showRejectModal,     setShowRejectModal]     = useState(false);
  const [showMarkPaidModal,   setShowMarkPaidModal]   = useState(false);
  const [showReinitiateModal, setShowReinitiateModal] = useState(false);
  const [actionLoading,       setActionLoading]       = useState(false);
  const [cycleLoading,        setCycleLoading]        = useState(true);

  /* Approve form */
  const [approveNote, setApproveNote] = useState("");

  /* Reject form */
  const [rejectReason, setRejectReason] = useState("");

  /* Mark as Paid form */
  const [paidForm, setPaidForm] = useState({
    paymentMethod: "NEFT", transactionRef: "", note: "",
  });

  /* Re-initiate form */
  const today = toInputDate(new Date());
  const [reinitiateForm, setReinitiateForm] = useState({
    fromDate: today,
    toDate:   today,
  });

  /* ── Get adminId from localStorage ──────────────────────────────────── */
  const getAdminId = () =>
    localStorage.getItem("adminId") ||
    localStorage.getItem("userId")  ||
    JSON.parse(localStorage.getItem("user") || "{}")?.adminId ||
    JSON.parse(localStorage.getItem("user") || "{}")?.userId  ||
    JSON.parse(localStorage.getItem("user") || "{}")?._id     ||
    "";

  /* ── Fetch cycle details + earnings ─────────────────────────────────── */
  const fetchCycle = async () => {
    if (!cycleId) return;
    setLoading(true);
    try {
      const res          = await getPaymentCycleById(cycleId);
      const cycleData    = res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? null;
      const earningsData = res?.earnings ?? res?.data?.earnings ?? [];
      if (cycleData)           setCycle(cycleData);
      if (earningsData.length) setEarnings(earningsData);
    } catch (err) {
      console.error("Fetch Payment Cycle Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cycleId) return;
    if (location.state?.cycle) {
      setCycle(location.state.cycle);
      setCycleLoading(false);
      fetchCycle();
      return;
    }
    setCycleLoading(false);
    fetchCycle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleId]);

  /* ══════════════════════════════════════════════════════════════════════
     ACTION HANDLERS
  ══════════════════════════════════════════════════════════════════════ */

  /* ── 1. Approve ──────────────────────────────────────────────────────── */
  const handleApprove = async () => {
    const adminId = getAdminId();
    if (!adminId) { toastError("Admin ID not found. Please log in again."); return; }
    setActionLoading(true);
    try {
      await approvePaymentCycle(cycleId, { adminId, note: approveNote });
      setShowApproveModal(false);
      setApproveNote("");
      toastSuccess("Payment cycle approved successfully!");
      fetchCycle();
    } catch (err) {
      toastError(err?.response?.data?.message || "Approve failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── 2. Reject ───────────────────────────────────────────────────────── */
  const handleReject = async () => {
    const adminId = getAdminId();
    if (!adminId) { toastError("Admin ID not found. Please log in again."); return; }
    if (!rejectReason.trim()) { toastError("Please enter a reason for rejection."); return; }

    setShowRejectModal(false);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This payment cycle will be rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
      zIndex: 99999,
    });

    if (!result.isConfirmed) { setShowRejectModal(true); return; }

    setActionLoading(true);
    try {
      await rejectPaymentCycle(cycleId, { adminId, reason: rejectReason });
      setRejectReason("");
      toastSuccess("Payment cycle rejected successfully.");
      fetchCycle();
    } catch (err) {
      toastError(err?.response?.data?.message || "Reject failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── 3. Mark as Paid ─────────────────────────────────────────────────── */
  const handleMarkPaid = async () => {
    if (!paidForm.transactionRef.trim()) {
      toastError("Please enter a transaction reference."); return;
    }
    setActionLoading(true);
    try {
      await markPaymentCyclePaid(cycleId, {
        paymentMethod:  paidForm.paymentMethod,
        transactionRef: paidForm.transactionRef,
        note:           paidForm.note,
      });
      setShowMarkPaidModal(false);
      setPaidForm({ paymentMethod: "NEFT", transactionRef: "", note: "" });
      toastSuccess("Payment cycle marked as paid!");
      fetchCycle();
    } catch (err) {
      toastError(err?.response?.data?.message || "Mark as Paid failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── 4. Re-initiate Cycle ────────────────────────────────────────────── */
  // ✅ Now calls reinitiatePaymentCycle() from authService (no direct api usage)
  const handleReinitiate = async () => {
    if (!reinitiateForm.fromDate || !reinitiateForm.toDate) {
      toastError("Please select both From Date and To Date."); return;
    }
    if (reinitiateForm.fromDate > reinitiateForm.toDate) {
      toastError("From Date cannot be after To Date."); return;
    }

    const trainerId =
      cycle?.trainerId        ||
      cycle?.trainer?._id     ||
      cycle?.trainer          ||
      "";

    if (!trainerId) {
      toastError("Trainer ID not found in this cycle. Cannot re-initiate.");
      return;
    }

    setActionLoading(true);
    try {
      await reinitiatePaymentCycle({
        trainerId,
        fromDate: reinitiateForm.fromDate,
        toDate:   reinitiateForm.toDate,
      });
      setShowReinitiateModal(false);
      toastSuccess("Payment cycle re-initiated successfully!");
      fetchCycle();
    } catch (err) {
      toastError(err?.response?.data?.message || "Re-initiate failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Loading / Not Found ─────────────────────────────────────────────── */
  if (cycleLoading || (!cycle && loading)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <div className="table-spinner" />
      </div>
    );
  }

  if (!cycle) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
        <h4>Payment cycle not found</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/paymentcycle")}>
          ← Back to Payment Cycles
        </button>
      </div>
    );
  }

  const status = (cycle.status || "").toLowerCase();

  /* ── Earnings table columns ──────────────────────────────────────────── */
  const earningColumns = [
    { header: "S.No",              accessor: "sno" },
    { header: "Yoga Name",         accessor: "yogaName" },
    { header: "Trainer Name",      accessor: "trainerName" },
    { header: "Client Name",       accessor: "clientName" },
    { header: "Client Price",      accessor: "clientPrice" },
    { header: "Trainer Price",     accessor: "trainerPrice" },
    { header: "Date",              accessor: "date" },
    { header: "Settlement Status", accessor: "settlementStatus" },
  ];

  const earningTableData = earnings.map((item, index) => ({
    sno:          index + 1,
    yogaName:     item.yogaName    || "-",
    trainerName:  item.trainerName || "-",
    clientName:   item.clientName  || "-",
    clientPrice:  item.clientPrice  != null ? `₹${item.clientPrice}`  : "₹0",
    trainerPrice: item.trainerPrice != null ? `₹${item.trainerPrice}` : "₹0",
    date:         item.date ? fmtDate(item.date) : "-",
    settlementStatus: (
      <span style={{
        padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
        background: item.settlementStatus === "settled" ? "#28a745" : "#fd7e14",
        color: "#fff",
      }}>
        {item.settlementStatus || "-"}
      </span>
    ),
  }));

  /* ── Info row helper ─────────────────────────────────────────────────── */
  const InfoRow = ({ label, value }) => (
    <p style={{ margin: "0 0 8px" }}>
      <b style={{ color: "#555" }}>{label}:</b>{" "}
      <span style={{ color: "#1a1a1a" }}>{value || "N/A"}</span>
    </p>
  );

  /* ── Shared input / label styles ─────────────────────────────────────── */
  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: "6px",
    border: "1px solid #ddd", fontSize: "14px", marginTop: "4px",
    outline: "none",
  };

  const labelStyle = { fontSize: "13px", fontWeight: 600, color: "#555" };

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="container mt-3">

      {/* ══ APPROVE MODAL ══════════════════════════════════════════════════ */}
      {showApproveModal && (
        <Modal title="✅ Approve Payment Cycle"
          onClose={() => !actionLoading && setShowApproveModal(false)}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Note (optional)</label>
            <textarea
              rows={3} placeholder="Enter approval note..."
              value={approveNote}
              onChange={(e) => setApproveNote(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowApproveModal(false)}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "1px solid #ccc",
                background: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "none",
                background: actionLoading ? "#aaa" : "#28a745",
                color: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              {actionLoading ? "Approving..." : "Approve"}
            </button>
          </div>
        </Modal>
      )}

      {/* ══ REJECT MODAL ═══════════════════════════════════════════════════ */}
      {showRejectModal && (
        <Modal title="❌ Reject Payment Cycle"
          onClose={() => !actionLoading && setShowRejectModal(false)}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>
              Reason for Rejection <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              rows={3} placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowRejectModal(false)}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "1px solid #ccc",
                background: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "none",
                background: actionLoading ? "#aaa" : "#dc3545",
                color: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              {actionLoading ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </Modal>
      )}

      {/* ══ MARK AS PAID MODAL ═════════════════════════════════════════════ */}
      {showMarkPaidModal && (
        <Modal title="💳 Mark as Paid"
          onClose={() => !actionLoading && setShowMarkPaidModal(false)}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Payment Method</label>
            <select
              value={paidForm.paymentMethod}
              onChange={(e) => setPaidForm((p) => ({ ...p, paymentMethod: e.target.value }))}
              style={inputStyle}>
              <option value="NEFT">NEFT</option>
              <option value="IMPS">IMPS</option>
              <option value="RTGS">RTGS</option>
              <option value="UPI">UPI</option>
              <option value="Razorpay">Razorpay</option>
            </select>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>
              Transaction Reference <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text" placeholder="e.g. UTR123456"
              value={paidForm.transactionRef}
              onChange={(e) => setPaidForm((p) => ({ ...p, transactionRef: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Note (optional)</label>
            <textarea
              rows={2} placeholder="e.g. Paid via HDFC"
              value={paidForm.note}
              onChange={(e) => setPaidForm((p) => ({ ...p, note: e.target.value }))}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowMarkPaidModal(false)}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "1px solid #ccc",
                background: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              Cancel
            </button>
            <button
              onClick={handleMarkPaid}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "none",
                background: actionLoading ? "#aaa" : "#0d6efd",
                color: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              {actionLoading ? "Processing..." : "Mark as Paid"}
            </button>
          </div>
        </Modal>
      )}

      {/* ══ RE-INITIATE CYCLE MODAL (rejected / failed) ════════════════════ */}
      {showReinitiateModal && (
        <Modal title="🔄 Re-initiate Payment Cycle"
          onClose={() => !actionLoading && setShowReinitiateModal(false)}>
          {/* Warning banner */}
          <div style={{
            background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "8px",
            padding: "10px 14px", marginBottom: "18px", fontSize: "13px", color: "#856404",
          }}>
            ⚠️ This will create a <strong>new</strong> payment cycle for trainer{" "}
            <strong>{cycle.trainerName || "—"}</strong> for the selected date range.
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                From Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                value={reinitiateForm.fromDate}
                disabled
                style={{ ...inputStyle, background: "#f5f5f5", cursor: "not-allowed", color: "#555" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                To Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                  type="date"
                  value={reinitiateForm.toDate}
                  disabled
                  style={{ ...inputStyle, background: "#f5f5f5", cursor: "not-allowed", color: "#555" }}
                />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowReinitiateModal(false)}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "1px solid #ccc",
                background: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              Cancel
            </button>
            <button
              onClick={handleReinitiate}
              disabled={actionLoading}
              style={{
                padding: "8px 20px", borderRadius: "6px", border: "none",
                background: actionLoading ? "#aaa" : "#6f42c1",
                color: "#fff", fontWeight: 600,
                cursor: actionLoading ? "not-allowed" : "pointer",
              }}>
              {actionLoading ? "Processing..." : "🔄 Re-initiate"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
          PAYMENT CYCLE PROFILE
        </h2>
        <button className="btn btn-secondary" onClick={() => navigate("/paymentcycle")}>
          ← Back
        </button>
      </div>

      {/* ── Status Banner + Action Buttons ───────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
        background: "#fafafa", border: "1px solid #e5e7eb",
        borderRadius: "10px", padding: "14px 20px", marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        <span style={{ fontSize: "14px", color: "#666", fontWeight: 500 }}>Current Status:</span>
        <span style={{
          padding: "5px 16px", borderRadius: "6px",
          fontSize: "13px", fontWeight: 700,
          ...getStatusStyle(cycle.status),
        }}>
          {cycle.status || "-"}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px", flexWrap: "wrap" }}>

          {/* pending_review → Approve + Reject */}
          {status === "pending_review" && (
            <>
              <button
                onClick={() => { setApproveNote(""); setShowApproveModal(true); }}
                style={{
                  padding: "7px 18px", borderRadius: "6px", border: "none",
                  background: "#28a745", color: "#fff", fontWeight: 600,
                  cursor: "pointer", fontSize: "13px",
                }}>
                ✅ Approve
              </button>
              <button
                onClick={() => { setRejectReason(""); setShowRejectModal(true); }}
                style={{
                  padding: "7px 18px", borderRadius: "6px", border: "none",
                  background: "#dc3545", color: "#fff", fontWeight: 600,
                  cursor: "pointer", fontSize: "13px",
                }}>
                ❌ Reject
              </button>
            </>
          )}

          {/* approved → Mark as Paid */}
          {status === "approved" && (
            <button
              onClick={() => {
                setPaidForm({ paymentMethod: "NEFT", transactionRef: "", note: "" });
                setShowMarkPaidModal(true);
              }}
              style={{
                padding: "7px 18px", borderRadius: "6px", border: "none",
                background: "#0d6efd", color: "#fff", fontWeight: 600,
                cursor: "pointer", fontSize: "13px",
              }}>
              💳 Mark as Paid
            </button>
          )}

          {/* rejected or failed → Re-initiate Cycle */}
          {(status === "rejected" || status === "failed") && (
            <button
              onClick={() => {
                  setReinitiateForm({
                    fromDate: cycle.cycleStart ? toInputDate(parseDateSafe(cycle.cycleStart)) : today,
                    toDate:   cycle.cycleEnd   ? toInputDate(parseDateSafe(cycle.cycleEnd))   : today,
                  });
                  setShowReinitiateModal(true);
                }}
              style={{
                padding: "7px 18px", borderRadius: "6px", border: "none",
                background: "#6f42c1", color: "#fff", fontWeight: 600,
                cursor: "pointer", fontSize: "13px",
              }}>
              🔄 Re-initiate Cycle
            </button>
          )}

        </div>
      </div>

      {/* ── Trainer Info ─────────────────────────────────────────────────── */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 style={{ fontWeight: 700, color: "#ff7a00", marginBottom: "16px" }}>
          👤 Trainer Information
        </h5>
        <div className="row">
          <div className="col-md-4">
            <InfoRow label="Trainer Name"   value={cycle.trainerName} />
            <InfoRow label="Trainer Email"  value={cycle.trainerEmail} />
            <InfoRow label="Trainer Mobile" value={cycle.trainerMobile} />
          </div>
          <div className="col-md-4">
            <InfoRow label="Recipient Name" value={cycle.recipient_name} />
            <InfoRow label="Account No"     value={cycle.account_no} />
            <InfoRow label="IFSC Code"      value={cycle.ifsc_code} />
          </div>
          <div className="col-md-4">
            <InfoRow label="Account Branch" value={cycle.account_branch} />
            <InfoRow label="Branch Address" value={cycle.branch_address} />
          </div>
        </div>
      </div>

      {/* ── Cycle Details ────────────────────────────────────────────────── */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 style={{ fontWeight: 700, color: "#ff7a00", marginBottom: "16px" }}>
          📅 Cycle Details
        </h5>
        <div className="row">
          <div className="col-md-4">
            <InfoRow label="Cycle Start"    value={fmtDateTime(cycle.cycleStart)} />
            <InfoRow label="Cycle End"      value={fmtDateTime(cycle.cycleEnd)} />
            <InfoRow label="Total Sessions" value={cycle.totalSessions} />
          </div>
          <div className="col-md-4">
            <InfoRow label="Total Earnings" value={cycle.totalEarnings != null ? `₹${cycle.totalEarnings}` : "N/A"} />
            <InfoRow label="Created At"     value={fmtDateTime(cycle.createdAt)} />
            <InfoRow label="Updated At"     value={fmtDateTime(cycle.updatedAt)} />
          </div>
          <div className="col-md-4">
            <InfoRow label="Approved By" value={cycle.approvedBy} />
            <InfoRow label="Approved At" value={fmtDateTime(cycle.approvedAt)} />
            <InfoRow label="Paid At"     value={fmtDateTime(cycle.paidAt)} />
          </div>
        </div>
      </div>

      {/* ── Payment / Payout Details ──────────────────────────────────────── */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 style={{ fontWeight: 700, color: "#ff7a00", marginBottom: "16px" }}>
          💳 Payment Details
        </h5>
        <div className="row">
          <div className="col-md-6">
            <InfoRow label="Razorpay Contact ID"      value={cycle.razorpayContactId} />
            <InfoRow label="Razorpay Fund Account ID" value={cycle.razorpayFundAccountId} />
            <InfoRow label="Razorpay Payout ID"       value={cycle.razorpayPayoutId} />
            <InfoRow label="Razorpay Payout Status"   value={cycle.razorpayPayoutStatus} />
          </div>
          <div className="col-md-6">
            <InfoRow label="Failure Reason" value={cycle.failureReason} />
            <InfoRow label="Rejected At"    value={fmtDateTime(cycle.rejectedAt)} />
          </div>
        </div>
        {cycle.adminNote && (
          <div style={{
            marginTop: "12px", padding: "12px 16px",
            background: "#fff8e1", border: "1px solid #ffd54f", borderRadius: "8px",
          }}>
            <b style={{ color: "#795548" }}>📝 Admin Note:</b>
            <p style={{ margin: "6px 0 0", color: "#333", fontSize: "14px" }}>
              {cycle.adminNote}
            </p>
          </div>
        )}
      </div>

      {/* ── Earnings Records ──────────────────────────────────────────────── */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 style={{ fontWeight: 700, color: "#ff7a00", margin: 0 }}>
            💰 Earnings Records
          </h5>
          <span style={{ fontSize: "14px", color: "#333" }}>
            Total:{" "}
            <strong style={{ color: "#ff7a00" }}>{earnings.length}</strong>{" "}
            record{earnings.length !== 1 ? "s" : ""}
          </span>
        </div>
        {earnings.length > 0 ? (
          <Table
            columns={earningColumns} data={earningTableData}
            currentPage={1} totalPages={1}
            onPageChange={() => {}} isLoading={false}
          />
        ) : (
          <p style={{ color: "#888", fontStyle: "italic" }}>No earnings records found.</p>
        )}
      </div>

    </div>
  );
}

export default PaymentCycleProfile;