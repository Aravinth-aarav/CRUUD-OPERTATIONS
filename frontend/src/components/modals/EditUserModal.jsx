import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

function EditUserModal({ user, onEditSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync state when the selected user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const isValidEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleEditUser = async (e) => {
    if (e) e.preventDefault();

    if (!user) return;

    if (!name.trim() || !email.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (!isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.put(apiUrl, {
        id: user.id,
        name: name.trim(),
        email: email.trim(),
      });

      if (res.status === 200) {
        toast.success(`User updated successfully`);
        
        // Notify parent to update local state dynamically
        onEditSuccess(res.data);

        // Hide bootstrap modal
        const modalElement = document.getElementById("editUserModal");
        if (window.bootstrap && modalElement) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();
        }
      }
    } catch (error) {
      console.error("Error Editing User", error);
      toast.error("Failed to update user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="editUserModal"
      tabIndex="-1"
      aria-labelledby="editUserModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editUserModalLabel" style={{ fontWeight: "700" }}>
              Edit User Settings
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleEditUser}>
            <div className="modal-body">
              <div className="mb-3">
                <span className="text-secondary" style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                  Editing User ID: <span className="id-badge">{user?.id || "--"}</span>
                </span>
              </div>
              <div className="mb-3">
                <label htmlFor="edit-name" className="form-label">
                  Update Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edit-name"
                  value={name}
                  onChange={handleNameChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="edit-email" className="form-label">
                  Update Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="edit-email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                style={{ borderRadius: "10px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-warning"
                style={{ borderRadius: "10px", minWidth: "120px", color: "#000", fontWeight: "600" }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;
