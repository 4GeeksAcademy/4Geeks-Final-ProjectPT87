import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Navbar = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const { store, dispatch } = useGlobalReducer();
  
  // Adding this for when we add login/logout functionality.
  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // Can change the names of login/signup if needed, just adding them for now.
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Running App</span>
        </Link>

        {/* Placeholder button to make it easier to get to the profile page will remove it later. */}
        <div className="ml-auto">
          <Link to="/profile" className="btn btn-outline-secondary me-2">
            Placeholder Profile Button
          </Link>

          {!token ? (
            <>
              <Link to="/account" className="btn btn-outline-primary me-2">
                Login/Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-outline-secondary me-2">
                My Profile
              </Link>

              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </>
          )}
        </div>

        {/* FAVORITES DROPDOWN */}
        <div className="dropdown">
          <button
            className="btn btn-warning dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Favorites ({store.favorites.length})
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            {store.favorites.length === 0 ? (
              <li className="dropdown-item text-muted">
                No favorites yet
              </li>
            ) : (
              store.favorites.map((fav, index) => (
                <li
                  key={index}
                  className="dropdown-item d-flex justify-content-between align-items-center"
                >
                  <Link
                    to={`/${fav.type}s/${fav.uid}`}
                    className="text-decoration-none text-dark"
                  >
                    {fav.name}
                  </Link>

                  <button
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => dispatch({
                      type: "remove_favorite",
                      payload: { id: fav.id, type: fav.type } // payload includes both uid and type to identify the favorite to remove
                    })}
                  >
                    🗑
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
