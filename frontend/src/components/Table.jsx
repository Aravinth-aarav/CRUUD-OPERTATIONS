import { useState } from "react";
import { 
  Search, 
  Pencil, 
  Trash2, 
  WifiOff, 
  RefreshCw, 
  Inbox, 
  Plus 
} from "lucide-react";
import CreateUserModal from "./modals/CreateUserModal";
import EditUserModal from "./modals/EditUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";

function Table({ 
  users, 
  loading, 
  isOffline, 
  addUser, 
  editUser, 
  deleteUser, 
  onRetry 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Client-side search filtering
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) || 
      user.email.toLowerCase().includes(search) || 
      user.id.toString().includes(search)
    );
  });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    // Modal will be opened using Bootstrap data-bs-target attributes on the button
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    // Modal will be opened using Bootstrap data-bs-target attributes on the button
  };

  // Rendering database offline error
  if (isOffline) {
    return (
      <div className="offline-card">
        <div className="offline-icon-container">
          <WifiOff size={36} />
        </div>
        <h3 className="offline-title">Database Offline</h3>
        <p className="offline-text">
          Could not establish connection to the backend server. Please verify that your Node/Express API server and MySQL docker container are running correctly.
        </p>
        <button 
          className="btn-primary-custom" 
          onClick={onRetry} 
          disabled={loading}
          style={{ width: "fit-content" }}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          <span>{loading ? "Reconnecting..." : "Retry Connection"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card table-card">
      <div className="table-header-bar">
        {/* Search Input Box */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search users by name, email, or id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create User Button Trigger Modal */}
        <CreateUserModal addUser={addUser} />
      </div>

      {/* Table Interface */}
      <div className="table-responsive-custom">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>User ID</th>
              <th style={{ width: "48%" }}>Profile details</th>
              <th style={{ width: "25%" }}>Email address</th>
              <th style={{ width: "15%", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Shimmer skeleton loaders during network loading
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="skeleton-row">
                  <td>
                    <div className="skeleton-box" style={{ width: "40px" }}></div>
                  </td>
                  <td>
                    <div className="user-info-cell">
                      <div className="skeleton-avatar"></div>
                      <div className="user-details" style={{ width: "150px", gap: "6px" }}>
                        <div className="skeleton-box" style={{ height: "14px" }}></div>
                        <div className="skeleton-box" style={{ height: "10px", width: "100px" }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="skeleton-box" style={{ width: "180px" }}></div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <div className="skeleton-box" style={{ width: "38px", height: "38px", borderRadius: "10px" }}></div>
                      <div className="skeleton-box" style={{ width: "38px", height: "38px", borderRadius: "10px" }}></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              // Empty list state
              <tr>
                <td colSpan="4">
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
                    <Inbox size={42} style={{ marginBottom: "1rem", opacity: 0.6 }} />
                    <h5 style={{ fontWeight: "600", color: "var(--text-primary)" }}>No Users Found</h5>
                    <p style={{ fontSize: "0.85rem", marginBottom: 0 }}>
                      {searchTerm ? "Try modifying your keywords or filters." : "Create a new user entry to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Actual User Data Rows
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="id-badge">{user.id}</span>
                  </td>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar-badge">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email" style={{ display: "none" }}>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      {/* Edit Trigger */}
                      <button
                        type="button"
                        className="btn-action edit"
                        data-bs-toggle="modal"
                        data-bs-target="#editUserModal"
                        onClick={() => handleEditClick(user)}
                        title="Edit User Info"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete Trigger */}
                      <button
                        type="button"
                        className="btn-action delete"
                        data-bs-toggle="modal"
                        data-bs-target="#DeleteUserModal"
                        onClick={() => handleDeleteClick(user)}
                        title="Delete User Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden Modals Bound to Selected Row States */}
      <EditUserModal user={selectedUser} onEditSuccess={editUser} />
      <DeleteUserModal user={selectedUser} onDeleteSuccess={deleteUser} />
    </div>
  );
}

export default Table;
