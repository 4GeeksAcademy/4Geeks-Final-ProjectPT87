import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // Adding this for when we add login/logout functionality.
  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // Can change the names of login/signup if needed, just adding them for now.
  return (
    <nav className="navbar custom-navbar">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Running App</span>
        </Link>

        {/* Placeholder button to make it easier to get to the profile page will remove it later. */}
        <div className="ms-auto">
          <Link to="/profile" className="nav-btn">
            Placeholder Profile Button
          </Link>

          {!token ? (
            <>
              <Link to="/account" className="nav-btn">
                Login/Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="nav-btn">
                My Profile
              </Link>

              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
