import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

function DeleteUserModal({ user, onDeleteSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDeleteUser = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.request({
        method: "delete",
        url: apiUrl,
        data: { id: user.id }
      });

      if (res.status === 200) {
        toast.success(`User "${user.name}" deleted successfully`);
        
        // Notify parent list to remove user dynamically
        onDeleteSuccess(user.id);

        // Hide bootstrap modal
        const modalElement = document.getElementById("DeleteUserModal");
        if (window.bootstrap && modalElement) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();
        }
      }
    } catch (error) {
      console.error("Error Deleting User", error);
      toast.error("Failed to delete user. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="DeleteUserModal"
      tabIndex="-1"
      aria-labelledby="DeleteUserModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="DeleteUserModalLabel" style={{ fontWeight: "700" }}>
              Confirm Deletion
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="custom-alert info" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", borderColor: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", marginBottom: "1.25rem" }}>
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ display: "block", marginBottom: "0.25rem" }}>Warning: Destructive Action</strong>
                Are you sure you want to permanently delete this user directory record? This action cannot be reversed.
              </div>
            </div>

            <div style={{ padding: "0.5rem 0" }}>
              <table className="table table-sm table-borderless" style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "var(--text-secondary)", width: "30%", padding: "4px 0" }}>User ID:</td>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}><span className="id-badge">{user?.id}</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--text-secondary)", padding: "4px 0" }}>Full Name:</td>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}>{user?.name}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--text-secondary)", padding: "4px 0" }}>Email Address:</td>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}>{user?.email}</td>
                  </tr>
                </tbody>
              </table>
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
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteUser}
              style={{ borderRadius: "10px", minWidth: "120px", fontWeight: "600" }}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;
