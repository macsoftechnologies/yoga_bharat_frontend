import React from "react";
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

import { Bar, Line, Doughnut } from "react-chartjs-2";

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
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const earningsData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Earnings (₹)",
        data: [25000, 32000, 28000, 40000, 36000, 45000],
        backgroundColor: "#16a951",
        borderRadius: 6,
      },
    ],
  };

  const bookingsData = {
    labels: months,
    datasets: [
      {
        label: "Yoga Bookings",
        data: [120, 180, 150, 220, 200, 260],
        borderColor: "#2dc9d8",
        backgroundColor: "rgba(45,201,216,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const  yogaTypeData = {
  labels: ["Power Yoga", "Hatha Yoga", "Vinyasa", "Ashtanga"],
  datasets: [
    {
      data: [40, 25, 20, 15],
      backgroundColor: [
        "#16a951",
        "#feb131",
        "#2dc9d8",
        "#8b2291",
      ],
    },
  ],
  };


  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h3 className="dashboard-title mb-4">Yoga Dashboard</h3>
      </div>
      <div className="content-card">
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stat-box green">
              <p>Total Earnings</p>
              <h3>₹2,06,000</h3>
              <p>This Month</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-box yellow">
              <p>Total Bookings</p>
              <h3>130</h3>
              <p>This Month</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-box blue">
              <p>Active Users</p>
              <h3>20</h3>
              <p>Current</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-box purple">
              <p>Yoga Classes</p>
              <h3>18</h3>
               <p>Available</p>
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

        <div className="row g-4">
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
