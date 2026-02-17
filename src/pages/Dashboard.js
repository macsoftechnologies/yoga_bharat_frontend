import React, { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";

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
  dashboardTypeDistribution
} from "../services/authService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-31");
  const [earningsData, setEarningsData] = useState({
    labels: [],
    datasets: [],
  });
  const [bookingsData, setBookingData] = useState({
    labels: [],
    datasets: [],
  });
  const [yogaTypeData, setYogaTypeData] = useState({ labels: [], datasets: [] });

  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalEarningsAmount: 0,
    totalBookings: 0,
    activeClients: 0,
    activeTrainers: 0,
  });

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await getDashboardStats(fromDate, toDate);
      if (res) {
        setStats(res);
      }
    } catch (error) {
      console.error("Dashboard API error:", error);
    }
  }, [fromDate, toDate]);

  const fetchMonthlyStats = async () => {
    try {
      const year = new Date().getFullYear();
      const response = await dashboardMonthlyEarnings(year);
      console.log("response.....", response);

      const months = response.data.map((item) => item.month);
      const totalAmounts = response.data.map((item) => item.totalAmount); 

      setEarningsData({
        labels: months,
        datasets: [
          {
            label: "Monthly Earnings (₹)",
            data: totalAmounts,
            backgroundColor: "#17a951",
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch monthly stats:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchYogaTypeDistribution = async () => {
    try {
      const response = await dashboardTypeDistribution();
      console.log("response.....", response);

      const labels = response.data.map((item) => item.yoga_name);
      const bookingCounts = response.data.map((item) => item.bookingCount);

      const backgroundColors = ["#16a951", "#feb131", "#2dc9d8", "#8b2291", "#ff6384", "#ff9f40"];

      setYogaTypeData({
        labels: labels,
        datasets: [
          {
            data: bookingCounts,
            backgroundColor: backgroundColors.slice(0, response.data.length),
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch yoga type distribution:", error);
    }
  };
useEffect(() => {
  fetchYogaTypeDistribution();
}, []);

  const fetchBookingStats = async () => {
    try {
      const year = new Date().getFullYear();
      const response = await dashboardBookingStats(year);
      console.log("response.....", response);

      const months = response.data.map((item) => item.month);
      const bookingCounts = response.data.map((item) => item.bookingCount);

      setBookingData({
        labels: months,
        datasets: [
          {
            label: "Yoga Bookings",
            data: bookingCounts,
            borderColor: "#2dc9d8",
            backgroundColor: "rgba(45,201,216,0.15)",
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch booking stats:", error);
    }
  };

  useEffect(() => {
    fetchBookingStats();
  }, []);

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  useEffect(() => {
    fetchBookingStats();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleFilter = () => {
    fetchDashboard();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h3 className="dashboard-title">Yoga Dashboard</h3>
        <div className="d-flex gap-2">
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
            <span style={{ marginLeft: "6px" }}>Filter</span>
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stat-box green">
              <p>Total Earnings</p>
              <h3>₹{stats.totalEarningsAmount}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-box yellow">
              <p>Total Bookings</p>
              <h3>{stats.totalBookings}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-box blue">
              <p>Active Clients</p>
              <h3>{stats.activeClients}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-box purple">
              <p>Active Trainers</p>
              <h3>{stats.activeTrainers}</h3>
            </div>
          </div>
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
