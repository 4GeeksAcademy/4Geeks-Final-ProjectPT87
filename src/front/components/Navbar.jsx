import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Velocity from "../assets/img/Velocity_Logo.jpg";

export const Navbar = () => {
  const navigate = useNavigate();
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  const { store, dispatch } = useGlobalReducer();

  // Adding this for when we add login/logout functionality.
  const logout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    navigate("/account");
  };

  // Can change the names of login/signup if needed, just adding them for now.
  return (
    <nav className="navbar custom-navbar">
      <div className="container">
        <Link to="/">

          <img src={Velocity} alt="Running Home Logo" className="logo" />
          
        </Link>

        {/* Placeholder button to make it easier to get to the profile page will remove it later. */}
        <div className="ms-auto d-flex align-items-center gap-2">
          {!token ? (
            <Link to="/account" className="nav-btn">
              Account
            </Link>
          ) : (
            <>
              <Link to="/strava" className="nav-btn">
                Strava
              </Link>

              {/* FAVORITES DROPDOWN */}
              <div className="dropdown">
                <button
                  className="nav-btn dropdown-toggle"
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
                          to={`/single_runner/${fav.runner.id}/${index}`}
                          className="text-decoration-none"
                        >
                          {fav.runner.name}
                        </Link>

                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() =>
                            dispatch({
                              type: "remove_favorite",
                              payload: { id: fav.id, type: fav.type }, // payload includes both uid and type to identify the favorite to remove
                            })
                          }
                        >
                          🗑
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <button onClick={logout} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
