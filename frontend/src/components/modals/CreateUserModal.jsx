import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { UserPlus } from "lucide-react";

function CreateUserModal({ addUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  // Email format validation helper
  const isValidEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleCreateUser = async (e) => {
    if (e) e.preventDefault();

    // Input validations
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter both Name and Email");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }

    if (!isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(apiUrl, {
        name: name.trim(),
        email: email.trim()
      });

      if (res.status === 201) {
        toast.success(`User "${res.data.name}" Created Successfully`);
        addUser(res.data); // Dynamic update without full page refresh!
        setName("");
        setEmail("");

        // Close modal programmatically if bootstrap is loaded
        const modalElement = document.getElementById("CreateUserModal");
        if (window.bootstrap && modalElement) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();
        }
      }
    } catch (error) {
      console.error("Error Creating User: ", error);
      if (error.response && error.response.status === 409) {
        toast.error("A user with this email address already exists");
      } else {
        toast.error("Failed to create user. Verify backend status.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-primary-custom"
        data-bs-toggle="modal"
        data-bs-target="#CreateUserModal"
      >
        <UserPlus size={18} />
        <span>Create User</span>
      </button>

      <div
        className="modal fade"
        id="CreateUserModal"
        tabIndex="-1"
        aria-labelledby="CreateUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="CreateUserModalLabel" style={{ fontWeight: "700" }}>
                Add New User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="create-name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="create-name"
                    placeholder="Ex: John Doe"
                    value={name}
                    onChange={handleNameChange}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="create-email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="create-email"
                    placeholder="Ex: johndoe@gmail.com"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="off"
                    required
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
                  className="btn btn-success"
                  style={{ borderRadius: "10px", minWidth: "120px" }}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUserModal;
