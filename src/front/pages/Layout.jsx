import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = ({ runner }) => {
    const { store, dispatch, fetchFavorites } = useGlobalReducer();
    const [favorites, setFavorites] = useState([]);
  
    useEffect(() => {
      fetchFavorites();
      setFavorites(store.favorites);
    }, []);
  
    useEffect(() => {
      setFavorites(store.favorites);
    }, [store.favorites]);

  return (
    <ScrollToTop>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ScrollToTop>
  );
};
