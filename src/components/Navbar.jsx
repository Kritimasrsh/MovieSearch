import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (e, id) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          MovieSearch
        </Link>
        <div className="nav-links hide-scrollbar">
          <Link to="/" className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</Link>
          <a href="/#trending" className="nav-link" onClick={(e) => handleScroll(e, "trending")}>Trending</a>
          <a href="/#top-rated" className="nav-link" onClick={(e) => handleScroll(e, "top-rated")}>Top Rated</a>
          <a href="/#upcoming" className="nav-link" onClick={(e) => handleScroll(e, "upcoming")}>Upcoming</a>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="theme-toggle"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}