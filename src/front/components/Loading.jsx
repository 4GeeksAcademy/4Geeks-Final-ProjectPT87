import { useEffect, useState } from "react";
import Spinner from "../components/Spinner.jsx";
import Home from "../pages/Home";

// A component that shows a loading message for 2 seconds before rendering the Home component. 
// This exist just incase the page takes too long to load

function Loading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return loading ? <Spinner /> : <Home />;
}

export default Loading;