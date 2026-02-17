import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import {
  getTrainers,
  getBookings,
  getCertificatesByUser,
  getTrainerEarning,
} from "../services/authService";

function TrainerProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [earningsPage, setEarningsPage] = useState(1);
  const [earningsTotalPages, setEarningsTotalPages] = useState(1);

  // Modal State for Full Image View
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openImageModal = (imgUrl) => {
    setModalImage(imgUrl);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setModalOpen(false);
    setModalImage("");
  };

  // Fetch Trainer Info
  useEffect(() => {
    if (!userId) return;

    const fetchTrainer = async () => {
      try {
        const res = await getTrainers(1, 10);
        if (res && Array.isArray(res)) {
          const selectedTrainer = res.find((t) => t.userId === userId);
          setTrainer(selectedTrainer || null);

          if (selectedTrainer?.userId) {
            const certRes = await getCertificatesByUser(selectedTrainer.userId);
            setCertificates(certRes?.data || []);
          }
        }
      } catch (error) {
        console.error("Fetch Trainer Error:", error);
      }
    };

    fetchTrainer();
  }, [userId]);

  // Fetch Bookings
  useEffect(() => {
    if (!trainer?.userId) return;

    const fetchBookings = async () => {
      try {
        const payload = { accepted_trainerId: trainer.userId };
        const res = await getBookings(currentPage, 10, payload);

        if (res && Array.isArray(res.data)) {
          setOrdersList(res.data);
          setTotalPages(res.totalPages || 1);
        } else {
          setOrdersList([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Fetch Bookings Error:", error);
      }
    };

    fetchBookings();
  }, [currentPage, trainer]);

  // Fetch Earnings
  useEffect(() => {
    if (!trainer?.userId) return;

    const fetchEarnings = async () => {
      try {
        const res = await getTrainerEarning(trainer.userId);
        console.log("Earnings API response:", res);

        const data = Array.isArray(res) ? res : res?.data;
        setEarnings(data || []);
        setEarningsTotalPages(1);
      } catch (error) {
        console.error("Fetch Earnings Error:", error);
        setEarnings([]);
      }
    };

    fetchEarnings();
  }, [trainer?.userId]);

  if (!trainer) return <div className="p-3">Loading...</div>;

  const getImageUrl = (filename) => {
    if (!filename) return "";
    return `${process.env.REACT_APP_API_BASE_URL}/${filename}`;
  };

  // Bookings Table
  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Trainer Name", accessor: "trainerName" },
    { header: "Client Name", accessor: "clientName" },
    { header: "Client UserId", accessor: "clientUserId" },
    { header: "Booking Type", accessor: "bookingType" },
    { header: "Yoga Name", accessor: "yogaName" },
    { header: "Language", accessor: "language" },
    { header: "Client Price", accessor: "clientPrice" },
    { header: "Date", accessor: "scheduledDate" },
    { header: "Time", accessor: "time" },
    { header: "Status", accessor: "status" },
  ];

  const tableData = ordersList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
    trainerName: trainer?.name || "-",
    clientName: item.clientId?.[0]?.name || "-",
    clientUserId: item.clientId?.[0]?.userId || "-",
    bookingType: item.bookingType || "-",
    yogaName: item.yogaId?.[0]?.yoga_name || "-",
    language: item.languageId?.[0]?.language_name || "-",
    clientPrice: `₹${item.yogaId?.[0]?.client_price || 0}`,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString()
      : "-",
    time: item.time || "-",
    status: item.status || "-",
  }));

  // Earnings Table
  const earningColumns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Client Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Date", accessor: "date" },
    { header: "Trainer Price", accessor: "trainer_price" },
    { header: "Earned Amount", accessor: "earned_amount" },
  ];

  const earningTableData = earnings.map((item, index) => ({
    srNo: index + 1,
    name: item.clientId?.[0]?.name || "-",
    role: item.clientId?.[0]?.role || "-",
    date: item.date ? new Date(item.date).toLocaleDateString() : "-",
    trainer_price: item.yogaId?.[0]?.trainer_price
      ? `₹${item.yogaId[0].trainer_price}`
      : "-",
    earned_amount: item.earned_amount ? `₹${item.earned_amount}` : "₹0",
  }));

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>TRAINER PROFILE</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/trainer")}
        >
          ← Back
        </button>
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
            <p><b>Name:</b> {trainer.name}</p>
            <p><b>Email:</b> {trainer.email}</p>
            <p><b>Mobile:</b> {trainer.mobileNumber}</p>
          </div>

          <div className="col-md-4 mb-3">
            <p><b>Gender:</b> {trainer.gender}</p>
            <p><b>Age:</b> {trainer.age}</p>
            <p>
              <b>eKYC Status:</b>{" "}
              <span style={{ color: "green", fontWeight: 600 }}>
                {trainer.ekyc_status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className="card p-3 shadow-sm mb-4">
        <h4>Certificates</h4>
        <div className="col-12 mt-3">
          {certificates.length > 0 ? (
            <div className="row">
              {certificates.map((c) => (
                <div className="col-md-4 mb-3" key={c._id}>
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
              ))}
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
      {/* Payment  */}
      <div className="card p-3 shadow-sm mb-4">
        <h4>Payment Details</h4>

        <div className="row mt-3">
          <div className="col-md-6">
            <p><b>Recipient:</b> {trainer.recipient_name || "N/A"}</p>
            <p><b>Account No:</b> {trainer.account_no || "N/A"}</p>
            <p><b>Account Branch:</b> {trainer.account_branch || "N/A"}</p>
          </div>

          <div className="col-md-6">
            <p><b>Branch Address:</b> {trainer.branch_address || "N/A"}</p>
            <p><b>IFSC Code:</b> {trainer.ifsc_code || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="card p-3 shadow-sm mb-4">
        <div className="row">
          
          {/* Professional Details */}
          <div className="col-md-6">
            <h4>Professional Details</h4>

            {trainer.professional_details?.length > 0 ? (
              trainer.professional_details.map((item) => (
                <div key={item._id} className="mb-2">
                  <p className="mb-1">
                    <b>Yoga:</b> {item.yoga_name}
                  </p>
                  <p className="mb-1">
                    <b>Client Price:</b> ₹{item.client_price}
                  </p>
                  <p className="mb-1">
                    <b>Trainer Price:</b> ₹{item.trainer_price}
                  </p>
                  {/* <hr /> */}
                </div>
              ))
            ) : (
              <p>N/A</p>
            )}
          </div>


          {/* Yoga Video */}
          <div className="col-md-6">
            <h4>Yoga Video</h4>
            {trainer.yoga_video ? (
              <video
                src={getImageUrl(trainer.yoga_video)}
                width="100%"
                height="250"
                controls
                playsInline
                style={{
                  borderRadius: "12px",
                  marginTop: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>N/A</p>
            )}
          </div>

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
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => openImageModal(getImageUrl(img))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card p-3 shadow-sm mb-4">
        <h3 className="mb-3">Trainer Bookings</h3>
        <Table
          columns={columns}
          data={tableData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Earnings Table */}
      <div className="card p-3 shadow-sm mb-4">
        <h3 className="mb-3">Trainer Earnings</h3>
        <Table
          columns={earningColumns}
          data={earningTableData}
          currentPage={earningsPage}
          totalPages={earningsTotalPages}
          onPageChange={setEarningsPage}
        />
      </div>

      {/* Full Image Modal */}
      {modalOpen && (
        <div
          onClick={closeImageModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <img
            src={modalImage}
            alt="Full View"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TrainerProfile;
