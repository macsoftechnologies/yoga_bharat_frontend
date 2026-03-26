import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Swal from "sweetalert2";
import {
  addPrivacy,
  getPrivacyList,
  getPrivacyById,
  updatePrivacy,
  deletePrivacy,
} from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function PrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [policyList, setPolicyList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // ✅ Total records
  const [limit, setLimit] = useState(10); // ✅ Records per page
  const [loading, setLoading] = useState(false);

  // Fetch privacy policies when page or limit changes
  useEffect(() => {
    fetchPrivacy(currentPage, limit);
  }, [currentPage, limit]);

  const fetchPrivacy = async (page, limitValue) => {
    setLoading(true);
    try {
      const res = await getPrivacyList(page, limitValue);
      let data = [];
      let pages = 1;
      let total = 0;

      if (res && Array.isArray(res.data)) {
        data = res.data;
        pages = res.totalPages || 1;
        total = res.totalCount || data.length;
      } else if (Array.isArray(res)) {
        data = res;
        total = data.length;
      }

      setPolicyList(data);
      setTotalPages(pages);
      setTotalCount(total); // ✅ Total records
    } catch (err) {
      console.error(err);
      setPolicyList([]);
      setTotalPages(1);
      setTotalCount(0);
      Swal.fire("Error", "Failed to fetch privacy policies", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedItem && editOpen) {
        await updatePrivacy({
          privacyId: selectedItem.privacyId,
          privacy_policy: data.privacy_policy,
          usertype: data.usertype,
        });

        setPolicyList((prev) =>
          prev.map((item) =>
            item.privacyId === selectedItem.privacyId
              ? { ...item, privacy_policy: data.privacy_policy, usertype: data.usertype }
              : item
          )
        );

        setEditOpen(false);
        setSelectedItem(null);

        Swal.fire({
          title: "Updated!",
          text: "Privacy policy updated successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#35a542",
          color: "#ffffff",
        });
      } else {
        await addPrivacy({
          privacy_policy: data.privacy_policy,
          usertype: data.usertype,
        });
        setOpen(false);
        setSelectedItem(null);
        await fetchPrivacy(currentPage, limit);
        Swal.fire({
          title: "Added!",
          text: "Privacy policy added successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#35a542",
          color: "#ffffff",
        });
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleView = async (privacyId) => {
    try {
      const res = await getPrivacyById(privacyId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch {
      Swal.fire("Error", "Failed to fetch privacy policy", "error");
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDelete = async (privacyId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This privacy policy will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deletePrivacy(privacyId);
        Swal.fire({
          title: "Deleted!",
          text: "Privacy policy deleted successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#d33",
          color: "#ffffff",
        });
        await fetchPrivacy(currentPage, limit);
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
      }
    }
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "User Type", accessor: "usertype" },
    { header: "Policy", accessor: "displayText" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = Array.isArray(policyList)
    ? policyList.map((item, index) => {
        const policyText = item.privacy_policy || "-";
        return {
          srNo: (currentPage - 1) * limit + index + 1,
          ...item,
          displayText: (
            <span
              title={policyText}
              style={{
                display: "block",
                maxWidth: "400px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              {policyText}
            </span>
          ),
          actions: (
            <div className="actions">
              <button
                className="icon-btn view"
                title="View"
                onClick={() => handleView(item.privacyId)}
              >
                <FaEye />
              </button>
              <button
                className="icon-btn edit"
                title="Edit"
                onClick={() => handleEdit(item)}
              >
                <FaEdit />
              </button>
              <button
                className="icon-btn delete"
                title="Delete"
                onClick={() => handleDelete(item.privacyId)}
              >
                <FaTrash />
              </button>
            </div>
          ),
        };
      })
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>PRIVACY POLICY</h2>
        <Button text="+ Add PRIVACY POLICY" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* ✅ Records per page + Showing count */}
      <div className="d-flex align-items-center justify-content-between mb-2 p-2">
        <div className="d-flex align-items-center gap-2">
          <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>
            Records per page:
          </label>
          <select
            className="form-select form-select-sm"
            style={{ border: "2px solid #ff7a00", padding: "2px", cursor: "pointer", width: "75px" }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <span style={{ fontSize: "16px" }}>
          Showing <strong style={{ color: "#ff7a00" }}>{policyList.length}</strong>{" "}
          {totalCount > policyList.length && <>of <strong>{totalCount}</strong></>} records
        </span>
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Policy" size="md">
        <PolicyForm onClose={() => setOpen(false)} onSubmit={handleSubmit} isEdit={false} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Policy" size="md">
        <PolicyForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit={true}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Policy" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>User Type:</b> {selectedItem.usertype}</p>
            <p><b>Policy:</b> {selectedItem.privacy_policy}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PolicyForm({ onClose, initialData, isEdit, onSubmit }) {
  const [privacy_policy, setPrivacyPolicy] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    if (initialData) {
      setPrivacyPolicy(initialData.privacy_policy || initialData.text || "");
      setUsertype(initialData.usertype || "");
    } else {
      setPrivacyPolicy("");
      setUsertype("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ privacy_policy, usertype });   
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">User Type</label>
        <select
          className="form-select"
          value={usertype}
          onChange={(e) => setUsertype(e.target.value)}
          required
          disabled={isEdit}
        >
          <option value="">Select User Type</option>
          <option value="client">Client</option>
          <option value="trainer">Trainer</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Policy Text</label>
        <textarea
          className="form-control"
          value={privacy_policy}
          onChange={(e) => setPrivacyPolicy(e.target.value)}
          rows="5"
          required
        />
      </div>

      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default PrivacyPolicy;