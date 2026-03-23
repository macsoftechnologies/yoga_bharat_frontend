import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Swal from "sweetalert2";
import {
  getTrainers,
  approveTrainer,
  getCertificatesByUser,
} from "../services/authService";
import { useNavigate } from "react-router-dom";

function Trainer() {
  const navigate = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const fetchData = async (page, lim) => {
    setLoading(true);
    try {
      const res = await getTrainers(page, lim);
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
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

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

  const handleApprove = async () => {
    try {
      await approveTrainer(selectedTrainer.userId);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Trainer Approved",
        showConfirmButton: false,
        timer: 3000,
      });
      setViewOpen(false);
      setSelectedTrainer(null);
      fetchData(currentPage, limit);
    } catch {
      Swal.fire("Error", "Approval failed", "error");
    }
  };

  const goToProfile = (userId) => {
    navigate(`/trainer/${userId}`);
  };

  const columns = [
    { header: "S.No",   accessor: "sno" },
    { header: "Name",   accessor: "name" },
    { header: "Mobile", accessor: "mobileNumber" },
    { header: "Email",  accessor: "email" },
    { header: "Gender", accessor: "gender" },
    { header: "Age",    accessor: "age" },
    { header: "eKYC",   accessor: "ekyc" },
  ];

  const tableData = trainers.map((item, index) => ({
    _rowonClick: () => goToProfile(item.userId),
    sno:          index + 1 + (currentPage - 1) * limit,
    name:         item.name,
    mobileNumber: item.mobileNumber,
    email:        item.email,
    gender:       item.gender,
    age:          item.age,
    ekyc: (
      <span
        onClick={(e) => {
          e.stopPropagation();
          if (item.ekyc_status === "pending") openModal(item);
        }}
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          color: "#fff",
          cursor: item.ekyc_status === "pending" ? "pointer" : "default",
          background: item.ekyc_status === "approved" ? "#28a745" : "#dc3545",
        }}
      >
        {item.ekyc_status}
      </span>
    ),
  }));

  return (
    <div>

      {/* ── Row 1: Title + Records per page ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>

        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
          TRAINER LIST
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "13px", color: "#6c757d" }}>
            Records per page:
          </span>
          <select
            value={limit}
            onChange={handleLimitChange}
            style={{
              fontSize: "13px",
              padding: "3px 8px",
              height: "30px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              color: "#1a1a1a",
              background: "#fff",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* ── Row 2: Showing X of Y records + row click hint ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>

        <span style={{ fontSize: "14px", color: "#333" }}>
          Showing{" "}
          <strong style={{ color: "#ff7a00", fontWeight: "700" }}>
            {trainers.length}
          </strong>
          {totalCount > trainers.length && (
            <>
              {" "}of{" "}
              <strong style={{ color: "#333", fontWeight: "600" }}>
                {totalCount}
              </strong>
            </>
          )}{" "}
          records
        </span>

        <span style={{ fontSize: "13px", color: "#aaa", fontStyle: "italic" }}>
          Click any row to view profile →
        </span>
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

      {/* ── View / Approve Modal ── */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Trainer Details"
        size="xl"
      >
        {selectedTrainer && (
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <p><b>Name:</b> {selectedTrainer.name}</p>
                <p><b>Mobile:</b> {selectedTrainer.mobileNumber}</p>
                <p><b>Email:</b> {selectedTrainer.email}</p>
                <p><b>Gender:</b> {selectedTrainer.gender}</p>
                <p><b>Age:</b> {selectedTrainer.age}</p>
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            padding: "14px 16px",
                            background: "#eafaf2",
                            borderRadius: "16px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                          }}
                        >
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${c.certificate}`}
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
                              {c.headline || "Hatha Yoga"}
                            </h6>
                            <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#666" }}>
                              {c.description || "Lorem ipsum dolor sit amet"}
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

              <hr />

              <div className="col-md-4">
                <h5>Payment Details</h5>
                <p><b>Recipient:</b> {selectedTrainer.recipient_name}</p>
                <p><b>Account No:</b> {selectedTrainer.account_no}</p>
                <p><b>Account Branch:</b> {selectedTrainer.account_branch}</p>
                <p><b>Branch Address:</b> {selectedTrainer.branch_address}</p>
                <p><b>IFSC code:</b> {selectedTrainer.ifsc_code}</p>
              </div>

              <div className="col-md-4">
                <h5>Journey Images</h5>
                {selectedTrainer.journey_images?.length > 0
                  ? selectedTrainer.journey_images.map((img, i) => (
                      <img
                        key={i}
                        src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                        alt="Journey"
                        width="100"
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
                    width="100%"
                    height="200"
                    controls
                    playsInline
                    style={{ borderRadius: "8px", marginTop: "5px" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : "N/A"}
              </div>
            </div>

            <div className="text-end mt-3">
              {selectedTrainer.ekyc_status === "pending" && (
                <Button text="Approve" color="green" onClick={handleApprove} />
              )}
              <Button
                text="Close"
                color="secondary"
                onClick={() => setViewOpen(false)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Trainer;