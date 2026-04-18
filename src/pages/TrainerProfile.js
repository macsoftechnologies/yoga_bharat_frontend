import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Table from "../components/Table";
import {
  getTrainers,
  getBookings,
  getCertificatesByUser,
  getTrainerEarning,
} from "../services/authService";
import {
  FaFilter, FaFileCsv, FaFileExcel,
} from "react-icons/fa";
import * as XLSX from "xlsx";

import JSZip from "jszip";
import { saveAs } from "file-saver";

function TrainerProfile() {
  const { userId } = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [trainer,      setTrainer]      = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [exporting,    setExporting]    = useState(false);

  const [selectedCertificates, setSelectedCertificates] = useState([]);

  // ── Active Tab ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" | "earnings"

  // ── Modal ──────────────────────────────────────────────────────────────────
  const [modalOpen,  setModalOpen]  = useState(false);
  const [modalImage, setModalImage] = useState("");
  const openImageModal  = (url) => { setModalImage(url); setModalOpen(true); };
  const closeImageModal = ()    => { setModalOpen(false); setModalImage(""); };

  // ── Bookings state ─────────────────────────────────────────────────────────
  const [ordersList,  setOrdersList]  = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  // ── Booking yoga name options ──────────────────────────────────────────────
  const [bookingYogaOptions, setBookingYogaOptions] = useState([]);
  const [bookingLimit,      setBookingLimit]      = useState(10);
  const [bookingTotalCount, setBookingTotalCount] = useState(0);

  // ── Bookings filters ───────────────────────────────────────────────────────
  const [bookingFilters, setBookingFilters] = useState({
    bookingType: "",
    status:      "",
    fromDate:    "",
    toDate:      "",
    yogaName:    "",
  });
  const [appliedBookingFilters, setAppliedBookingFilters] = useState({
    bookingType: "",
    status:      "",
    fromDate:    "",
    toDate:      "",
    yogaName:    "",
  });

  // ── Earnings state ─────────────────────────────────────────────────────────
  const [earnings,           setEarnings]           = useState([]);
  const [earningsPage,       setEarningsPage]       = useState(1);
  const [earningsTotalPages, setEarningsTotalPages] = useState(1);
  const [earningsTotalCount, setEarningsTotalCount] = useState(0);
  const [earningsLimit,      setEarningsLimit]      = useState(10);
  const [earningsLoading,    setEarningsLoading]    = useState(false);
  const [earningsTotal,      setEarningsTotal]      = useState(0);
  const [appliedEarningFilters, setAppliedEarningFilters] = useState({
  yogaType:    "",
  bookingType: "",
  fromDate:    "",
  toDate:      "",
});

  // ── Earnings filters ───────────────────────────────────────────────────────
  const [earningFilters, setEarningFilters] = useState({
    yogaType:    "",
    bookingType: "",
    fromDate:    "",
    toDate:      "",
  });

  // ── yoga type options (earnings tab) ──────────────────────────────────────
  const [yogaTypeOptions, setYogaTypeOptions] = useState([]);

  // ─── Fetch Trainer Info ────────────────────────────────────────────────────
  useEffect(() => {
  if (!userId) return;
  const fetchTrainer = async () => {
    setLoading(true);
    try {
      // ✅ CASE 1: came from Trainer list — data passed via navigate state
      if (location.state?.trainer) {
        setTrainer(location.state.trainer);
        // still fetch certificates
        const certRes = await getCertificatesByUser(userId);
        setCertificates(certRes?.data || []);
        setLoading(false);
        return;
      }

      // ✅ CASE 2: page refresh — loop pages with limit:10 only
      let found = null;
      for (let page = 1; page <= 50; page++) {
        const res = await getTrainers(page, 10);
        const arr = Array.isArray(res.data) ? res.data
                  : Array.isArray(res)      ? res : [];

        found = arr.find((t) => t.userId === userId);
        if (found) break;
        if (arr.length < 10) break; // no more pages
      }
      setTrainer(found || null);

      if (found?.userId) {
        const certRes = await getCertificatesByUser(found.userId);
        setCertificates(certRes?.data || []);
      }
    } catch (error) {
      console.error("Fetch Trainer Error:", error);
      setTrainer(null);
    } finally {
      setLoading(false);
    }
  };
  fetchTrainer();
  }, [userId]); // eslint-disable-line

  // ─── Fetch yoga name options for Bookings tab filter ──────────────────────
  useEffect(() => {
    if (!trainer?.userId) return;
    const fetchBookingYogaNames = async () => {
      try {
        const res = await getBookings(1, 10, {
          accepted_trainerId: trainer.userId,
        });
        if (res && Array.isArray(res.data)) {
          const names = res.data
            .map((item) =>
              Array.isArray(item.yogaId)
                ? item.yogaId?.[0]?.yoga_name
                : item.yogaId?.yoga_name
            )
            .filter(Boolean);
          setBookingYogaOptions([...new Set(names)]);
        }
      } catch (err) {
        console.error("Error fetching booking yoga names:", err);
      }
    };
    fetchBookingYogaNames();
  }, [trainer]);

  // ─── Fetch Bookings ────────────────────────────────────────────────────────
  useEffect(() => {
  if (!trainer?.userId) return;
  const fetchBookings = async () => {
    try {
      const filters = {};
      if (appliedBookingFilters.bookingType) filters.bookingType = appliedBookingFilters.bookingType;
      if (appliedBookingFilters.status)      filters.status      = appliedBookingFilters.status;
      if (appliedBookingFilters.fromDate)    filters.fromDate    = appliedBookingFilters.fromDate;
      if (appliedBookingFilters.toDate)      filters.toDate      = appliedBookingFilters.toDate;
      if (appliedBookingFilters.yogaName)    filters.yogaName    = appliedBookingFilters.yogaName;

      const res = await getBookings(currentPage, bookingLimit, { 
        accepted_trainerId: trainer.userId,
        ...filters,
      });
      if (res && Array.isArray(res.data)) {
        setOrdersList(res.data);
        setTotalPages(res.totalPages || 1);
        setBookingTotalCount(res.totalCount || 0); 
      } else {
        setOrdersList([]);
        setTotalPages(1);
        setBookingTotalCount(0);
      }
    } catch (error) {
      console.error("Fetch Bookings Error:", error);
    }
  };
  fetchBookings();
}, [currentPage, trainer, appliedBookingFilters, bookingLimit]);

  // ─── Fetch Earnings ────────────────────────────────────────────────────────
  const fetchEarnings = useCallback(
    async (page = 1, overrideFilters, overrideLimit) => {
      if (!trainer?.userId) return;
      try {
        setEarningsLoading(true);

        const activeFilters = overrideFilters !== undefined ? overrideFilters : earningFilters;
        const activeLimit   = overrideLimit   !== undefined ? overrideLimit   : earningsLimit;

        const payload = {
          trainerId:   trainer.userId,
          yogaType:    activeFilters.yogaType    || "",
          bookingType: activeFilters.bookingType || "",
          fromDate:    activeFilters.fromDate    || "",
          toDate:      activeFilters.toDate      || "",
        };

        const res = await getTrainerEarning(trainer.userId, page, activeLimit, payload);

        let data = [];
        if (Array.isArray(res))                  data = res;
        else if (res && Array.isArray(res.data)) data = res.data;

        let filteredData = [...data];

        if (activeFilters.bookingType) {
          filteredData = filteredData.filter(
            (item) => item.bookingDetails?.bookingType === activeFilters.bookingType
          );
        }
        if (activeFilters.yogaType) {
          filteredData = filteredData.filter(
            (item) => item.yogaDetails?.yoga_name === activeFilters.yogaType
          );
        }
        if (activeFilters.fromDate) {
          filteredData = filteredData.filter(
            (item) => new Date(item.date) >= new Date(activeFilters.fromDate)
          );
        }
        if (activeFilters.toDate) {
          filteredData = filteredData.filter(
            (item) => new Date(item.date) <= new Date(activeFilters.toDate)
          );
        }

        setEarnings(filteredData);
        setEarningsTotalPages(1);
        setEarningsTotalCount(filteredData.length);
        setEarningsTotal(filteredData.reduce((s, i) => s + (i.earned_amount || 0), 0));

        const types = [
          ...new Set(data.map((i) => i.yogaDetails?.yoga_name).filter(Boolean)),
        ];
        setYogaTypeOptions(types);
      } catch (error) {
        console.error("Fetch Earnings Error:", error);
        setEarnings([]);
      } finally {
        setEarningsLoading(false);
      }
    },
    [trainer, earningFilters, earningsLimit]
  );

  const fetchEarningsRef = useRef();
  fetchEarningsRef.current = fetchEarnings;

  useEffect(() => {
    if (trainer?.userId) fetchEarningsRef.current(earningsPage);
  }, [earningsPage, trainer]);

  // ── Booking filter handlers ────────────────────────────────────────────────
  const handleBookingFilterChange = (key, value) =>
    setBookingFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyBookingFilters = () => {
    setCurrentPage(1);
    setAppliedBookingFilters({ ...bookingFilters });
  };

  const handleClearBookingFilters = () => {
    const cleared = { bookingType: "", status: "", fromDate: "", toDate: "", yogaName: "" };
    setBookingFilters(cleared);
    setAppliedBookingFilters(cleared);
    setCurrentPage(1);
  };

  // ── Earnings filter handlers ───────────────────────────────────────────────
  const handleEarningFilterChange = (key, value) =>
    setEarningFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyEarningFilters = () => {
    setEarningsPage(1);
    setAppliedEarningFilters({ ...earningFilters }); 
    fetchEarnings(1, earningFilters, earningsLimit);
  };

  const handleClearEarningFilters = () => {
    const cleared = { yogaType: "", bookingType: "", fromDate: "", toDate: "" };
    setEarningFilters(cleared);
    setAppliedEarningFilters(cleared);
    setEarningsPage(1);
    fetchEarnings(1, cleared, earningsLimit);
  };

  const handleEarningsLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setEarningsLimit(newLimit);
    setEarningsPage(1);
    fetchEarnings(1, earningFilters, newLimit);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ── BOOKINGS EXPORT ───────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  const fetchAllBookingsForExport = async () => {
    if (!trainer?.userId) return [];
    try {
      const filters = {};
      if (appliedBookingFilters.bookingType) filters.bookingType = appliedBookingFilters.bookingType;
      if (appliedBookingFilters.status)      filters.status      = appliedBookingFilters.status;
      if (appliedBookingFilters.fromDate)    filters.fromDate    = appliedBookingFilters.fromDate;
      if (appliedBookingFilters.toDate)      filters.toDate      = appliedBookingFilters.toDate;
      if (appliedBookingFilters.yogaName)    filters.yogaName    = appliedBookingFilters.yogaName;
            filters.isExport                                      = true;

      const res = await getBookings(1, 10, {accepted_trainerId: trainer.userId,
        ...filters,
      });
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error("Bookings export fetch error:", err);
      return [];
    }
  };




  const buildBookingExportRows = (data) =>
    data.map((item, index) => ({
      "S.No":           index + 1,
      "Client Name":    item.clientId?.name              || "-",
      "Booking Type":   item.bookingType                 || "-",
      "Yoga Name":      (Array.isArray(item.yogaId)
        ? item.yogaId?.[0]?.yoga_name
        : item.yogaId?.yoga_name)                        || "-",
      "Language":       (Array.isArray(item.languageId)
        ? item.languageId?.[0]?.language_name
        : item.languageId?.language_name)                || "-",
      "Client Price":   (Array.isArray(item.yogaId)
        ? item.yogaId?.[0]?.trainer_price
        : item.yogaId?.trainer_price)
          ? `₹${Array.isArray(item.yogaId) ? item.yogaId[0].trainer_price : item.yogaId.trainer_price}`
          : "-",
      "Scheduled Date": item.scheduledDate
                          ? new Date(item.scheduledDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "-",
      "Time":           item.time   || "-",
      "Status":         item.status || "-",
    }));

  const exportBookingsCSV = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllBookingsForExport();
      const rows    = buildBookingExportRows(allData);
      if (!rows.length) return alert("No booking data to export.");

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
      link.download = `trainer_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Bookings CSV export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportBookingsExcel = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllBookingsForExport();
      const rows    = buildBookingExportRows(allData);
      if (!rows.length) return alert("No booking data to export.");

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook  = XLSX.utils.book_new();
      const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key]).length)) + 2,
      }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
      XLSX.writeFile(workbook, `trainer_bookings_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Bookings Excel export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ── EARNINGS EXPORT ───────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // const fetchAllEarningsForExport = async () => {
  //   if (!trainer?.userId) return [];
  //   try {
  //     const payload = {
  //       trainerId:   trainer.userId,
  //       yogaType:    earningFilters.yogaType    || "",
  //       bookingType: earningFilters.bookingType || "",
  //       fromDate:    earningFilters.fromDate    || "",
  //       toDate:      earningFilters.toDate      || "",
  //     };
  //     const res = await getTrainerEarning(trainer.userId, payload);
  //     if (Array.isArray(res))        return res;
  //     if (Array.isArray(res?.data))  return res.data;
  //     return [];
  //   } catch (err) {
  //     console.error("Export fetch error:", err);
  //     return [];
  //   }
  // };

  const fetchAllEarningsForExport = async () => {
  if (!trainer?.userId) return [];
  try {
    const payload = {
      trainerId:   trainer.userId,
      yogaType:    appliedEarningFilters.yogaType    || "",
      bookingType: appliedEarningFilters.bookingType || "",
      fromDate:    appliedEarningFilters.fromDate    || "",
      toDate:      appliedEarningFilters.toDate      || "",
    };

    const res = await getTrainerEarning(trainer.userId, payload);

    let data = [];
    if (Array.isArray(res))                  data = res;
    else if (res && Array.isArray(res.data)) data = res.data;

    // ✅ Apply same client-side filters using appliedEarningFilters
    let filteredData = [...data];

    if (appliedEarningFilters.bookingType) {
      filteredData = filteredData.filter(
        (item) => item.bookingDetails?.bookingType === appliedEarningFilters.bookingType
      );
    }
    if (appliedEarningFilters.yogaType) {
      filteredData = filteredData.filter(
        (item) => item.yogaDetails?.yoga_name === appliedEarningFilters.yogaType
      );
    }
    if (appliedEarningFilters.fromDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.date) >= new Date(appliedEarningFilters.fromDate)
      );
    }
    if (appliedEarningFilters.toDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.date) <= new Date(appliedEarningFilters.toDate)
      );
    }

    return filteredData;
  } catch (err) {
    console.error("Export fetch error:", err);
    return [];
  }
};

  // ✅ FIXED: now reads from yogaDetails / bookingDetails (same as table display)
  const buildEarningExportRows = (data) =>
    data.map((item, index) => ({
      "S.No":          index + 1,
      "Yoga Type":     item.yogaDetails?.yoga_name     || item.yogaId?.[0]?.yoga_name || "-",
      "Booking Type":  item.bookingDetails?.bookingType || item.bookingType            || "-",
      "Date":          item.date
                    ? new Date(item.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-",
      "Trainer Price": item.yogaDetails?.trainer_price
                         ? `₹${item.yogaDetails.trainer_price}`
                         : item.yogaId?.[0]?.trainer_price
                           ? `₹${item.yogaId[0].trainer_price}` : "-",
      "Earned Amount": item.earned_amount ? `₹${item.earned_amount}` : "₹0",
    }));

  const exportCSV = async () => {
    try {
      setExporting(true);
      const allData = await fetchAllEarningsForExport();
      const rows    = buildEarningExportRows(allData);
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
      link.download = `trainer_earnings_${new Date().toISOString().slice(0, 10)}.csv`;
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
      const allData = await fetchAllEarningsForExport();
      const rows    = buildEarningExportRows(allData);
      if (!rows.length) return alert("No data to export.");

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook  = XLSX.utils.book_new();
      const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key]).length)) + 2,
      }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Earnings");
      XLSX.writeFile(workbook, `trainer_earnings_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  
  // const handleSelectCertificate = (id) => {
  // setSelectedCertificates((prev) =>
  //   prev.includes(id)
  //     ? prev.filter((item) => item !== id)
  //     : [...prev, id]
  // );
  // };

const downloadSingleCertificate = async (cert) => {
  try {
    const url = getImageUrl(cert.certificate);

    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const fileName = cert.headline
      ? cert.headline.replace(/\s+/g, "_")
      : "certificate";

    link.download = `${fileName}.jpg`;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Single download error:", error);
    alert("Download failed");
  }
};


const downloadAllCertificates = async () => {
  if (!selectedCertificates.length) {
    alert("Please select at least one certificate");
    return;
  }

  try {
    const zip = new JSZip();

    const selectedItems = certificates.filter((c) =>
      selectedCertificates.includes(c._id)
    );

    for (let i = 0; i < selectedItems.length; i++) {
      const cert = selectedItems[i];
      const url = getImageUrl(cert.certificate);

      const response = await fetch(url);
      const blob = await response.blob();

      // Use headline if available
      const fileName = cert.headline
        ? cert.headline.replace(/\s+/g, "_")
        : `certificate_${i + 1}`;

      zip.file(`${fileName}.jpg`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "selected_certificates.zip");

  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download certificates");
  }
};

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
      <div className="table-spinner" />
    </div>
  );
}

if (!trainer) {
  return (
    <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
      <h4>Trainer not found</h4>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/trainer")}>
        ← Back to Trainer List
      </button>
    </div>
  );
}

  const getImageUrl = (filename) => {
    if (!filename) return "";
    return `${process.env.REACT_APP_API_BASE_URL}/${filename}`;
  };

  // ── Bookings columns ───────────────────────────────────────────────────────
  const columns = [
    { header: "S.No",           accessor: "srNo" },
    { header: "Client Name",    accessor: "clientName" },
    { header: "Booking Type",   accessor: "bookingType" },
    { header: "Yoga Name",      accessor: "yogaName" },
    { header: "Language",       accessor: "language" },
    { header: "Client Price",   accessor: "clientPrice" },
    { header: "Scheduled Date", accessor: "scheduledDate" },
    { header: "Time",           accessor: "time" },
    { header: "Status",         accessor: "status" },
  ];

  const tableData = ordersList.map((item, index) => ({
    srNo:          (currentPage - 1) * 10 + index + 1,
    clientName:    item.clientId?.name || "-",
    bookingType:   item.bookingType || "-",
    yogaName: (Array.isArray(item.yogaId)
      ? item.yogaId?.[0]?.yoga_name
      : item.yogaId?.yoga_name) || "-",
    language: (Array.isArray(item.languageId)
      ? item.languageId?.[0]?.language_name
      : item.languageId?.language_name) || "-",
    clientPrice: `₹${(Array.isArray(item.yogaId)
      ? item.yogaId?.[0]?.trainer_price
      : item.yogaId?.trainer_price) || 0}`,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-",
    time:   item.time   || "-",
    status: item.status || "-",
  }));

  // ── Earnings columns ───────────────────────────────────────────────────────
  const earningColumns = [
    { header: "S.No",          accessor: "srNo" },
    { header: "Yoga Type",     accessor: "yogaType" },
    { header: "Booking Type",  accessor: "bookingType" },
    { header: "Scheduled Date", accessor: "date" },
    { header: "Trainer Price", accessor: "trainer_price" },
    { header: "Earned Amount", accessor: "earned_amount" },
  ];

  const earningTableData = earnings.map((item, index) => ({
    srNo:          (earningsPage - 1) * earningsLimit + index + 1,
    yogaType:      item.yogaDetails?.yoga_name || "-",
    bookingType:   item.bookingDetails?.bookingType || "-",
    date: item.date
      ? new Date(item.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-",
    trainer_price: item.yogaDetails?.trainer_price ? `₹${item.yogaDetails.trainer_price}` : "-",
    earned_amount: item.earned_amount ? `₹${item.earned_amount}` : "₹0",
  }));

  // ── Tab styles ─────────────────────────────────────────────────────────────
  const tabStyle = (tab) => ({
    padding: "10px 28px",
    border: "none",
    borderBottom: activeTab === tab ? "3px solid #ff7a00" : "3px solid transparent",
    background: "transparent",
    fontWeight: activeTab === tab ? 700 : 500,
    color: activeTab === tab ? "#ff7a00" : "#555",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.2s",
  });

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
    <div className="container mt-3">

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

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>TRAINER PROFILE</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/trainer")}>
          ← Back
        </button>
      </div>

      {/* ── Trainer Info ── */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="row align-items-start">
          <div className="col-md-4 text-center mb-3">
            <img
              src={getImageUrl(trainer.profile_pic)}
              alt="Trainer"
              className="img-fluid"
              style={{ borderRadius: "12px", maxWidth: "150px" }}
            />
          </div>
          <div className="col-md-4 mb-3">
            <p><b>Name:</b>   {trainer.name}</p>
            <p><b>Email:</b>  {trainer.email}</p>
            <p><b>Mobile:</b> {trainer.mobileNumber}</p>
          </div>
          <div className="col-md-4 mb-3">
            <p><b>Gender:</b> {trainer.gender}</p>
            <p><b>Age:</b>    {trainer.age}</p>
            <p>
              <b>eKYC Status:</b>{" "}
              <span style={{ color: "green", fontWeight: 600 }}>{trainer.ekyc_status}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Certificates ── */}
      <div className="card p-3 shadow-sm mb-4">
        {/* Header with button */}
        <div className="d-flex justify-content-between align-items-center">

          <h4 className="mb-0">Certificates</h4>

          <div className="d-flex align-items-center gap-3">

            <input
              type="checkbox"
              checked={
                selectedCertificates.length === certificates.length &&
                certificates.length > 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCertificates(certificates.map(c => c._id));
                } else {
                  setSelectedCertificates([]);
                }
              }}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                transform: "scale(1.4)",
                border: "2px solid orange",
                borderRadius: "4px",
                position: "relative"
              }}
            />

            <button
              onClick={downloadAllCertificates}
              className="btn"
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                fontWeight: "600",
                borderRadius: "8px",
                padding: "6px 16px",
                border: "none"
              }}
              disabled={!selectedCertificates.length}
            >
              ⬇ Download ({selectedCertificates.length})
            </button>

          </div>

        </div>

        {/* Certificates List */}
        <div className="col-12 mt-3">
          {certificates.length > 0 ? (
            <div className="row">
              {certificates.map((c) => (
                <div className="col-md-4 mb-3" key={c._id}>
                  
                  {/* ✅ ADDED WRAPPER */}
                  <div style={{ position: "relative" }}>

                    {/* DOWNLOAD ICON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent modal open
                        downloadSingleCertificate(c);
                      }}
                      style={{
                        position: "absolute",
                        top: "13px",
                        right: "10px",
                        background: "#28a745",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        color: "#fff",
                        cursor: "pointer",
                        zIndex: 10
                      }}
                    >
                      ⬇
                    </button>

                    {/* YOUR ORIGINAL CARD (UNCHANGED) */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "14px 16px",
                        background: "rgb(255 172 45)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        cursor: "pointer",
                      }}
                      onClick={() => openImageModal(getImageUrl(c.certificate))}
                    >
                      <img
                        src={getImageUrl(c.certificate)}
                        alt="Certificate"
                        style={{
                          width: "120px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          background: "#fff",
                        }}
                      />

                      <div>
                        <h6 style={{ margin: 0, fontWeight: "700" }}>
                          {c.headline || "Yoga Certificate"}
                        </h6>
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: "13px",
                            color: "#000",
                          }}
                        >
                          {c.description || "No description available"}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>

      {/* ── Payment Details ── */}
      <div className="card p-3 shadow-sm mb-4">
        <h4>Payment Details</h4>
        <div className="row mt-3">
          <div className="col-md-6">
            <p><b>Recipient:</b>      {trainer.recipient_name || "N/A"}</p>
            <p><b>Account No:</b>     {trainer.account_no     || "N/A"}</p>
            <p><b>Account Branch:</b> {trainer.account_branch || "N/A"}</p>
            <p><b>Branch Address:</b> {trainer.branch_address || "N/A"}</p>
            <p><b>IFSC Code:</b>      {trainer.ifsc_code      || "N/A"}</p>
          </div>
          <div className="col-md-6">
            <h4>Yoga Video</h4>
            {trainer.yoga_video ? (
              <video
                src={getImageUrl(trainer.yoga_video)}
                width="100%" height="250" controls playsInline
                style={{ borderRadius: "12px", marginTop: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Professional Details + Yoga Video ── */}
    <div className="card p-3 shadow-sm mb-4">
      <h4 className="mb-3">Professional Details</h4>

      <div className="row">
        {trainer.professional_details?.length > 0 ? (
          trainer.professional_details.map((item) => (
            <div key={item._id} className="col-md-3 mb-3">
              <div
                className="p-3 text-white"
                style={{
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  borderRadius: "10px",
                  height: "100px"
                }}
              >
                <div style={{ fontSize: "13px",marginBottom: "15px" }}>
                  <b>Type :</b> {item.yoga_name}
                </div>

                <div style={{ fontSize: "15px", fontWeight: "600" }}>
                  <b>Price :</b> ₹{item.trainer_price}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">N/A</p>
        )}
      </div>
    </div>

      {/* ── Journey Images ── */}
      <div className="card p-3 shadow-sm mb-4">
        <h4>Journey Images</h4>
        <div className="row">
          {trainer.journey_images?.map((img, index) => (
            <div className="col-md-4 mb-3 text-center" key={index}>
              <img
                src={getImageUrl(img)}
                alt="Journey"
                style={{
                  width: "200px", height: "150px", objectFit: "cover",
                  borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => openImageModal(getImageUrl(img))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ── TABS: Bookings | Earnings
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="card shadow-sm mb-4" style={{ overflow: "hidden" }}>

        {/* Tab Header */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #e5e7eb",
          background: "#fafafa",
          paddingLeft: "16px",
        }}>
          <button style={tabStyle("bookings")} onClick={() => setActiveTab("bookings")}>
            📋 Trainer Bookings
          </button>
          <button style={tabStyle("earnings")} onClick={() => setActiveTab("earnings")}>
            💰 Trainer Earnings
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TAB: Bookings
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "bookings" && (
          <div className="p-3">

            {/* Booking Filters */}
            <div className="card p-3 mb-3">
              <h5 className="mb-3">Filters</h5>
              <div className="row">

                {/* Booking Type */}
                <div className="col-md-4">
                  <label>Booking Type</label>
                  <select
                    className="form-select"
                    value={bookingFilters.bookingType}
                    onChange={(e) => handleBookingFilterChange("bookingType", e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="instant">Instant</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="package">Package</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-4">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={bookingFilters.status}
                    onChange={(e) => handleBookingFilterChange("status", e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="ongoing" style={{ background: "#F3E8FF", color: "#6B21A8", fontWeight: "600" }}>🟣 On Going</option>
                    <option value="accepted">Accepted</option>
                    <option value="opened">Opened</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* From Date */}
                <div className="col-md-4">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingFilters.fromDate}
                    onChange={(e) => handleBookingFilterChange("fromDate", e.target.value)}
                  />
                </div>

                {/* To Date */}
                <div className="col-md-4 mt-3">
                  <label>To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingFilters.toDate}
                    onChange={(e) => handleBookingFilterChange("toDate", e.target.value)}
                  />
                </div>

                {/* ── Yoga Name filter — populated from API ── */}
                <div className="col-md-4 mt-3">
                  <label>Yoga Name</label>
                  <select
                    className="form-select"
                    value={bookingFilters.yogaName}
                    onChange={(e) => handleBookingFilterChange("yogaName", e.target.value)}
                  >
                    <option value="">All</option>
                    {bookingYogaOptions.map((name, i) => (
                      <option key={i} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Bookings Action Buttons */}
              <div className="text-end mt-3 d-flex justify-content-end gap-3 flex-wrap">
                <button onClick={handleApplyBookingFilters} style={btnFilter}>
                  <FaFilter />
                  <span>Filter</span>
                </button>

                <button onClick={handleClearBookingFilters} style={btnClear}>
                  Clear
                </button>

                {/* Bookings CSV */}
                <button
                  onClick={exportBookingsCSV}
                  disabled={exporting}
                  title="Export all filtered bookings as CSV"
                  style={btnCSV(exporting)}
                >
                  CSV <FaFileCsv style={{ fontSize: "16px" }} />
                </button>

                {/* Bookings Excel */}
                <button
                  onClick={exportBookingsExcel}
                  disabled={exporting}
                  title="Export all filtered bookings as Excel"
                  style={btnExcel(exporting)}
                >
                  Excel <FaFileExcel style={{ fontSize: "16px" }} />
                </button>
              </div>
            </div>


            {/* Records per page + count — BOOKINGS TAB ✅ */}
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
                  value={bookingLimit}                      
                  onChange={(e) => {
                    setBookingLimit(Number(e.target.value));   
                    setCurrentPage(1);
                  }}
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
                {bookingTotalCount > ordersList.length
                  ? <> of <strong>{bookingTotalCount}</strong></>            
                  : null}{" "}
                records
              </span>
            </div>
            

            {/* Bookings Table */}
            <Table
              columns={columns}
              data={tableData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={loading}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: Earnings
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "earnings" && (
          <div className="p-3">

            {/* Total Earned badge */}
            {earningsTotal > 0 && (
              <div style={{
                display: "inline-block", marginBottom: "12px",
                background: "linear-gradient(135deg, #16a34a, #4ade80)",
                color: "#fff", borderRadius: "8px", padding: "6px 18px",
                fontWeight: 700, fontSize: "15px",
              }}>
                Total Earned: ₹{earningsTotal}
              </div>
            )}

            {/* Earnings Filter Card */}
            <div className="card p-3 mb-3">
              <h5 className="mb-3">Filters</h5>
              <div className="row">

                {/* Yoga Type */}
                <div className="col-md-4">
                  <label>Yoga Type</label>
                  <select
                    className="form-select"
                    value={earningFilters.yogaType}
                    onChange={(e) => handleEarningFilterChange("yogaType", e.target.value)}
                  >
                    <option value="">All</option>
                    {yogaTypeOptions.map((name, i) => (
                      <option key={i} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* Booking Type */}
                <div className="col-md-4">
                  <label>Booking Type</label>
                  <select
                    className="form-select"
                    value={earningFilters.bookingType}
                    onChange={(e) => handleEarningFilterChange("bookingType", e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="instant">Instant</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="package">Package</option>
                  </select>
                </div>

                {/* From Date */}
                <div className="col-md-4">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={earningFilters.fromDate}
                    onChange={(e) => handleEarningFilterChange("fromDate", e.target.value)}
                  />
                </div>

                {/* To Date */}
                <div className="col-md-4 mt-3">
                  <label>To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={earningFilters.toDate}
                    onChange={(e) => handleEarningFilterChange("toDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Earnings Action Buttons */}
              <div className="text-end mt-3 d-flex justify-content-end gap-3 flex-wrap">
                <button onClick={handleApplyEarningFilters} style={btnFilter}>
                  <FaFilter />
                  <span>Filter</span>
                </button>

                <button onClick={handleClearEarningFilters} style={btnClear}>
                  Clear
                </button>

                {/* Earnings CSV */}
                <button
                  onClick={exportCSV}
                  disabled={exporting}
                  title="Export all filtered earnings as CSV"
                  style={btnCSV(exporting)}
                >
                  CSV <FaFileCsv style={{ fontSize: "16px" }} />
                </button>

                {/* Earnings Excel */}
                <button
                  onClick={exportExcel}
                  disabled={exporting}
                  title="Export all filtered earnings as Excel"
                  style={btnExcel(exporting)}
                >
                  Excel <FaFileExcel style={{ fontSize: "16px" }} />
                </button>
              </div>
            </div>

            {/* Records per page + count */}
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
                  value={earningsLimit}
                  onChange={handleEarningsLimitChange}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <span style={{ fontSize: "16px", color: "#000" }}>
                Showing{" "}
                <strong style={{ color: "#ff7a00" }}>{earnings.length}</strong>
                {earningsTotalCount > earnings.length
                  ? <> of <strong>{earningsTotalCount}</strong></>
                  : null}{" "}
                records
              </span>
            </div>

            <Table
              columns={earningColumns}
              data={earningTableData}
              currentPage={earningsPage}
              totalPages={earningsTotalPages}
              onPageChange={setEarningsPage}
              isLoading={earningsLoading}
            />
          </div>
        )}
      </div>

      {/* ── Full Image Modal ── */}
      {modalOpen && (
        <div
          onClick={closeImageModal}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 9999, cursor: "pointer",
          }}
        >
          <img
            src={modalImage}
            alt="Full View"
            style={{
              maxWidth: "90%", maxHeight: "90%",
              borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TrainerProfile;