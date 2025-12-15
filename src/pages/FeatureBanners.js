import React, { useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import "../forms/form.css";

function FeatureBanners() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bannersList, setBannersList] = useState([
    {
      id: 1,
      title: "Morning Yoga Classes",
      description: "Start your day with a refreshing yoga session",
      imageUrl: "", // default placeholder
    },
  ]);

  // Add or Edit Banner
  const handleSubmit = (data) => {
    if (selectedItem && editOpen) {
      setBannersList(
        bannersList.map((item) =>
          item.id === selectedItem.id ? { ...item, ...data } : item
        )
      );
    } else {
      const newId = bannersList.length ? bannersList[bannersList.length - 1].id + 1 : 1;
      setBannersList([...bannersList, { id: newId, ...data }]);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this banner?")) return;
    setBannersList(bannersList.filter((b) => b.id !== id));
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    { header: "Image", accessor: "image" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = bannersList.map((item) => ({
    ...item,
    image: item.imageUrl ? (
      <img src={item.imageUrl} alt={item.title} width="100" />
    ) : (
      "No Image"
    ),
    actions: (
      <div className="actions">
        <button className="edit" onClick={() => handleEdit(item)}>Edit</button>
        <button className="delete" onClick={() => handleDelete(item.id)}>Delete</button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Feature Banners</h2>
        <Button text="+ Add Banner" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={5} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Banner" size="lg">
        <BannerForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Banner" size="lg">
        <BannerForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

// Reusable Banner Form
function BannerForm({ onClose, initialData, isEdit, onSubmit }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    // If image file is selected, use the preview URL
    const finalImageUrl = imageFile ? URL.createObjectURL(imageFile) : imageUrl;
    if (onSubmit) onSubmit({ title, description, imageUrl: finalImageUrl });
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter banner title"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          placeholder="Enter description"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImageFile(file);
              setImageUrl(URL.createObjectURL(file));
            }
          }}
        />
        {imageUrl && (
          <div className="mt-2">
            <img src={imageUrl} alt="Preview" style={{ width: "150px", height: "auto" }} />
          </div>
        )}
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

export default FeatureBanners;
