import React from "react";
import Table from "../components/Table";
import Button from "../components/Button";

function User() {
  // Define columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  // Dummy User Data
  const data = [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      actions: (
        <div className="actions">
          <button className="view" onClick={() => alert("View John")}>View</button>
          <button className="edit" onClick={() => alert("Edit John")}>Edit</button>
          <button className="delete" onClick={() => alert("Delete John")}>Delete</button>
        </div>
      ),
    },
    {
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "User",
      status: "Inactive",
      actions: (
        <div className="actions">
          <button className="view" onClick={() => alert("View Sarah")}>View</button>
          <button className="edit" onClick={() => alert("Edit Sarah")}>Edit</button>
          <button className="delete" onClick={() => alert("Delete Sarah")}>Delete</button>
        </div>
      ),
    },
    {
      name: "Michael Lee",
      email: "michael@example.com",
      role: "Editor",
      status: "Active",
      actions: (
        <div className="actions">
          <button className="view" onClick={() => alert("View Michael")}>View</button>
          <button className="edit" onClick={() => alert("Edit Michael")}>Edit</button>
          <button className="delete" onClick={() => alert("Delete Michael")}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px 20px",
        }}
      >
        <h2>USER LIST</h2>

        <Button
          text="+ Create User"
          color="orange"
          onClick={() => alert("Add User clicked")}
        />
      </div>
      <Table columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
}

export default User;
