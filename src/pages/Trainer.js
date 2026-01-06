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

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const res = await getTrainers(page, 10);

      if (Array.isArray(res)) {
        setTrainers(res);
        setTotalPages(1);
      } else if (res && Array.isArray(res.data)) {
        setTrainers(res.data);
        setTotalPages(res.totalPages || 1);
      } else {
        setTrainers([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      setTrainers([]);
      setTotalPages(1);
    }
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
      fetchData(currentPage);
    } catch {
      Swal.fire("Error", "Approval failed", "error");
    }
  };

  /* ---------- NAVIGATION HANDLER ---------- */
  const goToProfile = (userId) => {
    navigate(`/trainer/${userId}`);
  };

  /* ---------- TABLE ---------- */
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Mobile", accessor: "mobileNumber" },
    { header: "Email", accessor: "email" },
    { header: "Gender", accessor: "gender" },
    { header: "Age", accessor: "age" },
    { header: "eKYC", accessor: "ekyc" },
  ];

  const cellStyle = { cursor: "pointer" };

  const tableData = trainers.map((item) => ({
    ...item,

    name: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.name}
      </span>
    ),

    mobileNumber: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.mobileNumber}
      </span>
    ),

    email: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.email}
      </span>
    ),

    gender: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.gender}
      </span>
    ),

    age: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.age}
      </span>
    ),

    ekyc: (
      <span
        onClick={(e) => {
          e.stopPropagation(); // stop redirect
          item.ekyc_status === "pending" && openModal(item);
        }}
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          color: "#fff",
          cursor: item.ekyc_status === "pending" ? "pointer" : "default",
          background:
            item.ekyc_status === "approved" ? "#28a745" : "#dc3545",
        }}
      >
        {item.ekyc_status}
      </span>
    ),
  }));

  return (
    <div>
      <h2 className="mb-3">TRAINER LIST</h2>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* VIEW MODAL */}
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
                      <p key={y._id}>
                        <b>Yoga:</b> {y.yoga_name}
                      </p>
                    ))
                  : "N/A"}
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
