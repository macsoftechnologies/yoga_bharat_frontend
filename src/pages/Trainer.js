import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Swal from "sweetalert2";
import { getTrainers, approveTrainer } from "../services/authService";

function Trainer() {
  const [trainers, setTrainers] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    const data = await getTrainers();
    setTrainers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (item) => {
    setSelectedTrainer(item);
    setViewOpen(true);
  };

  /* ================= APPROVE ================= */
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
      fetchData();
    } catch {
      Swal.fire("Error", "Approval failed", "error");
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Mobile", accessor: "mobileNumber" },
    { header: "Email", accessor: "email" },
    { header: "Gender", accessor: "gender" },
    { header: "Age", accessor: "age" },
    { header: "eKYC", accessor: "ekyc" },
    { header: "Actions", accessor: "actions" },
  ];

  const data = trainers.map((item) => ({
    ...item,

    ekyc: (
      <span
        onClick={() => item.ekyc_status === "pending" && openModal(item)}
        style={{
          cursor: item.ekyc_status === "pending" ? "pointer" : "default",
          padding: "4px 10px",
          borderRadius: "6px",
          color: "#fff",
          background:
            item.ekyc_status === "approved" ? "#28a745" : "#dc3545",
        }}
      >
        {item.ekyc_status}
      </span>
    ),

    actions: (
      <button
        className="btn btn-primary btn-sm"
        disabled={item.ekyc_status === "pending"}
        onClick={() => item.ekyc_status === "approved" && openModal(item)}
        style={{
          opacity: item.ekyc_status === "pending" ? 0.5 : 1,
          cursor: item.ekyc_status === "pending" ? "not-allowed" : "pointer",
        }}
      >
        View
      </button>
    ),
  }));

  return (
    <div>
      <h2 className="mb-3">TRAINER LIST</h2>

      <Table columns={columns} data={data} rowsPerPage={10} />

      {/* ================= VIEW MODAL ================= */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Trainer Details"
        size="xl"
      >
        {selectedTrainer && (
          <div className="container">
            <div className="row">

              {/* BASIC DETAILS */}
              <div className="col-md-4">
                <p><b>Name:</b> {selectedTrainer.name}</p>
                <p><b>Mobile:</b> {selectedTrainer.mobileNumber}</p>
                <p><b>Email:</b> {selectedTrainer.email}</p>
                <p><b>Gender:</b> {selectedTrainer.gender}</p>
                <p><b>Age:</b> {selectedTrainer.age}</p>
              </div>

              {/* PROFILE PIC */}
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
              {/* PROFESSIONAL DETAILS - LEFT */}
              <div className="col-md-4">
                <h5>Professional Details</h5>
                {selectedTrainer.professional_details?.length > 0 ? (
                  selectedTrainer.professional_details.map((yoga) => (
                    <p key={yoga._id}>
                      <b>Yoga Name:</b> {yoga.yoga_name}
                    </p>
                  ))
                ) : (
                  <p>N/A</p>
                )}
              </div>

              {/* PROFESSIONAL DETAILS - RIGHT (EMPTY / FUTURE USE) */}
              {/* <div className="col-md-6">
                Reserved for future fields if needed
              </div> */}

              <hr />

              {/* CERTIFICATES */}
              <div className="col-md-6 mt-3 mb-3">
                <h5>Certificates</h5>
                {selectedTrainer.certificates?.length > 0 ? (
                  selectedTrainer.certificates.map((img, i) => (
                    <img
                      key={i}
                      src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                      alt="Certificate"
                      width="100"
                      className="me-2 mb-2"
                    />
                  ))
                ) : "N/A"}
              </div>

              {/* JOURNEY IMAGES */}
              <div className="col-md-6 mt-3 mb-3">
                <h5>Journey Images</h5>
                {selectedTrainer.journey_images?.length > 0 ? (
                  selectedTrainer.journey_images.map((img, i) => (
                    <img
                      key={i}
                      src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                      alt="Journey"
                      width="100"
                      className="me-2 mb-2"
                    />
                  ))
                ) : "N/A"}
              </div>

              <hr />

              {/* PAYMENT DETAILS */}
              <div className="col-md-6">
                <h5>Payment Details</h5>
                <p><b>Recipient Name:</b> {selectedTrainer.recipient_name}</p>
                <p><b>Account No:</b> {selectedTrainer.account_no}</p>
              </div>

              {/* YOGA VIDEO */}
              <div className="col-md-6">
                <h5>Yoga Video</h5>
                {selectedTrainer.yoga_video ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${selectedTrainer.yoga_video}`}
                    alt="Yoga Video"
                    width="150"
                  />
                ) : "N/A"}
              </div>
            </div>

            {/* ACTION BUTTONS */}
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
