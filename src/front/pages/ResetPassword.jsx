import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      },
    );

    if (response.ok) setSuccess(true);
    else setError("Token is invalid or expired. Please request a new link.");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h4 className="mb-4">Reset Password</h4>
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

          {success ? (
            <div>
              <p>Your password has been reset successfully.</p>
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
