import React from "react";
import { useNavigate } from "react-router-dom";


function TrainerProfile() {
   const navigate = useNavigate();
  const trainer = {
    name: "Shankar",
    email: "shankar@gmail.com",
    mobileNumber: "9398352152",
    gender: "Male",
    age: 29,
    ekyc_status: "approved",
    profile_pic: "uploads/profile.jpg",
  };

  // 🔹 Static Certificates
  const certificates = [
    {
      _id: 1,
      certificate: "uploads/cert1.jpg",
      headline: "Yoga Trainer Certification",
    },
    {
      _id: 2,
      certificate: "uploads/cert2.jpg",
      headline: "Advanced Yoga Course",
    },
  ];

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Trainer Profile</h2>

        <button
          className="btn"
          onClick={() => navigate("/trainer")}
          style={{
            background: "linear-gradient(135deg, #16a951, #2dc9d8)",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "500",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ← Back
        </button>
      </div>

      <div className="row align-items-center">
        {/* PROFILE IMAGE */}
        <div className="col-md-4">
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/${trainer.profile_pic}`}
            alt="Profile"
            width="200"
            style={{ borderRadius: "12px" }}
          />
        </div>

        {/* BASIC DETAILS */}
        <div className="col-md-8">
          <p><b>Name:</b> {trainer.name}</p>
          <p><b>Email:</b> {trainer.email}</p>
          <p><b>Mobile:</b> {trainer.mobileNumber}</p>
          <p><b>Gender:</b> {trainer.gender}</p>
          <p><b>Age:</b> {trainer.age}</p>
          <p>
            <b>eKYC:</b>{" "}
            <span style={{ color: "green", fontWeight: 600 }}>
              {trainer.ekyc_status}
            </span>
          </p>
        </div>
      </div>

      <div className="row align-items-center">
        {/* PROFILE IMAGE */}
        <div className="col-md-4">
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/${trainer.profile_pic}`}
            alt="Profile"
            width="200"
            style={{ borderRadius: "12px" }}
          />
        </div>

        {/* BASIC DETAILS */}
        <div className="col-md-8">
          <p><b>Name:</b> {trainer.name}</p>
          <p><b>Email:</b> {trainer.email}</p>
          <p><b>Mobile:</b> {trainer.mobileNumber}</p>
          <p><b>Gender:</b> {trainer.gender}</p>
          <p><b>Age:</b> {trainer.age}</p>
          <p>
            <b>eKYC:</b>{" "}
            <span style={{ color: "green", fontWeight: 600 }}>
              {trainer.ekyc_status}
            </span>
          </p>
        </div>
      </div>

      <div className="row align-items-center">
        {/* PROFILE IMAGE */}
        <div className="col-md-4">
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/${trainer.profile_pic}`}
            alt="Profile"
            width="200"
            style={{ borderRadius: "12px" }}
          />
        </div>

        {/* BASIC DETAILS */}
        <div className="col-md-8">
          <p><b>Name:</b> {trainer.name}</p>
          <p><b>Email:</b> {trainer.email}</p>
          <p><b>Mobile:</b> {trainer.mobileNumber}</p>
          <p><b>Gender:</b> {trainer.gender}</p>
          <p><b>Age:</b> {trainer.age}</p>
          <p>
            <b>eKYC:</b>{" "}
            <span style={{ color: "green", fontWeight: 600 }}>
              {trainer.ekyc_status}
            </span>
          </p>
        </div>
      </div>
      
      <hr />
      <h5>Certificates</h5>
      <div className="row">
        {certificates.map((item) => (
          <div className="col-md-4 mb-3" key={item._id}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${item.certificate}`}
                alt="Certificate"
                width="100%"
                style={{ borderRadius: "10px" }}
              />
              <p className="mt-2">{item.headline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainerProfile;
