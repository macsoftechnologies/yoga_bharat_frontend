import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Table from "../components/Table";
import {
  getTrainers,
  getBookings,
  getCertificatesByUser,
  getTrainerEarning,
  getRatings, 
} from "../services/authService";
import {
  FaFilter, FaFileCsv, FaFileExcel,
} from "react-icons/fa";
import * as XLSX from "xlsx";

import JSZip from "jszip";
import { saveAs } from "file-saver";

// ── Helper: detect file type by extension ─────────────────────────────────────
const getFileType = (filePath) => {
  if (!filePath) return "unknown";
  // strip query strings, get extension
  const ext = filePath.split("?")[0].split(".").pop().toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp", "gif", "bmp"].includes(ext)) return "image";
  return "unknown";
};

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
  const [activeTab, setActiveTab] = useState("bookings");

  // ── Modal ──────────────────────────────────────────────────────────────────
  const [modalOpen,  setModalOpen]  = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalType,  setModalType]  = useState("image"); // "image" | "pdf"

  const openImageModal = (url) => {
    setModalImage(url);
    setModalType(getFileType(url));
    setModalOpen(true);
  };
  const closeImageModal = () => { setModalOpen(false); setModalImage(""); setModalType("image"); };

  // ── Bookings state ─────────────────────────────────────────────────────────
  const [ordersList,  setOrdersList]  = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

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

  const [earningFilters, setEarningFilters] = useState({
    yogaType:    "",
    bookingType: "",
    fromDate:    "",
    toDate:      "",
  });

  const [yogaTypeOptions, setYogaTypeOptions] = useState([]);

  // ── Ratings state ──────────────────────────────────────────────────────────
  const [ratings,           setRatings]           = useState([]);
  const [ratingsPage,       setRatingsPage]       = useState(1);
  const [ratingsTotalPages, setRatingsTotalPages] = useState(1);
  const [ratingsTotalCount, setRatingsTotalCount] = useState(0);
  const [ratingsLoading,    setRatingsLoading]    = useState(false);
  const [averageRating,     setAverageRating]     = useState(0);
  const [totalRatings,      setTotalRatings]      = useState(0);
  const [totalReviews,      setTotalReviews]      = useState(0);
  const [ratingsLimit,      setRatingsLimit]      = useState(10);

  // ─── Fetch Trainer Info ────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const fetchTrainer = async () => {
      setLoading(true);
      try {
        if (location.state?.trainer) {
          setTrainer(location.state.trainer);
          const certRes = await getCertificatesByUser(userId);
          setCertificates(certRes?.data || []);
          setLoading(false);
          return;
        }
        let found = null;
        for (let page = 1; page <= 50; page++) {
          const res = await getTrainers(page, 10);
          const arr = Array.isArray(res.data) ? res.data
                    : Array.isArray(res)      ? res : [];
          found = arr.find((t) => t.userId === userId);
          if (found) break;
          if (arr.length < 10) break;
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
        const res = await getBookings(1, 10, { accepted_trainerId: trainer.userId });
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

  // ─── Fetch Ratings ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!trainer?.userId || activeTab !== "ratings") return;
    const fetchRatings = async () => {
      try {
        setRatingsLoading(true);
        const res = await getRatings(ratingsPage, ratingsLimit, { trainerId: trainer.userId });
        if (res && Array.isArray(res.data)) {
          setRatings(res.data);
          setRatingsTotalPages(res.totalPages || 1);
          setRatingsTotalCount(res.totalCount || 0);
          setAverageRating(res.averageRating || 0);
          setTotalRatings(res.totalRatings || 0);
          setTotalReviews(res.totalReviews || 0);
        } else {
          setRatings([]);
        }
      } catch (err) {
        console.error("Fetch Ratings Error:", err);
        setRatings([]);
      } finally {
        setRatingsLoading(false);
      }
    };
    fetchRatings();
  }, [trainer, activeTab, ratingsPage, ratingsLimit]);

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

  // ── Bookings Export ────────────────────────────────────────────────────────
  const fetchAllBookingsForExport = async () => {
    if (!trainer?.userId) return [];
    try {
      const filters = {};
      if (appliedBookingFilters.bookingType) filters.bookingType = appliedBookingFilters.bookingType;
      if (appliedBookingFilters.status)      filters.status      = appliedBookingFilters.status;
      if (appliedBookingFilters.fromDate)    filters.fromDate    = appliedBookingFilters.fromDate;
      if (appliedBookingFilters.toDate)      filters.toDate      = appliedBookingFilters.toDate;
      if (appliedBookingFilters.yogaName)    filters.yogaName    = appliedBookingFilters.yogaName;
      filters.isExport = true;

      const res = await getBookings(1, 10, { accepted_trainerId: trainer.userId, ...filters });
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
      "Client Name":    item.clientId?.name || "-",
      "Booking Type":   item.bookingType    || "-",
      "Yoga Name":      (Array.isArray(item.yogaId) ? item.yogaId?.[0]?.yoga_name : item.yogaId?.yoga_name) || "-",
      "Language":       (Array.isArray(item.languageId) ? item.languageId?.[0]?.language_name : item.languageId?.language_name) || "-",
      "Client Price":   (Array.isArray(item.yogaId) ? item.yogaId?.[0]?.trainer_price : item.yogaId?.trainer_price)
                          ? `₹${Array.isArray(item.yogaId) ? item.yogaId[0].trainer_price : item.yogaId.trainer_price}`
                          : "-",
      "Scheduled Date": item.scheduledDate
                          ? new Date(item.scheduledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
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

  // ── Earnings Export ────────────────────────────────────────────────────────
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

  const buildEarningExportRows = (data) =>
    data.map((item, index) => ({
      "S.No":          index + 1,
      "Yoga Type":     item.yogaDetails?.yoga_name     || item.yogaId?.[0]?.yoga_name || "-",
      "Booking Type":  item.bookingDetails?.bookingType || item.bookingType            || "-",
      "Date":          item.date
                         ? new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
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

  // ── CHANGE 1: Single certificate download — correct extension for PDF ──────
  const downloadSingleCertificate = async (cert) => {
    try {
      const url      = getImageUrl(cert.certificate);
      const fileType = getFileType(cert.certificate);
      const ext      = fileType === "pdf" ? "pdf" : "jpg";

      const response = await fetch(url);
      const blob     = await response.blob();

      const link     = document.createElement("a");
      link.href      = URL.createObjectURL(blob);
      const fileName = cert.headline
        ? cert.headline.replace(/\s+/g, "_")
        : "certificate";
      link.download  = `${fileName}.${ext}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Single download error:", error);
      alert("Download failed");
    }
  };

  // ── CHANGE 2: Download all — correct extension per file ───────────────────
  const downloadAllCertificates = async () => {
  if (!selectedCertificates.length) {
    alert("Please select at least one certificate");
    return;
  }
  try {
    const zip = new JSZip();

    const selectedItems = certificates.filter((c, i) =>
      selectedCertificates.includes(c._id || `cert-${i}`)
    );

    // Track name counts to avoid overwriting duplicates
    const nameCount = {};

    for (let i = 0; i < selectedItems.length; i++) {
      const cert = selectedItems[i];
      const url = getImageUrl(cert.certificate);
      const fileType = getFileType(cert.certificate);
      const ext = fileType === "pdf" ? "pdf" : "jpg";

      const response = await fetch(url);
      const blob = await response.blob();

      // Build unique filename using index to guarantee uniqueness
      const baseName = cert.headline
        ? cert.headline.replace(/\s+/g, "_")
        : `certificate`;

      // Always append index so duplicates never clash
      const fileName = `${baseName}_${i + 1}.${ext}`;

      zip.file(fileName, blob);
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

  const renderStars = (rating) => {
    const num = parseFloat(rating) || 0;
    const fullStars = Math.floor(num);
    const hasHalf   = num % 1 >= 0.5;
    return (
      <span>
        {Array.from({ length: 5 }, (_, i) => {
          if (i < fullStars)              return <span key={i} style={{ color: "#f59e0b", fontSize: "16px" }}>★</span>;
          if (i === fullStars && hasHalf) return <span key={i} style={{ color: "#f59e0b", fontSize: "16px" }}>½</span>;
          return <span key={i} style={{ color: "#d1d5db", fontSize: "16px" }}>★</span>;
        })}
        <span style={{ marginLeft: "6px", fontWeight: 700, color: "#f59e0b" }}>{num.toFixed(1)}</span>
      </span>
    );
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
    srNo:         (currentPage - 1) * 10 + index + 1,
    clientName:   item.clientId?.name || "-",
    bookingType:  item.bookingType    || "-",
    yogaName:     (Array.isArray(item.yogaId) ? item.yogaId?.[0]?.yoga_name : item.yogaId?.yoga_name) || "-",
    language:     (Array.isArray(item.languageId) ? item.languageId?.[0]?.language_name : item.languageId?.language_name) || "-",
    clientPrice:  `₹${(Array.isArray(item.yogaId) ? item.yogaId?.[0]?.trainer_price : item.yogaId?.trainer_price) || 0}`,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "-",
    time:   item.time   || "-",
    status: item.status || "-",
  }));

  // ── Earnings columns ───────────────────────────────────────────────────────
  const earningColumns = [
    { header: "S.No",           accessor: "srNo" },
    { header: "Yoga Type",      accessor: "yogaType" },
    { header: "Booking Type",   accessor: "bookingType" },
    { header: "Scheduled Date", accessor: "date" },
    { header: "Trainer Price",  accessor: "trainer_price" },
    { header: "Earned Amount",  accessor: "earned_amount" },
  ];

  const earningTableData = earnings.map((item, index) => ({
    srNo:          (earningsPage - 1) * earningsLimit + index + 1,
    yogaType:      item.yogaDetails?.yoga_name           || "-",
    bookingType:   item.bookingDetails?.bookingType      || "-",
    date:          item.date
      ? new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "-",
    trainer_price: item.yogaDetails?.trainer_price ? `₹${item.yogaDetails.trainer_price}` : "-",
    earned_amount: item.earned_amount               ? `₹${item.earned_amount}` : "₹0",
  }));

  // ── Tab styles ─────────────────────────────────────────────────────────────
  const tabStyle = (tab) => ({
    padding: "10px 28px", border: "none",
    borderBottom: activeTab === tab ? "3px solid #ff7a00" : "3px solid transparent",
    background: "transparent",
    fontWeight: activeTab === tab ? 700 : 500,
    color: activeTab === tab ? "#ff7a00" : "#555",
    fontSize: "15px", cursor: "pointer", transition: "all 0.2s",
  });

  const btnFilter = {
    background: "linear-gradient(135deg, #000000, #fcd34d)",
    color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px",
    display: "flex", alignItems: "center", gap: "6px", cursor: "pointer",
  };
  const btnClear = {
    background: "#7d6c6c", color: "#fff",
    border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer",
  };
  const btnCSV = (disabled) => ({
    background: disabled ? "#aaa" : "linear-gradient(135deg, #16a34a, #4ade80)",
    color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px",
    display: "flex", alignItems: "center", gap: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  });
  const btnExcel = (disabled) => ({
    background: disabled ? "#aaa" : "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px",
    display: "flex", alignItems: "center", gap: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" };
    if (s === "rejected") return { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
    return { background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" };
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container mt-3">

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
            <p style={{ margin: 0, fontWeight: 600, color: "#333" }}>Preparing export… please wait</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>TRAINER PROFILE</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/trainer")}>← Back</button>
      </div>

      {/* Trainer Info */}
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
              <span style={{
                ...getStatusStyle(trainer.ekyc_status),
                borderRadius: "6px", padding: "2px 10px",
                fontSize: "13px", fontWeight: 500,
                textTransform: "capitalize", whiteSpace: "nowrap",
              }}>
                {trainer.ekyc_status || "-"}
              </span>
            </p>
            {trainer.ekyc_status?.toLowerCase() === "rejected" && (
              <>
                <p>
                  <b>Reject Type:</b>{" "}
                  <span style={{ color: "#dc2626", fontWeight: 500 }}>{trainer.reject_type || "-"}</span>
                </p>
                <p>
                  <b>Reject Reason:</b>{" "}
                  <span style={{ color: "#dc2626" }}>{trainer.reject_reason || "-"}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CHANGE 3 — Certificates card: PDF iframe + image preview + badges
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="card p-3 shadow-sm mb-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Certificates</h4>
          <div className="d-flex align-items-center gap-3">
            <input
              type="checkbox"
              checked={selectedCertificates.length === certificates.length && certificates.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  // Use index-based key to handle duplicates
                  setSelectedCertificates(certificates.map((c, i) => c._id || `cert-${i}`));
                } else {
                  setSelectedCertificates([]);
                }
              }}
              style={{
                width: "18px", height: "18px", cursor: "pointer",
                transform: "scale(1.4)", border: "2px solid orange", borderRadius: "4px",
              }}
            />
            <button
              onClick={downloadAllCertificates}
              className="btn"
              style={{
                backgroundColor: "#28a745", color: "#fff",
                fontWeight: "600", borderRadius: "8px",
                padding: "6px 16px", border: "none",
              }}
              disabled={!selectedCertificates.length}
            >
              ⬇ Download ({selectedCertificates.length})
            </button>
          </div>
        </div>

        {/* Certificate Cards */}
        <div className="col-12 mt-3">
          {certificates.length > 0 ? (
            <div className="row">
              {certificates.map((c) => {
                const fileUrl  = getImageUrl(c.certificate);
                const fileType = getFileType(c.certificate);

                return (
                  <div className="col-md-4 mb-3" key={c._id}>
                    <div style={{ position: "relative" }}>

                      {/* Select checkbox */}
                      {/* <input
                        type="checkbox"
                        checked={selectedCertificates.includes(c._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedCertificates((prev) =>
                            prev.includes(c._id)
                              ? prev.filter((id) => id !== c._id)
                              : [...prev, c._id]
                          );
                        }}
                        style={{
                          position: "absolute", top: "10px", left: "10px",
                          width: "18px", height: "18px", cursor: "pointer", zIndex: 10,
                        }}
                      /> */}

                      {/* Download icon button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadSingleCertificate(c); }}
                        style={{
                          position: "absolute", top: "10px", right: "10px",
                          background: "#28a745", border: "none", borderRadius: "50%",
                          width: "28px", height: "28px", color: "#fff",
                          cursor: "pointer", zIndex: 10, fontSize: "13px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                        title="Download"
                      >
                        ⬇
                      </button>

                      {/* Card */}
                      <div
                        style={{
                          padding: "14px 16px",
                          background: "rgb(255 172 45)",
                          borderRadius: "16px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                          cursor: "pointer",
                        }}
                        onClick={() => openImageModal(fileUrl)}
                      >

                        {/* ── CHANGE: show iframe for PDF, img for image ── */}
                        {fileType === "pdf" ? (
                          <iframe
                            src={fileUrl}
                            title={c.headline || "Certificate PDF"}
                            style={{
                              width: "100%", height: "160px",
                              borderRadius: "10px", border: "1px solid #ccc",
                              background: "#fff", display: "block",
                              marginBottom: "10px", pointerEvents: "none",
                            }}
                          />
                        ) : (
                          <img
                            src={fileUrl}
                            alt="Certificate"
                            style={{
                              width: "100%", height: "160px",
                              objectFit: "cover", borderRadius: "10px",
                              background: "#fff", display: "block",
                              marginBottom: "10px",
                            }}
                          />
                        )}

                        {/* Title + description + type badge */}
                        <h6 style={{ margin: 0, fontWeight: "700" }}>
                          {c.headline || "Yoga Certificate"}
                        </h6>
                        <p style={{ margin: "4px 0 6px", fontSize: "13px", color: "#000" }}>
                          {c.description || "No description available"}
                        </p>
                        <span style={{
                          display: "inline-block",
                          padding: "2px 8px", borderRadius: "4px",
                          fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
                          background: fileType === "pdf" ? "#fee2e2" : "#dbeafe",
                          color:      fileType === "pdf" ? "#dc2626" : "#1d4ed8",
                        }}>
                          {fileType === "pdf" ? "📄 PDF" : "🖼️ Image"}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>

      {/* Payment Details */}
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
            ) : <p>N/A</p>}
          </div>
        </div>
      </div>

      {/* Professional Details */}
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
                    borderRadius: "10px", height: "100px",
                  }}
                >
                  <div style={{ fontSize: "13px", marginBottom: "15px" }}>
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

      {/* Journey Images */}
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

      {/* TABS */}
      <div className="card shadow-sm mb-4" style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex", borderBottom: "1px solid #e5e7eb",
          background: "#fafafa", paddingLeft: "16px",
        }}>
          <button style={tabStyle("bookings")} onClick={() => setActiveTab("bookings")}>📋 Trainer Bookings</button>
          <button style={tabStyle("earnings")} onClick={() => setActiveTab("earnings")}>💰 Trainer Earnings</button>
          <button style={tabStyle("ratings")}  onClick={() => setActiveTab("ratings")}>⭐ Trainer Ratings</button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="p-3">
            <div className="card p-3 mb-3">
              <h5 className="mb-3">Filters</h5>
              <div className="row">
                <div className="col-md-4">
                  <label>Booking Type</label>
                  <select className="form-select" value={bookingFilters.bookingType}
                    onChange={(e) => handleBookingFilterChange("bookingType", e.target.value)}>
                    <option value="">All</option>
                    <option value="instant">Instant</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="package">Package</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label>Status</label>
                  <select className="form-select" value={bookingFilters.status}
                    onChange={(e) => handleBookingFilterChange("status", e.target.value)}>
                    <option value="">All</option>
                    <option value="ongoing">🟣 On Going</option>
                    <option value="accepted">Accepted</option>
                    <option value="opened">Opened</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label>From Date</label>
                  <input type="date" className="form-control" value={bookingFilters.fromDate}
                    onChange={(e) => handleBookingFilterChange("fromDate", e.target.value)} />
                </div>
                <div className="col-md-4 mt-3">
                  <label>To Date</label>
                  <input type="date" className="form-control" value={bookingFilters.toDate}
                    onChange={(e) => handleBookingFilterChange("toDate", e.target.value)} />
                </div>
                <div className="col-md-4 mt-3">
                  <label>Yoga Name</label>
                  <select className="form-select" value={bookingFilters.yogaName}
                    onChange={(e) => handleBookingFilterChange("yogaName", e.target.value)}>
                    <option value="">All</option>
                    {bookingYogaOptions.map((name, i) => (
                      <option key={i} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-end mt-3 d-flex justify-content-end gap-3 flex-wrap">
                <button onClick={handleApplyBookingFilters} style={btnFilter}><FaFilter /><span>Filter</span></button>
                <button onClick={handleClearBookingFilters} style={btnClear}>Clear</button>
                <button onClick={exportBookingsCSV}   disabled={exporting} style={btnCSV(exporting)}>CSV <FaFileCsv style={{ fontSize: "16px" }} /></button>
                <button onClick={exportBookingsExcel} disabled={exporting} style={btnExcel(exporting)}>Excel <FaFileExcel style={{ fontSize: "16px" }} /></button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2">
                <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>Records per page:</label>
                <select className="form-select form-select-sm"
                  style={{ border: "2px solid #ff7a00", padding: "2px", cursor: "pointer", width: "75px" }}
                  value={bookingLimit}
                  onChange={(e) => { setBookingLimit(Number(e.target.value)); setCurrentPage(1); }}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <span style={{ fontSize: "16px", color: "#000" }}>
                Showing <strong style={{ color: "#ff7a00" }}>{ordersList.length}</strong>
                {bookingTotalCount > ordersList.length ? <> of <strong>{bookingTotalCount}</strong></> : null} records
              </span>
            </div>

            <Table columns={columns} data={tableData} currentPage={currentPage}
              totalPages={totalPages} onPageChange={setCurrentPage} isLoading={loading} />
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="p-3">
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
            <div className="card p-3 mb-3">
              <h5 className="mb-3">Filters</h5>
              <div className="row">
                <div className="col-md-4">
                  <label>Yoga Type</label>
                  <select className="form-select" value={earningFilters.yogaType}
                    onChange={(e) => handleEarningFilterChange("yogaType", e.target.value)}>
                    <option value="">All</option>
                    {yogaTypeOptions.map((name, i) => <option key={i} value={name}>{name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label>Booking Type</label>
                  <select className="form-select" value={earningFilters.bookingType}
                    onChange={(e) => handleEarningFilterChange("bookingType", e.target.value)}>
                    <option value="">All</option>
                    <option value="instant">Instant</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="package">Package</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label>From Date</label>
                  <input type="date" className="form-control" value={earningFilters.fromDate}
                    onChange={(e) => handleEarningFilterChange("fromDate", e.target.value)} />
                </div>
                <div className="col-md-4 mt-3">
                  <label>To Date</label>
                  <input type="date" className="form-control" value={earningFilters.toDate}
                    onChange={(e) => handleEarningFilterChange("toDate", e.target.value)} />
                </div>
              </div>
              <div className="text-end mt-3 d-flex justify-content-end gap-3 flex-wrap">
                <button onClick={handleApplyEarningFilters} style={btnFilter}><FaFilter /><span>Filter</span></button>
                <button onClick={handleClearEarningFilters} style={btnClear}>Clear</button>
                <button onClick={exportCSV}   disabled={exporting} style={btnCSV(exporting)}>CSV <FaFileCsv style={{ fontSize: "16px" }} /></button>
                <button onClick={exportExcel} disabled={exporting} style={btnExcel(exporting)}>Excel <FaFileExcel style={{ fontSize: "16px" }} /></button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2">
                <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>Records per page:</label>
                <select className="form-select form-select-sm"
                  style={{ border: "2px solid #ff7a00", padding: "2px", cursor: "pointer", width: "75px" }}
                  value={earningsLimit} onChange={handleEarningsLimitChange}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <span style={{ fontSize: "16px", color: "#000" }}>
                Showing <strong style={{ color: "#ff7a00" }}>{earnings.length}</strong>
                {earningsTotalCount > earnings.length ? <> of <strong>{earningsTotalCount}</strong></> : null} records
              </span>
            </div>

            <Table columns={earningColumns} data={earningTableData} currentPage={earningsPage}
              totalPages={earningsTotalPages} onPageChange={setEarningsPage} isLoading={earningsLoading} />
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === "ratings" && (
          <div className="p-3">
            <div className="d-flex flex-wrap gap-3 mb-4">
              <div style={{ background: "linear-gradient(135deg, #f59e0b, #fcd34d)", color: "#fff", borderRadius: "10px", padding: "10px 22px", fontWeight: 700, fontSize: "15px" }}>
                ⭐ Avg Rating: {Number(averageRating).toFixed(1)}
              </div>
              <div style={{ background: "linear-gradient(135deg, #6366f1, #a5b4fc)", color: "#fff", borderRadius: "10px", padding: "10px 22px", fontWeight: 700, fontSize: "15px" }}>
                Total Ratings: {totalRatings}
              </div>
              <div style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)", color: "#fff", borderRadius: "10px", padding: "10px 22px", fontWeight: 700, fontSize: "15px" }}>
                Total Reviews: {totalReviews}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>Records per page:</label>
                <select className="form-select form-select-sm"
                  style={{ border: "2px solid #ff7a00", padding: "2px", cursor: "pointer", width: "75px" }}
                  value={ratingsLimit}
                  onChange={(e) => { setRatingsLimit(Number(e.target.value)); setRatingsPage(1); }}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <span style={{ fontSize: "16px", color: "#000" }}>
                Showing <strong style={{ color: "#ff7a00" }}>{ratings.length}</strong>
                {ratingsTotalCount > ratings.length ? <> of <strong>{ratingsTotalCount}</strong></> : null} records
              </span>
            </div>

            {ratingsLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                <div className="table-spinner" />
              </div>
            ) : ratings.length === 0 ? (
              <p className="text-muted text-center py-4">No ratings found.</p>
            ) : (
              <div className="row">
                {ratings.map((item, index) => (
                  <div className="col-md-6 mb-3" key={item._id || index}>
                    <div style={{
                      background: "rgb(234 228 228)", border: "1px solid #e5e7eb",
                      borderRadius: "14px", padding: "16px 18px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", height: "100%",
                    }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          {item.clientId?.profile_pic ? (
                            <img
                              src={getImageUrl(item.clientId.profile_pic)}
                              alt="Client"
                              style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ff7a00" }}
                            />
                          ) : (
                            <div style={{
                              width: "42px", height: "42px", borderRadius: "50%",
                              background: "linear-gradient(135deg, #ff7a00, #fcd34d)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontWeight: 700, fontSize: "16px",
                            }}>
                              {(item.clientId?.name || "?")[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>
                              {item.clientId?.name || "Anonymous"}
                            </div>
                            <div style={{ fontSize: "12px", color: "#000" }}>
                              {item.clientId?.email || ""}
                            </div>
                          </div>
                        </div>
                        <div>{renderStars(item.rating)}</div>
                      </div>

                      {item.review ? (
                        <p style={{
                          margin: "10px 0", fontWeight: "bolder", fontSize: "13px", color: "#000000",
                          background: "#fafafa", borderLeft: "5px solid #ff7a00",
                          borderRadius: "4px", padding: "8px 12px", fontStyle: "italic",
                        }}>
                          "{item.review}"
                        </p>
                      ) : (
                        <p style={{ margin: "10px 0", fontSize: "13px", color: "#bbb", fontStyle: "italic" }}>
                          No review provided
                        </p>
                      )}

                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {item.createdAt && (
                          <span style={{
                            background: "#f0fdf4", color: "#16a34a",
                            border: "1px solid #bbf7d0", borderRadius: "20px",
                            padding: "2px 12px", fontSize: "12px", fontWeight: 500,
                          }}>
                            📅 {new Date(item.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {ratingsTotalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
                <button className="btn btn-sm btn-outline-secondary"
                  disabled={ratingsPage === 1} onClick={() => setRatingsPage((p) => p - 1)}>← Prev</button>
                {Array.from({ length: ratingsTotalPages }, (_, i) => i + 1).map((pg) => (
                  <button key={pg} className="btn btn-sm"
                    style={{
                      background: ratingsPage === pg ? "#ff7a00" : "transparent",
                      color: ratingsPage === pg ? "#fff" : "#ff7a00",
                      border: "1px solid #ff7a00",
                    }}
                    onClick={() => setRatingsPage(pg)}>
                    {pg}
                  </button>
                ))}
                <button className="btn btn-sm btn-outline-secondary"
                  disabled={ratingsPage === ratingsTotalPages} onClick={() => setRatingsPage((p) => p + 1)}>Next →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CHANGE 4 — Full-screen modal: shows PDF in iframe OR image in <img>
      ══════════════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          onClick={closeImageModal}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.75)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 9999, cursor: "pointer",
          }}
        >
          {modalType === "pdf" ? (
            <iframe
              src={modalImage}
              title="Certificate PDF"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "85vw", height: "90vh",
                borderRadius: "12px", border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                cursor: "default",
              }}
            />
            
          ) : (
            <img
              src={modalImage}
              alt="Full View"
              style={{
                maxWidth: "90%", maxHeight: "90%",
                borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            />
          )}
          {/* Close button */}
          <button
            onClick={closeImageModal}
            style={{
              position: "fixed", top: "20px", right: "24px",
              background: "#fff", border: "none", borderRadius: "50%",
              width: "36px", height: "36px", fontSize: "18px",
              cursor: "pointer", fontWeight: 700, color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}

export default TrainerProfile;