import React, { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { FaFilter } from "react-icons/fa";
import { Bar, Line, Doughnut } from "react-chartjs-2";

import {
  dashboardBookingStats,
  dashboardMonthlyEarnings,
  getDashboardStats,
  dashboardTypeDistribution,
} from "../services/authService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentYearDates = () => {
    const year = new Date().getFullYear();
    return {
      from: `${year}-01-01`,
      to: `${year}-12-31`,
      year,
    };
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [earningsData, setEarningsData] = useState({ labels: [], datasets: [] });
  const [bookingsData, setBookingData] = useState({ labels: [], datasets: [] });
  const [yogaTypeData, setYogaTypeData] = useState({ labels: [], datasets: [] });
  const [dashboardResponse, setDashboardResponse] = useState(null);
  const [stats, setStats] = useState({
    totalEarningsAmount: 0,
    totalBookings: 0,
    activeClients: 0,
    activeTrainers: 0,
  });

  const fetchDashboard = useCallback(async (start, end) => {
    try {
      const res = await getDashboardStats(start, end);
      if (res) {
        setStats(res);
        setDashboardResponse(res);
      }
    } catch (error) {
      console.error("Dashboard API error:", error);
    }
  }, []);

  const fetchMonthlyStats = useCallback(async (year) => {
    try {
      const response = await dashboardMonthlyEarnings(year);
      const months = response?.data?.map((i) => i.month) || [];
      const totals = response?.data?.map((i) => i.totalAmount) || [];
      setEarningsData({
        labels: months,
        datasets: [
          {
            label: "Monthly Earnings (₹)",
            data: totals,
            backgroundColor: "#17a951",
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchBookingStats = useCallback(async (year) => {
    try {
      const response = await dashboardBookingStats(year);
      const months = response?.data?.map((i) => i.month) || [];
      const counts = response?.data?.map((i) => i.bookingCount) || [];
      setBookingData({
        labels: months,
        datasets: [
          {
            label: "Yoga Bookings",
            data: counts,
            borderColor: "#2dc9d8",
            backgroundColor: "rgba(45,201,216,0.15)",
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchYogaTypeDistribution = useCallback(async () => {
    try {
      const response = await dashboardTypeDistribution();
      const labels = response?.data?.map((i) => i.yoga_name) || [];
      const counts = response?.data?.map((i) => i.bookingCount) || [];
      const colors = ["#16a951", "#feb131", "#2dc9d8", "#8b2291", "#ff6384", "#ff9f40"];
      setYogaTypeData({
        labels,
        datasets: [{ data: counts, backgroundColor: colors.slice(0, counts.length) }],
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const restoredFrom = location.state?.fromDate;
const restoredTo = location.state?.toDate;

useEffect(() => {
  if (restoredFrom && restoredTo) {
    setFromDate(restoredFrom);
    setToDate(restoredTo);
    fetchDashboard(restoredFrom, restoredTo);

    const year = new Date(restoredFrom).getFullYear();
    fetchMonthlyStats(year);
    fetchBookingStats(year);
  } else {
    const { from, to, year } = getCurrentYearDates();
    setFromDate(from);
    setToDate(to);
    fetchDashboard(from, to);
    fetchMonthlyStats(year);
    fetchBookingStats(year);
  }

  fetchYogaTypeDistribution();
}, [
  restoredFrom,
  restoredTo,
  fetchDashboard,
  fetchMonthlyStats,
  fetchBookingStats,
  fetchYogaTypeDistribution,
]);

  const handleFilter = () => {
    if (!fromDate || !toDate) return;
    fetchDashboard(fromDate, toDate);
    const selectedYear = new Date(fromDate).getFullYear();
    fetchMonthlyStats(selectedYear);
    fetchBookingStats(selectedYear);
  };

  const handleClear = () => {
    const { from, to, year } = getCurrentYearDates();
    setFromDate(from);
    setToDate(to);
    fetchDashboard(from, to);
    fetchMonthlyStats(year);
    fetchBookingStats(year);
  };

  const handleCardClick = (path) => {
    navigate(path, {
      state: {
        dashboardData: dashboardResponse,
        fromDate,
        toDate,
      },
    });
  };

  const statCards = [
    {
      label: "Total Earnings",
      value: `₹${stats.totalEarningsAmount}`,
      colorClass: "green",
      path: "/dashboard/total-earnings",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      colorClass: "yellow",
      path: "/dashboard/total-bookings",
    },
    {
      label: "Active Clients",
      value: stats.activeClients,
      colorClass: "blue",
      path: "/dashboard/active-clients",
    },
    {
      label: "Active Trainers",
      value: stats.activeTrainers,
      colorClass: "purple",
      path: "/dashboard/active-trainers",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header d-flex justify-content-between align-items-center mb-4 addstyle">
        <h3 className="dashboard-title">YOGA DASHBOARD</h3>

        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button
            onClick={handleFilter}
            className="d-flex align-items-center"
            style={{
              background: "linear-gradient(135deg, #000000, #fcd34d)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
            }}
          >
            <FaFilter />
            <span style={{ marginLeft: 6 }}>Filter</span>
          </button>
          <button
            onClick={handleClear}
            style={{
              background: "#6c757d",
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

      <div className="content-card">
        <div className="row g-4 mb-4">
          {statCards.map((card) => (
            <div className="col-md-3" key={card.label}>
              <div
                className={`stat-box ${card.colorClass}`}
                onClick={() => handleCardClick(card.path)}
                style={{ cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <p>{card.label}</p>
                <h3>{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="chart-box">
              <h5>Monthly Earnings</h5>
              <Bar data={earningsData} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="chart-box">
              <h5>Monthly Bookings</h5>
              <Line data={bookingsData} />
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <div className="chart-box text-center">
              <h5>Yoga Type Distribution</h5>
              <Doughnut data={yogaTypeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}